import asyncio
import http
import logging
import json
from logging.handlers import QueueHandler
import fastapi
import huggingface_hub
from fastapi import FastAPI, Body, Response
from typing import Annotated
from sse_starlette import EventSourceResponse
from fastapi.middleware.cors import CORSMiddleware
from src.config import get_config
from src.db.db import Connection
from dotenv import load_dotenv
import uvicorn
from src.huggingface.client import Client
from pydantic import BaseModel
from flow_merge.lib.constants import MergeMethodIdentifier
from flow_merge.lib.merge_runner import run_merge
import flow_merge
from flow_merge.lib.utils import upload_model_to_hub

load_dotenv(override=True)

app_config = get_config()
db = Connection(app_config.db_name)
hf_client = Client(app_config.hf_api_key)


def main():
    """Launched with `poetry run serve` defined in pyproject.toml"""
    uvicorn.run("src.app:app", host="0.0.0.0", port=8000, reload=True)


def get_logging_queue():
    logger = logging.getLogger(flow_merge.__name__)
    for handler in logger.handlers[:]:
        if type(handler) != QueueHandler:
            logger.removeHandler(handler)

    logs_queue = asyncio.Queue()
    handler = QueueHandler(logs_queue)
    handler.setLevel(logging.INFO)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

    return logs_queue


logs_queue = get_logging_queue()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def healthcheck():
    return {
        "status": "doing great",
        "env": app_config.app_env,
    }


@app.post("/api/v1/models/search")
async def search_models(resp: Response, body: dict = Body(...)):
    if body.get("keyword") is None:
        resp.status_code = http.HTTPStatus.BAD_REQUEST
        return {
            "message": "missing search keyword"
        }

    results = await hf_client.search_model(body.get("keyword"))
    return results


async def queue_to_async_iter(queue):
    try:
        while True:
            log = await queue.get()
            yield log
    except asyncio.CancelledError as e:
        # log and flush queue
        pass


@app.get("/api/v1/logs")
async def stream_logs():
    return EventSourceResponse(queue_to_async_iter(logs_queue))


class MergeBody(BaseModel):
    uuid: str
    merge_name: str | None
    merge_date: str
    config: dict
    hf_api_key: str


async def iterate_queue(queue):
    while True:
        log = await queue.get()
        yield log
        if queue.empty():
            break


@app.post("/api/v1/merges")
async def merge(response: Response, details: MergeBody):
    logs = []
    logging_queue = get_logging_queue()

    if len(details.config["models"]) < 2:
        response.status_code = http.HTTPStatus.BAD_REQUEST
        return {
            "message": "IncorrectConfig: pass at least 2 models"
        }

    if (details.config["method"] not in [
        MergeMethodIdentifier.ADDITION_TASK_ARITHMETIC,
        MergeMethodIdentifier.DARE_TIES_MERGING,
        MergeMethodIdentifier.MODEL_SOUP,
        MergeMethodIdentifier.PASSTHROUGH,
        MergeMethodIdentifier.TIES_MERGING,
        MergeMethodIdentifier.SLERP
    ]):
        response.status_code = http.HTTPStatus.BAD_REQUEST
        return {
            "message": f"IncorrectConfig: method:{details.config['method']} not one of supported methods"
        }

    try:
        run_merge(config={
            **details.config,
            "hf_hub_settings": {
                "token": details.hf_api_key,
            },
            "directory_settings": {
                "output_dir": app_config.output_dir
            }
        })
    except Exception as e:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error running merge: {e}",
        )

    async for log in iterate_queue(logging_queue):
        logs.append(logging.Formatter().format(record=log))

    if logging_queue.empty():
        db.execute(
            "INSERT INTO merges (merge_name, uuid, merge_date, output_dir_path, log_stream, merge_config) VALUES (?, ?, ?, ?, ?, ?)",
            (
                details.merge_name,
                details.uuid,
                details.merge_date,
                app_config.output_dir,
                json.dumps(logs),
                json.dumps(details.config)

            ))

    return Response(status_code=fastapi.status.HTTP_200_OK)


@app.get("/api/v1/merges")
async def merges(limit: int = 100, offset: int = 0):
    results = db.query("SELECT * FROM merges LIMIT ? OFFSET ?", (limit, offset))
    paginated_response = [{
        "merge_name": r[0],
        "uuid": r[1],
        "merge_date": r[2],
        "output_dir_path": r[3],
        "log_stream": r[4],
        "merge_config": r[5],
    } for r in results]
    return paginated_response


@app.post("/api/v1/hf-api-key")
async def validate_hf_api_key(api_key: Annotated[str, Body(embed=True)]):
    token_permissions = huggingface_hub.get_token_permission(api_key)

    if token_permissions is None:
        raise fastapi.HTTPException(status_code=fastapi.status.HTTP_401_UNAUTHORIZED, detail="Incorrect API key")

    return Response(status_code=fastapi.status.HTTP_200_OK)


@app.delete("/api/v1/merges/{uuid}")
async def delete_merge(uuid: str):
    entry = db.query("SELECT * FROM merges WHERE uuid=?", (uuid,))
    if entry is None or len(entry) == 0:
        raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND)

    # Todo: remove files from disk. Ensure correct directory is removed to avoid potential issues

    db.execute("DELETE FROM merges WHERE uuid=?", (uuid,))
    return Response(status_code=fastapi.status.HTTP_200_OK)


@app.post("/api/v1/merges/{uuid}/hf-hub")
async def push_merge(
        uuid: str,
        api_key: Annotated[str, Body(embed=True)],
        repo_id: Annotated[str, Body(embed=True)],
        privacy: Annotated[str, Body(embed=True)],
):
    db_record = db.query("SELECT * FROM merges WHERE uuid=?", (uuid,))
    if db_record is None or len(db_record) == 0:
        raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND)

    [username, model_name] = repo_id.split("/")

    try:
        upload_model_to_hub(
            model_dir=db_record[0][3],
            username=username,
            model_name=model_name,
            private=privacy == "private",
            token=api_key,
        )
    except Exception as e:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading the model: {e}",
        )

    return Response(status_code=fastapi.status.HTTP_200_OK)

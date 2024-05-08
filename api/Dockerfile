FROM python:3.11-bullseye AS build
WORKDIR /tmp/build
COPY . /tmp/build

RUN \
    # Install poetry
    export POETRY_HOME=/opt/poetry && \
    python3 -m venv $POETRY_HOME && \
    $POETRY_HOME/bin/pip install poetry==1.8.0 && \
    #
    # Install dependencies \
    $POETRY_HOME/bin/poetry config virtualenvs.in-project true && \
    $POETRY_HOME/bin/poetry install --without dev

FROM python:3.11-bullseye
WORKDIR /opt/llm-lab-api
EXPOSE 8000

COPY --from=build /tmp/build /opt/llm-lab-api
RUN chown 1000:1000 /opt/llm-lab-api -R
USER 1000:1000
CMD [".venv/bin/python", "-m", "uvicorn", "--host=0.0.0.0", "--port=8000" , "src.app:app"]


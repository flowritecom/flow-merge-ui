import asyncio
from itertools import chain
from typing import List
from huggingface_hub import HfApi


class Client:
    _api_key: str
    _pipeline_tags = ["text-generation", "text2text-generation", "text-classification", "token-classification", ]

    def __init__(self, api_key: str):
        self._api_key = api_key
        self.client = HfApi(token=api_key)

    async def search_model(self, keyword: str):
        tasks = [self.fetch_results(tag, keyword) for tag in self._pipeline_tags]
        results = await asyncio.gather(*tasks)
        flat_results = list(chain.from_iterable(results))
        flat_results.sort(key=lambda record: record.likes, reverse=True)
        return flat_results

    async def fetch_results(self, tag: str, keyword: str) -> List:
        return list(self.client.list_models(pipeline_tag=tag, search=keyword or "", limit=10, sort="likes"))
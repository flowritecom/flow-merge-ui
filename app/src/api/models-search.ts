import { GlobalStoreType } from "../stores/store";

export async function requestSearch(store: GlobalStoreType, keyword: string) {
  const response = await fetch(store.apiUrl + `/api/v1/models/search`, {
    method: "POST",
    body: JSON.stringify({ keyword }),
    headers: {
      "content-type": "application/json"
    }
  })

  if (!response.ok) {
    throw "invalid response";
  }

  return await response.json()
}

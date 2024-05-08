import { defineStore } from "pinia";

export type GlobalStoreProperties =
  | {
      key: "hfApiKey" | "apiUrl";
      value: string | null;
    }
  | {
      key: "merges";
      value: Merge[];
    }
  | {
      key: "mergesLoaded";
      value: boolean;
    }
  | {
      key: "defaultSearchResults";
      value: object[];
    };

const initialState = {
  /** @type {string | null} */
  hfApiKey: null,
  /** @type {string | null} */
  apiUrl: process.env.VUE_APP_API_URL,
  /** @type Array<Merge> */
  merges: [],
  mergesLoaded: false,
  defaultSearchResults: [],
};

const useStore = defineStore({
  id: "global",
  state: () => ({ ...initialState }),
  getters: {},
  actions: {
    setProperty({ key, value }: GlobalStoreProperties) {
      (this as any)[key] = value;
    },
  },
});

type GlobalStoreType = ReturnType<typeof useStore>;

export { useStore, GlobalStoreType };

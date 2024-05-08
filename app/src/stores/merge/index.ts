import { defineStore } from "pinia";
import { v4 as uuid4 } from "uuid";
import { useStore } from "../store";
import { SSEvent } from "sse.js";
import { formatModels, hasDefault, createPayloadModel } from "./utils";

import {
  MergeConfig,
  MergeMethod,
  MethodConfig,
  ModelConfig,
  TokenizerConfig,
} from "src/typings/Merge";

export type MergeStoreProperties =
  | {
      key:
        | "selectedMergeMethod"
        | "tokenizer"
        | "tokenizerMethod"
        | "mergeName";
      value: string | null;
    }
  | {
      key:
        | "topK"
        | "scalingCoefficient"
        | "t"
        | "p"
        | "selectedBaseModelWeights"
        | "selectedModelWeights";
      value: number | null;
    }
  | { key: "merging"; value: boolean }
  | { key: "logs"; value: string[] | null }
  | {
      key: "selectedModel";
      value: any;
    };

type ModelInfo = {
  name: string;
  downloads: string;
  parameters: string;
  likes: string;
  type: string;
};

type ModelState = {
  info: ModelInfo;
  weight: number;
};

const initialState = {
  /** @type {string | null} */
  mergeName: null,
  /** @type {{MergeMethod} | null} */
  selectedMergeMethod: null,
  /** @type {'base' | 'merged'} */
  tokenizer: "base",
  /** @type {'linear'} */
  tokenizerMethod: "linear",
  /** @type {ModelState[] | null} */
  selectedModels: [{}],
  /** @type {{ name: string, downloads: string, parameters: string, likes: string, type: string, weight?: number } | null} */
  /** @type {{number[]}} */
  selectedModelsWeights: [null],
  selectedBaseModel: null,
  /** @type {number} */
  selectedBaseModelWeight: 0.5,
  /** @type {number | null} */
  /* default value to differentiate from range selection of 0 */
  topK: 0.5,
  /** @type {number | null} */
  p: null,
  /** @type {number | null} */
  scalingCoefficient: 0.5,
  /** @type {boolean} */
  normalize: false,
  /** @type {number | null} */
  t: null, // default to 0.5
};

const useMergeStore = defineStore({
  id: "merge",
  state: () => ({ ...initialState }),
  getters: {},
  actions: {
    setProperty({ key, value }: MergeStoreProperties) {
      (this as any)[key] = value;
    },
    appendToList({ key, value }: any) {
      (this as any)[key] = [...(this as any)[key], value];
    },
    async merge() {
      const uuid = uuid4();
      const store = useStore();
      const date = new Date().toISOString();
      const [baseModel, models] = formatModels(
        this.selectedBaseModel,
        this.selectedModels,
        this.selectedBaseModelWeight,
        this.selectedModelsWeights
      );

      const tokenizer_config: TokenizerConfig = {
        mode: this.tokenizer,
        interpolation_method: this.tokenizerMethod,
      };

      const method_global_parameters: MethodConfig = {
        scaling_coefficient: hasDefault(this.scalingCoefficient),
        top_k: hasDefault(this.topK),
        p: hasDefault(this.p),
        t: hasDefault(this.t),
        normalize: this.normalize,
      };

      const merge_config: MergeConfig = {
        method: this.selectedMergeMethod as any,
        method_global_parameters,
        base_model: hasDefault(baseModel),
        models: hasDefault(models, []),
        tokenizer_config,
      };

      try {
        const resp = await fetch((store.apiUrl as string) + "/api/v1/merges", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            /* payload */
            hf_api_key: (store.hfApiKey as string),
            config: merge_config,
            uuid,
            merge_name: this.mergeName ? this.mergeName : `my_merge`,
            merge_date: date,
          }),
        });

        if (resp.status != 200) {
          alert("An error has occurred in the merge request. Try again later.");
        }
      } catch (e) {
        alert("An error has occurred in the merge request. Try again later.");
      }
    },
  },
});

export { useMergeStore };

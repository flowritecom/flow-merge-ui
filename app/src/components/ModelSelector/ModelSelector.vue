<template>
  <PopupSelector
    class="mt-6"
    :options="options"
    v-model="selectedModel"
    search-placeholder="Search for models on HF"
    :loading="loading"
    @input="e => search(e.target!.value)"
    @before-open="prefetchModels"
    @closed="error = null"
    :error="error"
  >
    <template #trigger-button>
      <svg
        width="14"
        height="14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="mr-2"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.2 1.8a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8ZM.6 6.2a5.6 5.6 0 1 1 9.962 3.513l2.662 2.663a.6.6 0 1 1-.848.848l-2.663-2.662A5.6 5.6 0 0 1 .6 6.2Z"
          fill="#525963"
        />
      </svg>
      Select a model
    </template>
    <template #list-option="{ option, onClick }">
      <ListElement
        @click="onClick"
        :downloads="option.downloads"
        :id="option.id"
        :pipeline_tag="option.pipeline_tag"
        :likes="option.likes"
      ></ListElement>
    </template>
    <template #selected-trigger-button>
      <div class="selected-popup-selector-btn">
        <ListElement
          v-if="selectedModel"
          class="hover:bg-white w-full"
          :downloads="selectedModel.downloads"
          :id="selectedModel.id"
          :pipeline_tag="selectedModel.pipeline_tag"
          :likes="selectedModel.likes"
        />

        <svg
          class="ml-auto"
          width="10"
          height="18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.636 1.164a.9.9 0 0 0-1.272 0l-3.9 3.9a.9.9 0 0 0 1.272 1.272L5 3.072l3.264 3.264a.9.9 0 1 0 1.272-1.272l-3.9-3.9ZM.464 12.936l3.9 3.9a.9.9 0 0 0 1.272 0l3.9-3.9a.9.9 0 1 0-1.272-1.272L5 14.928l-3.264-3.264a.9.9 0 0 0-1.272 1.272Z"
            fill="#A7ACB4"
          />
        </svg>
      </div>
    </template>
  </PopupSelector>
</template>
<script setup lang="ts">
import PopupSelector from "../PopupSelector.vue";
import ListElement from "./ListElement.vue";
import { ref } from "vue";
import { useStore } from "../../stores/store";
import { requestSearch } from "../../api/models-search";

const store = useStore();

const selectedModel = defineModel<{
  id: string;
  pipeline_tag: string;
  downloads: number;
  likes: number;
}>();

// @ts-ignore
const debounceTimers = [] as Array<Timeout>;
const options = ref<Array<object>>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// Load default models for freshly opened popup
async function prefetchModels() {
  options.value = store.defaultSearchResults;
}

async function search(keyword: string) {
  if (keyword.trim().length < 3) {
    return;
  }

  await fetchModels(keyword);
}

async function fetchModels(keyword: string) {
  loading.value = true;
  debounceTimers.forEach((t) => clearTimeout(t));
  debounceTimers.push(
    setTimeout(async () => {
      // Todo: replace me with "API Client" wrapper, handling errors, encoding, headers etc.
      try {
        error.value = "";
        options.value = await requestSearch(store, keyword);
      } catch (e) {
        error.value = "An error has occurred when searching. Try again later.";
        console.error(e);
      } finally {
        loading.value = false;
      }
    }, 300)
  );
}
</script>
<style scoped></style>

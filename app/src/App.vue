<template>
  <router-view v-if="minimalViewportSize"></router-view>
  <h-f-key-validation-popup
    :show="showKeyValidationPopup"
  ></h-f-key-validation-popup>
  <ViewportIncompatibilityPopup v-if="!minimalViewportSize" />
  <ModalsContainer />
</template>
<script setup lang="ts">
import { ModalsContainer } from "vue-final-modal";
import { useStore } from "./stores/store";
import { requestSearch } from "./api/models-search";
import { onMounted, ref } from "vue";
import HFKeyValidationPopup from "./components/HFKeyValidationPopup.vue";
import ViewportIncompatibilityPopup from "./components/ViewportIncompatibilityPopup.vue";

const store = useStore();
store.setProperty({ key: "apiUrl", value: process.env.VUE_APP_API_URL! });

// Track viewport size
const minimalViewportSize = ref<boolean>(false);
const minimalRequiredWidth = 1024;
onMounted(() => {
  minimalViewportSize.value = window.innerWidth > minimalRequiredWidth;

  window.addEventListener("resize", () => {
    minimalViewportSize.value = window.innerWidth > minimalRequiredWidth;
  });
});

// Fetch default search results
onMounted(async () => {
  try {
    const results = await requestSearch(store, "");
    store.setProperty({ key: "defaultSearchResults", value: results });
  } catch (e) {
    console.error(e);
  }
});

// Require HF API key
const showKeyValidationPopup = ref<boolean>(false);
onMounted(() => {
  const storedKey = localStorage.getItem("llm-lab-hf-api-key");
  if (!storedKey) {
    showKeyValidationPopup.value = true;
    return;
  }

  store.setProperty({ key: "hfApiKey", value: storedKey });
});
</script>
<style></style>

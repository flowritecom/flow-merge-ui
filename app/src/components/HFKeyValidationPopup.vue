<template>
  <vue-final-modal
      v-model="showModal"
      :click-to-close="false"
      :lock-scroll="true"
      :esc-to-close="false"
      class="flex justify-center items-center"
      content-transition="popup-fade"
      overlay-transition="popup-fade"
      overlay-style="background-color:#00000019"
      content-class="shadow-popup w-[500px] p-3 bg-white/10 rounded-2xl border border-px border-white/20 backdrop-blur-xl"
  >
    <div class="bg-white p-12 rounded-2xl flex flex-col gap-4 items-center">
      <div>
        <img src="assets/img/key.png" height="55" class="disappearing select-none mx-auto" draggable="false">
        <h2 class="text-gray-800">
          {{ success ? "Validation successful" : "Validate your HF API key" }}
        </h2>
      </div>

      <p class="text-small text-gray-500" v-if="!success">Your API key will be used for pulling models from HF Hub.</p>
      <p class="text-small text-gray-500" v-else>You can now proceed to creating your first merge.</p>

      <Input type="password" placeholder="Your Hugging Face API key" class="self-stretch" v-model="apiKey" :error="validationError"/>
      <Button class="self-stretch" @click="validateKey" :disabled="inProgress || !apiKey " v-if="!success">
        <img src="assets/img/spinner-small.png" width="12" height="12" class="animate-spin" v-show="inProgress">
        Validate
      </Button>
      <Button v-else class="self-stretch" @click="showModal = false">Create a model merge</Button>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">

import { VueFinalModal } from "vue-final-modal";
import Input from "./Input.vue";
import Button from "./Button.vue";
import { ref, watch } from "vue";
import { useStore } from "../stores/store";

// Modal management
const showModal = ref<boolean>(false)
const props = defineProps<{
  show: boolean
}>()
const store = useStore()

watch(() => props.show, (newVal: boolean) => {
  showModal.value = newVal
})

// Key validation
const apiKey = ref<string>()
const validationError = ref<string>()
const inProgress = ref<boolean>(false)
const success = ref<boolean>(false)

async function validateKey() {
  let response: Response | null = null
  inProgress.value = true;
  validationError.value = "";
  try {
    response = await fetch(store.apiUrl + `/api/v1/hf-api-key`, {
      method: "POST",
      headers: { "content-type": 'application/json' },
      body: JSON.stringify({ api_key: apiKey.value })
    });
  } catch (e) {
    validationError.value = "An error has occurred during API key validation."
    console.error(e)
    return
  } finally {
    inProgress.value = false
  }

  if (response?.status !== 200) {
    validationError.value = "Entered API key is invalid."
    return;
  }

  success.value = true
  store.setProperty({ key: "hfApiKey", value: apiKey.value! })
  localStorage.setItem("llm-lab-hf-api-key", apiKey.value!)
}
</script>

<style scoped>

</style>

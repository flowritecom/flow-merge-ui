<template>
  <vue-final-modal
      v-model="showModal"
      :lock-scroll="true"
      class="flex justify-center items-center"
      content-transition="popup-fade"
      overlay-transition="popup-fade"
      overlay-style="background-color:#00000019"
      content-class="shadow-popup p-3 bg-white/10 rounded-2xl border border-px border-white/20 backdrop-blur-xl"
      @closed="$emit('closed')"
  >
    <div class="bg-white w-[530px] p-12 rounded-2xl flex flex-col gap-6 items-center">
      <div>
        <img src="assets/img/hugginface.png" width="80" class="disappearing select-none mx-auto" draggable="false">
        <h2 class="text-gray-800" v-if="!success">Push to Hub</h2>
        <h2 class="text-gray-800" v-else>Push to Hub completed</h2>
      </div>

      <div class="grid gap-6 items-center text-gray-700 w-full" style="grid-template-columns: 1fr 2fr">
        <div>API key</div>
        <Input placeholder="API Key" type="password" v-model="apiKey" :disabled="inProgress"/>

        <div>Repository ID</div>
        <Input placeholder="ID of the repo to which you push" v-model="repoId" :disabled="inProgress"/>

        <div>Privacy</div>
        <Switch name="privacy" :disabled="inProgress" :options="[{id:'public', 'label': 'Public', 'value': 'public'},{id:'private', 'label': 'Private', 'value': 'private'}]" v-model="privacy"></Switch>
      </div>

      <p v-if="error" class="text-red-400 text-small">
        {{ error }}
      </p>

      <Button class="self-stretch" @click="pushToHub" :class="{disabled: inProgress}" :disabled="inProgress">
        <img src="assets/img/spinner-small.png" width="12" height="12" class="animate-spin" v-if="inProgress"> Push to Hub
      </Button>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">

import { VueFinalModal } from "vue-final-modal";
import Input from "./Input.vue";
import Button from "./Button.vue";
import { ref, watch } from "vue";
import Switch from "./Switch.vue";
import { useStore } from "../stores/store";

const store = useStore();

// Error handling
const error = ref<string | null>(null)
const success = ref<boolean | null>(false);
const inProgress = ref<boolean>(false);

// Displaying modal
const showModal = ref<boolean>(false)
const props = defineProps<{
  show: boolean
  mergeUUID: string
}>();
watch(() => props.show, newVal => showModal.value = newVal)
defineEmits<{
  (e: 'closed'): void,
}>()

// Form data
const apiKey = ref<string>(store.hfApiKey ?? "");
const privacy = ref<'public' | 'private'>('public');
const repoId = ref<string>();

async function pushToHub() {
  try {
    inProgress.value = true;
    error.value = null;

    const resp = await fetch(store.apiUrl + `/api/v1/merges/${props.mergeUUID}/hf-hub`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        api_key: apiKey.value,
        privacy: privacy.value,
        repo_id: repoId.value,
      })
    })

    if (resp.status !== 200) {
      error.value = "An error has occurred when uploading the model."
      return
    }

    success.value = true;
  } catch (e) {
    console.error(e)
    error.value = "An error has occurred when uploading the model."
  } finally {
    inProgress.value = false;
  }
}
</script>

<style scoped>

</style>

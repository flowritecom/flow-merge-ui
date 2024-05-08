<template>
  <vue-final-modal
      v-model="showModal"
      :click-to-close="true"
      :lock-scroll="true"
      class="flex justify-center items-center"
      content-transition="popup-fade"
      overlay-transition="popup-fade"
      overlay-style="background-color:#00000019"
      content-class="shadow-popup p-3 bg-white/10 rounded-2xl border border-px border-white/20 backdrop-blur-xl h-[395px]"
      @opened="listen"
      @closed="close"
  >
    <div class="bg-white p-12 rounded-2xl flex gap-12 h-full">
      <div class="w-[288px] flex flex-col gap-4 items-center">
        <div>
          <div class="disappearing-lower relative mx-auto">
            <!-- Spinner -->
            <div class="loading-spinner animate-spin h-[150px] w-[150px] mx-auto" v-if="inProgress"></div>

            <!-- Check -->
            <svg v-if="!inProgress && !hasError" width="160" height="145" class="mx-auto translate-x-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m5 80 60 60L155 5" stroke="#F5F6F7" stroke-width="7" stroke-linecap="square" stroke-linejoin="round"/>
            </svg>

            <!-- Spinner placeholder for error state -->
            <div v-if="!inProgress && hasError" class="h-[150px] w-[150px] mx-auto"></div>

            <!-- MG letters -->
            <img src="assets/img/mg.png" width="101" class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" draggable="false">
          </div>

          <!-- Title -->
          <h2 class="mx-auto text-gray-800 -mt-6">{{ inProgress ? "Merge in progress" : (hasError ? "Merge discontinued" : "Merge completed") }}</h2>
        </div>

        <p class="text-small text-gray-500 text-center" v-if="inProgress && !hasError">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
        </p>

        <!-- Done and no errors -->
        <Button v-if="!inProgress && !hasError" class="self-stretch" @click="router.push('/')">Explore my merges</Button>

        <!-- Done and errors -->
        <Button v-if="hasError" class="self-stretch" @click="close()">Adjust and try again</Button>
      </div>

      <div class="w-[384px]">
        <div class="bg-gray-50 text-gray-600 rounded-lg-2 p-4 h-full text-tiny font-mono font-medium overflow-auto">
          <pre
              v-for="log in logs"
              :class="{
                'text-red-400': log.match(/Merge error/),
                'text-green-500': log.match(/Merge completed/)
              }">{{ log }}</pre>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">

import { VueFinalModal } from "vue-final-modal";
import { ref, watch } from "vue";
import Button from "./Button.vue";
import { SSE } from "sse.js";
import { useStore } from "../stores/store";
import { useRouter } from "vue-router";

const emit = defineEmits<{
  (e: 'closed'): void
}>()

const showModal = ref(false)
const inProgress = ref<boolean>(true);
const hasError = ref<boolean>(false);
const props = defineProps<{
  show: boolean
}>();
watch(() => props.show, (newVal: boolean) => {
  showModal.value = newVal
  inProgress.value = true
  hasError.value = false
})

function close() {
  closeSSE();
  showModal.value = false;
  emit('closed');
}

const store = useStore();
const router = useRouter();

// Stream logs
const logs = ref<string[]>([]);
let client: SSE | null = null;

function listen() {
  client = new SSE(store.apiUrl + "/api/v1/logs")
  client.addEventListener("message", (e: MessageEvent) => {
    logs.value.push(e.data)

    if (e.data.match(/Merge completed/)) {
      inProgress.value = false
      client!.close()
      return
    }

    if (e.data.match(/Merge error/)) {
      inProgress.value = false
      hasError.value = true
      client!.close()
      return
    }
  })
}

function closeSSE() {
  if (client) {
    client.close()
    client = null
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="w-full flex h-full">
    <!-- body -->
    <div class="flex-1 flex justify-center">
      <div class="w-2/3 max-w-[800px] px-12 pt-20 mb-24">
        <div class="flex items-center">
          <h3 class="text-gray-800">My merges</h3>

          <Button @click="router.push('/new')" class="ml-auto py-1.5">
            <svg
              width="15"
              height="14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.5 12.6a5.6 5.6 0 1 0 0-11.2 5.6 5.6 0 0 0 0 11.2Zm.525-7.875a.525.525 0 0 0-1.05 0v1.75h-1.75a.525.525 0 0 0 0 1.05h1.75v1.75a.525.525 0 1 0 1.05 0v-1.75h1.75a.525.525 0 1 0 0-1.05h-1.75v-1.75Z"
                fill="#fff"
              />
            </svg>
            Create new
          </Button>
        </div>

        <hr class="my-8" />

        <img
          src="assets/img/spinner-small.png"
          width="12"
          height="12"
          class="animate-spin mx-auto"
          v-if="loading"
        />

        <div class="flex flex-col gap-2" v-if="!error && !loading">
          <div
            v-for="m of store.merges"
            class="merge-list-element"
            :class="{ selected: selectedMerge === m }"
            @click="
              () => {
                selectedMerge = m;
                selectedMergeConfig = JSON.parse((m as Merge).merge_config)
              }
            "
          >
            <div class="text-gray-700 text-body">
              {{ (m as Merge).merge_name }}
            </div>
            <div
              class="ml-auto text-gray-500 text-label tracking-label uppercase"
            >
              {{ (m as Merge).merge_date }}
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-700">
          {{ error }}
        </div>
      </div>
    </div>

    <!-- sidebar -->
    <div
      class="bg-white w-1/3 px-10 pt-20 pb-10 flex flex-col sticky top-0 right-0 h-screen"
      :class="{ 'blur-sm': loading, 'select-none': loading }"
    >
      <h3 class="text-gray-800">{{ selectedMerge?.merge_name }}</h3>

      <hr class="my-6" />

      <div class="text-small text-gray-700 mb-2">Merge</div>
      <div class="text-extra-small text-gray-500 grid grid-cols-2 gap-2">
        Merging method
        <span class="font-mono text-gray-700">{{
          selectedMergeConfig?.method
        }}</span>
        Top-k
        <span class="font-mono text-gray-700">{{
          selectedMergeConfig?.method_global_parameters?.top_k
        }}</span>
        Scaling coefficient
        <span class="font-mono text-gray-700">{{
          selectedMergeConfig?.method_global_parameters?.scaling_coefficient
        }}</span>
        Base model
        <span class="font-mono text-gray-700">{{
          selectedMergeConfig?.base_model
        }}</span>
        Merge model
        <span class="font-mono text-gray-700"
          ><div v-for="model in selectedMergeConfig?.models">
            {{ model?.model + "\n\n\n" }}
          </div></span
        >
      </div>

      <hr class="my-6" />

      <div class="text-small text-gray-700 mb-2">Tokenizer</div>
      <div class="text-extra-small text-gray-500 grid grid-cols-2 gap-2">
        Tokenizer
        <span class="font-mono text-gray-700">{{
          selectedMergeConfig?.tokenizer_config.mode
        }}</span>
        Tokenizer method
        <span class="font-mono text-gray-700">{{
          selectedMergeConfig?.tokenizer_config.interpolation_method
        }}</span>
      </div>

      <div class="flex mt-auto gap-4">
        <Button class="self-stretch flex-1" @click="showPushPopup = true">
          <svg
            width="12"
            height="14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.388 1.335a.525.525 0 0 0-.904-.46l-5.95 6.65a.525.525 0 0 0 .391.875h4.6l-.913 4.265a.525.525 0 0 0 .905.46l5.95-6.65a.525.525 0 0 0-.392-.875h-4.6l.913-4.265Z"
              fill="#fff"
            />
          </svg>
          Push to Hub
        </Button>
        <push-to-hub-popup
          v-if="selectedMerge"
          :show="showPushPopup"
          :mergeUUID="selectedMerge!.uuid!"
          @closed="showPushPopup = false"
        />

        <button
          class="w-1/4 text-gray-500 text-body px-3 py-3 gap-1.5 flex items-center justify-center hover:text-gray-700 transition-all duration-150"
          @click="showDeletionPopup = true"
        >
          <svg
            width="10"
            height="14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.125.7A1.925 1.925 0 0 0 2.2 2.625v.31a28.58 28.58 0 0 0-1.655.209.525.525 0 1 0 .161 1.037l.104-.015.589 7.362A1.925 1.925 0 0 0 3.318 13.3h3.365a1.925 1.925 0 0 0 1.919-1.771l.589-7.364.104.016a.525.525 0 0 0 .161-1.037A28.728 28.728 0 0 0 7.8 2.935v-.31A1.925 1.925 0 0 0 5.875.7h-1.75ZM5 2.8c.588 0 1.172.017 1.75.052v-.227a.875.875 0 0 0-.875-.875h-1.75a.875.875 0 0 0-.875.875v.227A28.987 28.987 0 0 1 5 2.8Zm-.994 2.604a.525.525 0 1 0-1.05.042l.21 5.25a.526.526 0 0 0 1.05-.042l-.21-5.25Zm3.038.042a.526.526 0 0 0-1.05-.042l-.21 5.25a.526.526 0 0 0 1.05.042l.21-5.25Z"
              fill="#7C838D"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
    <delete-confirmation-popup
      :show="showDeletionPopup"
      @closed="showDeletionPopup = false"
      @confirmed="deleteMerge"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "../components/Button.vue";
import { ref } from "vue";
import { useStore } from "../stores/store";
import DeleteConfirmationPopup from "../components/DeleteConfirmationPopup.vue";
import PushToHubPopup from "../components/PushToHubPopup.vue";

const router = useRouter();
const store = useStore();

const loading = ref<boolean>(false);
const error = ref<string>("");
const selectedMerge = ref<Merge | null>(null);
const selectedMergeConfig = ref<any | null>(null);

(async () => {
  await loadMerges();
  selectFirstMerge();
})();

// Load merges
async function loadMerges() {
  if (store.mergesLoaded) {
    return;
  }

  loading.value = true;
  try {
    const resp = await fetch(store.apiUrl + "/api/v1/merges");
    if (resp.status != 200) {
      error.value = "Error retrieving merge history.";
      console.error("Invalid merging history response", resp);
      return;
    }

    const merges = await resp.json();

    store.setProperty({ key: "merges", value: merges });

    // If there are no merges in history, force creating new merge
    if (merges.length === 0) {
      await router.push("/new");
      return;
    }

    store.setProperty({ key: "mergesLoaded", value: true });
  } catch (e) {
    error.value = "Error retrieving merge history.";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function selectFirstMerge() {
  if (store.merges.length == 0) {
    router.push("/new");
    return;
  }

  selectedMerge.value = store.merges[0];
}

// Deleting merge
const showDeletionPopup = ref<boolean>(false);

async function deleteMerge() {
  showDeletionPopup.value = false;
  try {
    const resp = await fetch(
      store.apiUrl + `/api/v1/merges/${selectedMerge.value?.uuid}`,
      {
        method: "DELETE",
      }
    );
    if (resp.status != 200) {
      alert("An error has occurred when deleting the merge. Try again later.");
      console.error("Error deleting merge, unexpected response code", resp);
      return;
    }

    store.setProperty({ key: "mergesLoaded", value: false });
    await loadMerges();
    selectFirstMerge();
  } catch (e) {
    alert("An error has occurred when deleting the merge. Try again later.");
    console.error("Error deleting merge, unexpected response code", e);
  }
}

// Push to hub
const showPushPopup = ref<boolean>(false);
</script>
<style scoped></style>

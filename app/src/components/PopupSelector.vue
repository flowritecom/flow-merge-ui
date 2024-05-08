<template>
  <div>
    <button v-if="!model" class="popup-selector-btn w-full" @click="showModal = true">
      <slot name="trigger-button"></slot>
    </button>

    <button v-if="model" class="w-full" @click="showModal = true">
      <slot name="selected-trigger-button"></slot>
    </button>

    <vue-final-modal
        v-model="showModal"
        class="flex justify-center items-center"
        content-transition="popup-fade"
        overlay-transition="popup-fade"
        overlay-style="background-color:#00000019"
        content-class="shadow-popup w-[500px] p-3 bg-white/10 rounded-2xl border border-px border-white/20 backdrop-blur-xl h-[450px]"
        @before-open="$emit('before-open')"
        @closed="$emit('closed')"
    >
      <div class="bg-white p-5 rounded-2xl h-full">
        <Input class="mb-5 -full" :placeholder="searchPlaceholder ?? ''" @input="e => $emit('input', e)" :loading="loading" :error="error"></Input>

        <div v-if="options.length > 0" class="max-h-[80%] overflow-y-auto overflow-x-hidden">
          <slot name="list-option" v-for="option in options" @click="setSelection(option)" :option="option"></slot>
        </div>
        <div v-if="!loading && options.length == 0" class="flex flex-col items-center justify-center h-4/5 gap-2.5">
          <img src="assets/img/not-found.png">
          <span class="text-subtitle text-gray-700">No results found</span>
          <span class="text-small text-gray-500">Try another search term.</span>
        </div>
      </div>
    </vue-final-modal>
  </div>
</template>
<script setup lang="ts">
import 'vue-final-modal/style.css'
import { VueFinalModal } from "vue-final-modal";
import { ref, TransitionProps } from "vue";
import Input from "./Input.vue";

defineEmits<{
  (e: 'input', payload: Event | InputEvent): void
  (e: 'before-open'): void
  (e: 'closed'): void
}>()

const showModal = ref(false)
const model = defineModel()
defineProps<{
  options: Array<any>,
  searchPlaceholder: string,
  loading?: boolean
  error?: string | null
}>()

function setSelection(option: object) {
  model.value = option
  showModal.value = false
}

function searchChanged(e) {
  console.log(e)
}
</script>
<style scoped>

</style>

<template>
  <vue-final-modal
      v-model="showModal"
      :click-to-close="true"
      :lock-scroll="true"
      class="flex justify-center items-center"
      content-transition="popup-fade"
      overlay-transition="popup-fade"
      overlay-style="background-color:#00000019"
      content-class="shadow-popup p-3 bg-white/10 rounded-2xl border border-px border-white/20 backdrop-blur-xl"
      @closed="$emit('closed')"
  >
    <div class="bg-white w-96 p-12 rounded-2xl flex flex-col gap-6 items-center">
      <div>
        <img src="assets/img/qmark.png" height="55" class="disappearing select-none mx-auto" draggable="false">
        <h2 class="text-gray-800">Are you sure?</h2>
      </div>

      <Button class="self-stretch" @click="$emit('confirmed')">Yes, delete this merge</Button>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">

import { VueFinalModal } from "vue-final-modal";
import Input from "./Input.vue";
import Button from "./Button.vue";
import { ref, watch } from "vue";

defineEmits<{
  (e: 'closed'): void
  (e: 'confirmed'): void
}>()

const showModal = ref<boolean>(false)
const props = defineProps<{
  show: boolean
}>();

watch(() => props.show, (newVal: boolean) => {
  showModal.value = newVal
})
</script>

<style scoped>

</style>

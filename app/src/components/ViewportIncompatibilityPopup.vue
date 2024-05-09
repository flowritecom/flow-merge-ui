<template>
  <vue-final-modal
      v-model="show"
      :click-to-close="false"
      :lock-scroll="true"
      :esc-to-close="false"
      class="flex justify-center items-center p-3"
      content-transition="popup-fade"
      overlay-transition="popup-fade"
      overlay-style="background-color:#00000019"
      content-class="shadow-popup p-3 bg-white/10 rounded-2xl border border-px border-white/20 backdrop-blur-xl"
      data-test="viewport-compatibility-popup"
  >
    <div class="bg-white p-6 rounded-2xl flex flex-col gap-3 items-center text-center">
        <h3 class="text-gray-800">Widen your screen</h3>

        <p class="text-small text-gray-500">
          Make your window larger or switch to a larger screen to start merging.
        </p>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";

const show = true;
</script>

<style scoped>

</style>

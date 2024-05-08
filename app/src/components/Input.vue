<template>
  <div class="relative">
    <input
        :type="type"
        class="input w-full"
        :class="{'has-error': error}"
        v-model="model"
        @change="e => $emit('change', e)"
        @input="e => $emit('input', e)"
        :placeholder="placeholder"
        :disabled="disabled"
    >
    <img src="/assets/img/spinner-small.png" class="animate-spin mx-auto absolute right-4 top-6 select-none" draggable="false" v-if="loading">
    <div v-show="error" class="text-red-400 text-small mt-1 ml-0.5">
      {{ error }}
    </div>
  </div>
</template>
<script setup lang="ts">
defineEmits<{
  (e: 'change', payload: Event): void
  (e: 'input', payload: Event | InputEvent): void
}>();

withDefaults(defineProps<{
  placeholder?: string,
  error?: string,
  type?: "text" | "password"
  disabled?: boolean
  loading?: boolean
}>(), {
  type: "text",
  loading: false
})

const model = defineModel<string>()
</script>

<style scoped>

</style>

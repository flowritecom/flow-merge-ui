<template>
  <div class="bg-white p-1.5 text-custom-small shadow-main text-gray-500 rounded-lg-2 border border-gray-200 font-medium flex switch">
    <template v-for="option in options">
      <input type="radio" :name="'switch_' + name" class="appearance-none" :id="option.id" :value="option.value" v-model="model" :disabled="disabled">
      <label class="flex-1 cursor-pointer transition-all duration-150 flex items-center justify-center p-2 rounded-2 gap-2" :for="option.id">
        {{ option.label }}
        <Tag v-for="tag in option.tags" class="bg-gray-100">{{ tag }}</Tag>
      </label>
    </template>
  </div>
</template>
<script setup lang="ts">
import Tag from "./Tag.vue";

defineProps<{
  name: string
  disabled?: boolean
  options: Array<{
    id: string
    label: string
    value: any
    tags?: string[]
  }>
}>()

const model = defineModel()
</script>


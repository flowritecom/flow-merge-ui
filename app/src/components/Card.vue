<template>
  <div class="card" :class="{selected}">
    <span class="font-medium text-body text-gray-700"><slot name="title"></slot></span>
    <div>
      <tag v-for="tag in tags" class="bg-gray-50">{{ tag }}</tag>
    </div>
    <p class="text-gray-500 font-medium text-extra-small">
      <slot name="description"></slot>
    </p>
  </div>
</template>
<script setup lang="ts">
import Tag from "./Tag.vue";

defineProps<{
  tags?: Array<string>
  selected?: boolean
}>();
</script>

<style scoped>

</style>

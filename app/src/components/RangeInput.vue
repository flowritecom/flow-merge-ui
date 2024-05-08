<template>
  <div class="flex items-start gap-2.5">
    <label
      v-if="nullable"
      class="text-extra-small text-gray-600 font-medium cursor-pointer flex flex-col items-center"
    >
      <input type="checkbox" v-model="nulled" class="hidden" />
      <div class="checkbox"></div>
      {{ nullLabel ?? "None" }}
    </label>
    <input
      type="range"
      class="range"
      :min="min"
      :max="max"
      :step="step"
      :style="{ '--value': value * 100 + '%' }"
      v-model.number="value"
      @change="(e) => $emit('change', e)"
      @update="(e: Event) => $emit('update', e)"
      :disabled="nulled || disabled"
      :class="{
        'opacity-50': nulled || disabled,
        'cursor-not-allowed': nulled || disabled,
      }"
    />

    <Tag
      v-if="withTag"
      class="bg-gray-200"
      :class="{
        'opacity-50': nulled || disabled,
        'cursor-not-allowed': nulled || disabled,
      }"
      >{{ value.toFixed(1) }}</Tag
    >
  </div>
</template>
<script setup lang="ts">
import Input from "./Input.vue";
import Tag from "./Tag.vue";
import { ref, watch } from "vue";

const props = defineProps<{
  min: number;
  max: number;
  step: number;
  nullable?: boolean;
  nullLabel?: string;
  withTag?: boolean;
  disabled?: boolean;
}>();

defineEmits<{
  (e: "update", payload: Event): void;
  (e: "change", payload: Event): void;
}>();

const model = defineModel<number | null>();
const value = ref<number>((props.max - props.min) / 2);
const nulled = ref<boolean>(false);

watch(nulled, (newVal: boolean) => {
  model.value = newVal ? null : value.value;
});

watch(value, (newVal: number) => {
  model.value = newVal;
});
</script>
<style scoped></style>

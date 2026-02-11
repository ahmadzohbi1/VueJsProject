<script setup lang="ts">
import type { StatusFilterValue } from '@/types/task'
import { STATUS_FILTER_OPTIONS } from '@/constants/status'

defineProps<{
  modelValue: StatusFilterValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: StatusFilterValue]
}>()

function select(value: StatusFilterValue) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
    <button
      v-for="opt in STATUS_FILTER_OPTIONS"
      :key="opt.value"
      type="button"
      :class="[
        'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
        modelValue === opt.value
          ? 'bg-slate-700 text-white'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
      ]"
      @click="select(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

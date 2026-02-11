<script setup lang="ts">
import type { Task, TaskStatus } from '@/types/task'
import { TASK_STATUS_OPTIONS } from '@/constants/status'
import { useDateFormat } from '@/composables/useDateFormat'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  'update:status': [id: number, status: TaskStatus]
}>()

const { format: formatDate } = useDateFormat()

function onStatusChange(e: Event) {
  const target = e.target as HTMLSelectElement
  const status = target.value as TaskStatus
  emit('update:status', props.task.id, status)
}
</script>

<template>
  <li
    class="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
  >
    <div class="min-w-0 flex-1">
      <p class="font-medium text-slate-900">{{ task.title }}</p>
      <p class="mt-0.5 text-sm text-slate-500">
        {{ task.assignee }} · {{ formatDate(task.createdAt) }}
        <span v-if="task.priority" class="ml-2 text-slate-400">{{ task.priority }}</span>
      </p>
    </div>
    <select
      :value="task.status"
      class="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
      aria-label="Change status"
      @change="onStatusChange"
    >
      <option
        v-for="opt in TASK_STATUS_OPTIONS"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </li>
</template>

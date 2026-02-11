<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { CreateTaskInput, TaskPriority } from '@/types/task'
import { PRIORITY_OPTIONS } from '@/constants/status'
import { validateTaskInput } from '@/utils/validateTask'
import { useTasksStore } from '@/stores/tasks'

const store = useTasksStore()

const title = ref('')
const assignee = ref('')
const priority = ref<'' | TaskPriority>('')
const errors = reactive<{ title?: string; assignee?: string; priority?: string }>({})
const submitting = ref(false)

function clearErrors() {
  errors.title = undefined
  errors.assignee = undefined
  errors.priority = undefined
}

function resetForm() {
  title.value = ''
  assignee.value = ''
  priority.value = ''
  clearErrors()
}

async function onSubmit() {
  clearErrors()
  const payload = {
    title: title.value,
    assignee: assignee.value,
    priority: priority.value || undefined,
  }
  const validation = validateTaskInput(payload)
  if (Object.keys(validation).length > 0) {
    Object.assign(errors, validation)
    return
  }
  submitting.value = true
  await store.addTask(payload as CreateTaskInput)
  submitting.value = false
  if (!store.error) resetForm()
}
</script>

<template>
  <form class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" @submit.prevent="onSubmit">
    <h2 class="mb-3 text-sm font-semibold text-slate-700">Add task</h2>
    <div class="space-y-3">
      <div>
        <label for="add-task-title" class="mb-1 block text-xs text-slate-500">Title</label>
        <input
          id="add-task-title"
          v-model="title"
          type="text"
          class="w-full rounded border px-3 py-2 text-sm"
          :class="errors.title ? 'border-red-500' : 'border-slate-300'"
          placeholder="Task title"
          maxlength="200"
        />
        <p v-if="errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
      </div>
      <div>
        <label for="add-task-assignee" class="mb-1 block text-xs text-slate-500">Assignee</label>
        <input
          id="add-task-assignee"
          v-model="assignee"
          type="text"
          class="w-full rounded border px-3 py-2 text-sm"
          :class="errors.assignee ? 'border-red-500' : 'border-slate-300'"
          placeholder="Assignee name"
          maxlength="100"
        />
        <p v-if="errors.assignee" class="mt-1 text-xs text-red-600">{{ errors.assignee }}</p>
      </div>
      <div>
        <label for="add-task-priority" class="mb-1 block text-xs text-slate-500">Priority</label>
        <select
          id="add-task-priority"
          v-model="priority"
          class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option
            v-for="opt in PRIORITY_OPTIONS"
            :key="opt.value || 'none'"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <p v-if="errors.priority" class="mt-1 text-xs text-red-600">{{ errors.priority }}</p>
      </div>
    </div>
    <button
      type="submit"
      class="mt-3 w-full rounded bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      :disabled="submitting"
    >
      {{ submitting ? 'Adding…' : 'Add task' }}
    </button>
  </form>
</template>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CreateTaskInput, Task, TaskStatus, StatusFilterValue } from '@/types/task'
import * as taskService from '@/services/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statusFilter = ref<StatusFilterValue>('all')

  const filteredTasks = computed(() => {
    if (statusFilter.value === 'all') return tasks.value
    return tasks.value.filter((t) => t.status === statusFilter.value)
  })

  const setStatusFilter = (filter: StatusFilterValue) => {
    statusFilter.value = filter
  }

  async function loadTasks() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await taskService.fetchTasks()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  async function setTaskStatus(id: number, status: TaskStatus) {
    error.value = null
    try {
      const updated = await taskService.updateTaskStatus(id, status)
      const idx = tasks.value.findIndex((t) => t.id === id)
      if (idx !== -1) tasks.value[idx] = updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update task'
    }
  }

  async function addTask(input: CreateTaskInput) {
    error.value = null
    try {
      const task = await taskService.createTask(input)
      tasks.value = [...tasks.value, task]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create task'
    }
  }

  return {
    tasks,
    loading,
    error,
    statusFilter,
    filteredTasks,
    setStatusFilter,
    loadTasks,
    setTaskStatus,
    addTask,
  }
})

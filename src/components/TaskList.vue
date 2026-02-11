<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import type { TaskStatus } from '@/types/task'
import TaskItem from './TaskItem.vue'

const store = useTasksStore()

function updateStatus(id: number, status: TaskStatus) {
  store.setTaskStatus(id, status)
}
</script>

<template>
  <ul class="flex flex-col gap-3" role="list">
    <TaskItem
      v-for="task in store.filteredTasks"
      :key="task.id"
      :task="task"
      @update:status="updateStatus"
    />
  </ul>
</template>

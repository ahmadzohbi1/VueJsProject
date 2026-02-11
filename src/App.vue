<script setup lang="ts">
import { onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import AddTaskForm from '@/components/AddTaskForm.vue'
import StatusFilter from '@/components/StatusFilter.vue'
import TaskList from '@/components/TaskList.vue'

const store = useTasksStore()

onMounted(() => {
  store.loadTasks()
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-8">
    <div class="mx-auto max-w-2xl px-4">
      <header class="mb-6">
        <h1 class="text-2xl font-semibold text-slate-800">Task dashboard</h1>
        <p class="mt-1 text-sm text-slate-500">Filter and update task status</p>
      </header>

      <section class="mb-6">
        <AddTaskForm />
      </section>

      <div class="mb-4">
        <StatusFilter
          :model-value="store.statusFilter"
          @update:model-value="store.setStatusFilter"
        />
      </div>

      <section v-if="store.loading" class="rounded-lg bg-white p-8 text-center text-slate-500">
        Loading…
      </section>

      <section
        v-else-if="store.error"
        class="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700"
      >
        <p>{{ store.error }}</p>
        <button
          type="button"
          class="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
          @click="store.loadTasks()"
        >
          Retry
        </button>
      </section>

      <section v-else-if="store.filteredTasks.length === 0" class="rounded-lg bg-white p-8 text-center text-slate-500">
        No tasks match the current filter.
      </section>

      <section v-else>
        <TaskList />
      </section>
    </div>
  </div>
</template>

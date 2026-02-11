import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from './tasks'
import * as taskService from '@/services/tasks'

vi.mock('@/services/tasks', () => ({
  fetchTasks: vi.fn(),
  updateTaskStatus: vi.fn(),
}))

describe('tasks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(taskService.fetchTasks).mockResolvedValue([
      {
        id: 1,
        title: 'Test task',
        status: 'todo',
        assignee: 'Test User',
        createdAt: '2025-02-01T00:00:00Z',
      },
    ])
  })

  it('filteredTasks returns all tasks when filter is all', async () => {
    const store = useTasksStore()
    await store.loadTasks()
    store.setStatusFilter('all')
    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0]!.title).toBe('Test task')
  })

  it('filteredTasks returns only matching status when filter is set', async () => {
    vi.mocked(taskService.fetchTasks).mockResolvedValue([
      { id: 1, title: 'A', status: 'todo', assignee: 'X', createdAt: '2025-01-01' },
      { id: 2, title: 'B', status: 'done', assignee: 'Y', createdAt: '2025-01-02' },
    ])
    const store = useTasksStore()
    await store.loadTasks()
    store.setStatusFilter('done')
    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0]!.status).toBe('done')
  })
})

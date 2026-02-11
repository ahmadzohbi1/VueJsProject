import type { CreateTaskInput, Task, TaskStatus } from '@/types/task'

const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Implement auth flow', status: 'done', assignee: 'Alex Chen', createdAt: '2025-02-01T09:00:00Z', priority: 'high' },
  { id: 2, title: 'Design dashboard layout', status: 'in_progress', assignee: 'Sam Rivera', createdAt: '2025-02-03T11:30:00Z', priority: 'high' },
  { id: 3, title: 'Fix login redirect bug', status: 'todo', assignee: 'Jordan Lee', createdAt: '2025-02-05T14:00:00Z', priority: 'medium' },
  { id: 4, title: 'Write API integration tests', status: 'todo', assignee: 'Alex Chen', createdAt: '2025-02-06T08:15:00Z', priority: 'medium' },
  { id: 5, title: 'Update dependency versions', status: 'done', assignee: 'Sam Rivera', createdAt: '2025-02-07T10:00:00Z', priority: 'low' },
  { id: 6, title: 'Refactor task service layer', status: 'in_progress', assignee: 'Jordan Lee', createdAt: '2025-02-08T09:45:00Z' },
  { id: 7, title: 'Add error boundary component', status: 'todo', assignee: 'Alex Chen', createdAt: '2025-02-08T16:20:00Z', priority: 'high' },
  { id: 8, title: 'Document deployment process', status: 'done', assignee: 'Sam Rivera', createdAt: '2025-02-09T11:00:00Z', priority: 'low' },
  { id: 9, title: 'Optimize list virtualization', status: 'in_progress', assignee: 'Jordan Lee', createdAt: '2025-02-09T13:30:00Z', priority: 'medium' },
  { id: 10, title: 'Setup CI pipeline', status: 'done', assignee: 'Alex Chen', createdAt: '2025-02-10T08:00:00Z', priority: 'high' },
  { id: 11, title: 'User profile settings page', status: 'todo', assignee: 'Sam Rivera', createdAt: '2025-02-10T10:00:00Z', priority: 'medium' },
  { id: 12, title: 'Email notification preferences', status: 'todo', assignee: 'Jordan Lee', createdAt: '2025-02-10T12:00:00Z', priority: 'low' },
  { id: 13, title: 'Audit accessibility', status: 'in_progress', assignee: 'Alex Chen', createdAt: '2025-02-10T14:00:00Z', priority: 'medium' },
  { id: 14, title: 'Performance baseline metrics', status: 'done', assignee: 'Sam Rivera', createdAt: '2025-02-11T09:00:00Z' },
  { id: 15, title: 'Mobile responsive tweaks', status: 'todo', assignee: 'Jordan Lee', createdAt: '2025-02-11T11:00:00Z', priority: 'high' },
  { id: 16, title: 'Backup strategy review', status: 'done', assignee: 'Alex Chen', createdAt: '2025-02-11T13:00:00Z', priority: 'low' },
  { id: 17, title: 'Rate limiting middleware', status: 'in_progress', assignee: 'Sam Rivera', createdAt: '2025-02-11T15:00:00Z', priority: 'high' },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomLatency(): number {
  return 200 + Math.floor(Math.random() * 301)
}

export async function fetchTasks(): Promise<Task[]> {
  await delay(randomLatency())
  return [...MOCK_TASKS]
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  await delay(randomLatency())
  const task = MOCK_TASKS.find((t) => t.id === id)
  if (!task) throw new Error(`Task ${id} not found`)
  const updated = { ...task, status }
  const idx = MOCK_TASKS.indexOf(task)
  MOCK_TASKS[idx] = updated
  return updated
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  await delay(randomLatency())
  const id = Math.max(0, ...MOCK_TASKS.map((t) => t.id)) + 1
  const task: Task = {
    id,
    title: input.title.trim(),
    assignee: input.assignee.trim(),
    status: 'todo',
    createdAt: new Date().toISOString(),
    ...(input.priority && { priority: input.priority }),
  }
  MOCK_TASKS.push(task)
  return task
}

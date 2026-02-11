export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  status: TaskStatus
  assignee: string
  createdAt: string
  priority?: TaskPriority
}

export type StatusFilterValue = 'all' | TaskStatus

export interface CreateTaskInput {
  title: string
  assignee: string
  priority?: TaskPriority
}

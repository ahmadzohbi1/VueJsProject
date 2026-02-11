import type { TaskPriority } from '@/types/task'

const TITLE_MAX = 200
const ASSIGNEE_MAX = 100
const VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

export interface TaskFormErrors {
  title?: string
  assignee?: string
  priority?: string
}

export function validateTaskInput(input: {
  title: string
  assignee: string
  priority?: string
}): TaskFormErrors {
  const errors: TaskFormErrors = {}
  const title = input.title.trim()
  const assignee = input.assignee.trim()

  if (!title) {
    errors.title = 'Title is required'
  } else if (title.length > TITLE_MAX) {
    errors.title = `Title must be at most ${TITLE_MAX} characters`
  }

  if (!assignee) {
    errors.assignee = 'Assignee is required'
  } else if (assignee.length > ASSIGNEE_MAX) {
    errors.assignee = `Assignee must be at most ${ASSIGNEE_MAX} characters`
  }

  if (
    input.priority !== undefined &&
    input.priority !== '' &&
    !VALID_PRIORITIES.includes(input.priority as TaskPriority)
  ) {
    errors.priority = 'Invalid priority'
  }

  return errors
}

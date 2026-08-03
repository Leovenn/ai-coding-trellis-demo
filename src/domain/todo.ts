export interface TodoItem {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export interface TodoSummary {
  total: number
  completed: number
  remaining: number
}

export const initialTodos: readonly TodoItem[] = [
  {
    id: 'todo-001',
    title: '整理 AI Coding 分享提纲',
    completed: false,
    createdAt: '09:10',
  },
  {
    id: 'todo-002',
    title: '准备 Trellis 演示环境',
    completed: true,
    createdAt: '08:45',
  },
  {
    id: 'todo-003',
    title: '复核现场演示脚本',
    completed: false,
    createdAt: '10:20',
  },
  {
    id: 'todo-004',
    title: '提前十分钟检查投屏与网络',
    completed: false,
    createdAt: '11:00',
  },
]

export function createTodo(
  id: string,
  title: string,
  createdAt: string,
): TodoItem {
  return {
    id,
    title,
    completed: false,
    createdAt,
  }
}

export function setTodoCompleted(
  todos: readonly TodoItem[],
  todoId: string,
  completed: boolean,
): TodoItem[] {
  return todos.map((todo) =>
    todo.id === todoId ? { ...todo, completed } : todo,
  )
}

export function getTodoSummary(todos: readonly TodoItem[]): TodoSummary {
  const completed = todos.filter((todo) => todo.completed).length

  return {
    total: todos.length,
    completed,
    remaining: todos.length - completed,
  }
}

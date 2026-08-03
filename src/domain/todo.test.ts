import { describe, expect, it } from 'vitest'
import {
  createTodo,
  getTodoSummary,
  setTodoCompleted,
  type TodoItem,
} from './todo'

function createTestTodo(id: string, completed = false): TodoItem {
  return {
    id,
    title: `待办 ${id}`,
    completed,
    createdAt: '09:00',
  }
}

describe('待办领域逻辑', () => {
  it('创建的待办默认为未完成', () => {
    expect(createTodo('todo-001', '准备分享', '09:30')).toEqual({
      id: 'todo-001',
      title: '准备分享',
      completed: false,
      createdAt: '09:30',
    })
  })

  it('以不可变方式更新完成状态', () => {
    const source = [createTestTodo('todo-001'), createTestTodo('todo-002')]
    const result = setTodoCompleted(source, 'todo-001', true)

    expect(result[0]?.completed).toBe(true)
    expect(result[1]).toBe(source[1])
    expect(source[0]?.completed).toBe(false)
  })

  it('忽略不存在的待办标识', () => {
    const source = [createTestTodo('todo-001')]

    expect(setTodoCompleted(source, 'todo-999', true)).toEqual(source)
  })

  it('统计总数、已完成和待完成数量', () => {
    const todos = [
      createTestTodo('todo-001', true),
      createTestTodo('todo-002'),
      createTestTodo('todo-003'),
    ]

    expect(getTodoSummary(todos)).toEqual({
      total: 3,
      completed: 1,
      remaining: 2,
    })
  })
})

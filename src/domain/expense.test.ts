import { describe, expect, it } from 'vitest'
import { calculateExpenseTotal, type Expense } from './expense'

function createExpense(amount: number): Expense {
  return {
    id: `expense-${amount}`,
    purpose: '测试报销',
    amount,
    status: 'pending',
    submittedAt: '2026/8/2',
  }
}

describe('calculateExpenseTotal', () => {
  it('没有报销记录时返回 0', () => {
    expect(calculateExpenseTotal([])).toBe(0)
  })

  it('累加全部报销记录的金额', () => {
    const expenses = [createExpense(100), createExpense(200)]

    expect(calculateExpenseTotal(expenses)).toBe(300)
  })
})

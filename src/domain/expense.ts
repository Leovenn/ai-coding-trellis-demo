export type ExpenseStatus = 'pending' | 'approved' | 'rejected'

export interface Expense {
  id: string
  purpose: string
  amount: number
  status: ExpenseStatus
  submittedAt: string
}

export const expenseStatusLabels: Record<ExpenseStatus, string> = {
  pending: '待审批',
  approved: '已通过',
  rejected: '已驳回',
}

export const initialExpenses: readonly Expense[] = [
  {
    id: 'expense-001',
    purpose: '打印材料补差',
    amount: 0.1,
    status: 'pending',
    submittedAt: '2026/8/1',
  },
  {
    id: 'expense-002',
    purpose: '办公用品补差',
    amount: 0.2,
    status: 'approved',
    submittedAt: '2026/7/31',
  },
  {
    id: 'expense-003',
    purpose: '交通费用补差',
    amount: 0.3,
    status: 'rejected',
    submittedAt: '2026/7/30',
  },
]

export function calculateExpenseTotal(expenses: readonly Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

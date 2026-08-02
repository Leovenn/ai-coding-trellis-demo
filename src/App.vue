<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  calculateExpenseTotal,
  expenseStatusLabels,
  initialExpenses,
  type Expense,
} from './domain/expense'

const expenses = ref<Expense[]>(
  initialExpenses.map((expense) => ({ ...expense })),
)

const form = reactive({
  purpose: '',
  amount: null as number | null,
})

let nextExpenseId = initialExpenses.length + 1

const totalAmount = computed(() => calculateExpenseTotal(expenses.value))

function addExpense() {
  const purpose = form.purpose.trim()

  if (
    purpose.length === 0 ||
    form.amount === null ||
    !Number.isFinite(form.amount) ||
    form.amount <= 0
  ) {
    return
  }

  const expense: Expense = {
    id: `expense-${String(nextExpenseId).padStart(3, '0')}`,
    purpose,
    amount: form.amount,
    status: 'pending',
    submittedAt: new Intl.DateTimeFormat('zh-CN').format(new Date()),
  }

  nextExpenseId += 1
  expenses.value = [expense, ...expenses.value]
  form.purpose = ''
  form.amount = null
}
</script>

<template>
  <main class="app-shell">
    <header class="page-header">
      <div>
        <p class="eyebrow">AI CODING × TRELLIS</p>
        <h1>报销记录看板</h1>
        <p class="page-description">
          一个用于演示需求记录、代码实现、质量检查与规范沉淀的纯前端项目。
        </p>
      </div>
      <span class="local-badge">本地数据</span>
    </header>

    <section class="summary-grid" aria-label="报销概览">
      <article class="summary-card summary-card--primary">
        <span>报销总额</span>
        <strong>¥{{ totalAmount }}</strong>
      </article>
      <article class="summary-card">
        <span>记录数量</span>
        <strong>{{ expenses.length }} 条</strong>
      </article>
    </section>

    <section class="content-grid">
      <article class="panel form-panel">
        <div class="panel-heading">
          <p class="section-label">新增记录</p>
          <h2>录入报销信息</h2>
        </div>

        <form class="expense-form" @submit.prevent="addExpense">
          <label>
            <span>报销事由</span>
            <input
              v-model="form.purpose"
              name="purpose"
              type="text"
              maxlength="40"
              placeholder="例如：客户现场交通费"
              required
            />
          </label>

          <label>
            <span>报销金额（元）</span>
            <input
              v-model.number="form.amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required
            />
          </label>

          <button type="submit">添加报销记录</button>
        </form>
      </article>

      <article class="panel list-panel">
        <div class="panel-heading panel-heading--row">
          <div>
            <p class="section-label">全部记录</p>
            <h2>报销明细</h2>
          </div>
          <span class="record-count">共 {{ expenses.length }} 条</span>
        </div>

        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>报销事由</th>
                <th>提交日期</th>
                <th>状态</th>
                <th class="amount-column">金额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expense in expenses" :key="expense.id">
                <td class="purpose-cell">{{ expense.purpose }}</td>
                <td>{{ expense.submittedAt }}</td>
                <td>
                  <span class="status-badge" :class="`status-badge--${expense.status}`">
                    {{ expenseStatusLabels[expense.status] }}
                  </span>
                </td>
                <td class="amount-column">¥{{ expense.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  </main>
</template>

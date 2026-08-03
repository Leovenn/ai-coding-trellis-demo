<script setup lang="ts">
import { CalendarDaysIcon, ListChecksIcon, PlusIcon } from '@lucide/vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Celebration from '@/components/Celebration.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useAnimatedNumber } from '@/composables/useAnimatedNumber'
import { useMotionController } from '@/composables/useMotionController'
import {
  createTodo,
  getTodoSummary,
  initialTodos,
  setTodoCompleted,
  type TodoItem,
} from '@/domain/todo'

const todos = ref<TodoItem[]>(initialTodos.map((todo) => ({ ...todo })))
const newTodoTitle = ref('')
const celebrationTrigger = ref(0)
const hasCelebrated = ref(false)
const progressPulse = ref(false)
const { reduced } = useMotionController()
const [activeList, enableActiveAnimation] = useAutoAnimate<HTMLElement>({
  duration: 260,
  easing: 'ease-out',
})
const [completedList, enableCompletedAnimation] = useAutoAnimate<HTMLElement>({
  duration: 260,
  easing: 'ease-out',
})
const animationControllers = [
  enableActiveAnimation,
  enableCompletedAnimation,
] as const
let pulseTimer: ReturnType<typeof setTimeout> | undefined

// The refs are bound by name in the template; keep an explicit script usage for vue-tsc.
void activeList
void completedList

let nextTodoId = initialTodos.length + 1

const activeTodos = computed(() => todos.value.filter((todo) => !todo.completed))
const completedTodos = computed(() => todos.value.filter((todo) => todo.completed))
const summary = computed(() => getTodoSummary(todos.value))
const animatedCompleted = useAnimatedNumber(
  () => summary.value.completed,
  reduced,
)
const completionPercentage = computed(() =>
  summary.value.total === 0
    ? 0
    : Math.round((summary.value.completed / summary.value.total) * 100),
)

onMounted(() => {
  for (const setAnimationEnabled of animationControllers) {
    setAnimationEnabled(!reduced.value)
  }
})

watch(reduced, (isReduced) => {
  for (const setAnimationEnabled of animationControllers) {
    setAnimationEnabled(!isReduced)
  }
})

watch(completionPercentage, (percentage, previousPercentage) => {
  if (
    hasCelebrated.value ||
    previousPercentage >= 100 ||
    percentage !== 100
  ) {
    return
  }

  hasCelebrated.value = true
  celebrationTrigger.value += 1

  if (reduced.value) {
    return
  }

  progressPulse.value = true
  if (pulseTimer) clearTimeout(pulseTimer)
  pulseTimer = setTimeout(() => {
    progressPulse.value = false
  }, 600)
})

onBeforeUnmount(() => {
  if (pulseTimer) clearTimeout(pulseTimer)
})

const today = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

function addTodo() {
  const title = newTodoTitle.value.trim()

  if (title.length === 0) {
    return
  }

  const todo = createTodo(
    `todo-${String(nextTodoId).padStart(3, '0')}`,
    title,
    new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date()),
  )

  nextTodoId += 1
  todos.value = [todo, ...todos.value]
  newTodoTitle.value = ''
}

function updateTodoCompletion(
  todoId: string,
  checked: boolean | 'indeterminate',
) {
  if (typeof checked !== 'boolean') {
    return
  }

  todos.value = setTodoCompleted(todos.value, todoId, checked)
}
</script>

<template>
  <main class="min-h-screen bg-[#f4f4f1] text-[#20201e]">
    <Celebration :trigger="celebrationTrigger" />
    <div class="mx-auto w-full max-w-[860px] px-4 pb-8 sm:px-7">
      <header
        class="flex h-14 items-center justify-between border-b border-[#20201e]/8"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="grid size-7 place-items-center rounded-lg bg-[#20201e] text-white"
          >
            <ListChecksIcon class="size-3.5" />
          </div>
          <span class="text-[13px] font-semibold tracking-[-0.01em]">日序</span>
        </div>

        <div class="flex items-center gap-2 text-xs text-[#666662]">
          <CalendarDaysIcon class="size-3.5" />
          <span>{{ today }}</span>
        </div>
      </header>

      <section class="pb-6 pt-8 sm:pt-10" aria-labelledby="page-title">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs font-medium text-[#315ee7]">今日计划</p>
            <h1
              id="page-title"
              class="mt-1.5 text-[30px] font-semibold leading-tight tracking-[-0.035em] sm:text-[34px]"
            >
              今日待办
            </h1>
            <p class="mt-2 text-[13px] text-[#666662]">
              清晰记录，逐项完成，把注意力留给重要的事情。
            </p>
          </div>

          <div class="w-full sm:w-48" aria-live="polite">
            <div class="mb-2 flex items-center justify-between text-[11px]">
              <span class="text-[#666662]">完成进度</span>
              <span
                aria-hidden="true"
                class="font-medium tabular-nums text-[#20201e]/65"
              >
                {{ animatedCompleted }} / {{ summary.total }}
              </span>
              <span class="sr-only">
                {{ summary.completed }} / {{ summary.total }}
              </span>
            </div>
            <div class="h-1 overflow-hidden rounded-full bg-[#20201e]/8">
              <div
                class="h-full origin-left rounded-full bg-[#315ee7] transition-[width,transform,filter] duration-300 motion-reduce:transition-none"
                :class="progressPulse ? 'scale-y-[1.8] brightness-110' : ''"
                :style="{ width: `${completionPercentage}%` }"
              />
            </div>
            <p class="mt-2 text-right text-[11px] text-[#666662]">
              还有 {{ summary.remaining }} 项待完成
            </p>
          </div>
        </div>
      </section>

      <section
        class="overflow-hidden rounded-2xl border border-[#20201e]/9 bg-white shadow-[0_1px_2px_rgba(32,32,30,0.03),0_14px_36px_rgba(32,32,30,0.055)]"
        aria-label="待办工作区"
      >
        <form
          class="flex flex-col gap-2 border-b border-[#20201e]/7 bg-[#fbfbfa] p-3 sm:flex-row"
          @submit.prevent="addTodo"
        >
          <Input
            v-model="newTodoTitle"
            name="todo-title"
            type="text"
            maxlength="60"
            autocomplete="off"
            aria-label="待办内容"
            placeholder="添加一件今天要完成的事…"
            class="h-9 flex-1 border-transparent bg-white px-3 text-[13px] shadow-[0_1px_2px_rgba(32,32,30,0.04)] placeholder:text-[#777773] focus-visible:border-[#315ee7]/35 focus-visible:ring-[#315ee7]/10"
          />
          <Button
            type="submit"
            class="h-9 bg-[#20201e] px-4 text-xs text-white shadow-none hover:bg-[#363633]"
          >
            <PlusIcon data-icon="inline-start" />
            新增待办
          </Button>
        </form>

        <section class="px-3 pb-3 pt-5 sm:px-5" aria-labelledby="active-heading">
          <div class="mb-2 flex items-center justify-between px-2">
            <h2
              id="active-heading"
              class="text-[11px] font-medium tracking-[0.08em] text-[#666662]"
            >
              进行中
            </h2>
            <span class="text-[11px] tabular-nums text-[#6f6f6b]">
              {{ activeTodos.length }} 项
            </span>
          </div>

          <ul
            ref="activeList"
            class="space-y-1"
            aria-label="进行中的待办"
          >
            <li
              v-for="todo in activeTodos"
              :key="todo.id"
              class="group flex min-h-12 items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-[#f6f6f3]"
            >
              <Checkbox
                :id="`todo-${todo.id}`"
                :model-value="todo.completed"
                :aria-label="`完成待办：${todo.title}`"
                class="size-[17px] rounded-[5px] border-[#20201e]/18 data-checked:border-[#315ee7] data-checked:bg-[#315ee7]"
                @update:model-value="updateTodoCompletion(todo.id, $event)"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  class="animated-check size-3.5"
                  :class="reduced ? 'motion-reduced' : ''"
                  aria-hidden="true"
                >
                  <path
                    d="M3.25 8.25 6.5 11.25 12.75 4.75"
                    pathLength="1"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Checkbox>
              <label
                :for="`todo-${todo.id}`"
                class="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-4"
              >
                <span class="todo-title truncate text-[13px] font-medium text-[#292927]">
                  {{ todo.title }}
                </span>
                <span class="shrink-0 text-[10px] tabular-nums text-[#6f6f6b]">
                  {{ todo.createdAt }}
                </span>
              </label>
            </li>
          </ul>

          <div
            v-if="activeTodos.length === 0"
            class="flex h-20 items-center justify-center rounded-xl bg-[#f7f7f4] text-xs text-[#666662]"
          >
            今天的事情都完成了。
          </div>
        </section>

        <section
          v-if="completedTodos.length > 0"
          class="border-t border-[#20201e]/7 bg-[#fafaf8] px-3 pb-3 pt-4 sm:px-5"
          aria-labelledby="completed-heading"
        >
          <div class="mb-1.5 flex items-center justify-between px-2">
            <h2
              id="completed-heading"
              class="text-[11px] font-medium tracking-[0.08em] text-[#666662]"
            >
              已完成
            </h2>
            <span class="text-[11px] tabular-nums text-[#6f6f6b]">
              {{ completedTodos.length }} 项
            </span>
          </div>

          <ul
            ref="completedList"
            class="space-y-1"
            aria-label="已完成的待办"
          >
            <li
              v-for="todo in completedTodos"
              :key="todo.id"
              class="flex min-h-11 items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-white"
            >
              <Checkbox
                :id="`todo-${todo.id}`"
                :model-value="todo.completed"
                :aria-label="`重新打开待办：${todo.title}`"
                class="size-[17px] rounded-[5px] border-[#20201e]/12 data-checked:border-[#20201e]/24 data-checked:bg-[#20201e]/24"
                @update:model-value="updateTodoCompletion(todo.id, $event)"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  class="animated-check size-3.5"
                  :class="reduced ? 'motion-reduced' : ''"
                  aria-hidden="true"
                >
                  <path
                    d="M3.25 8.25 6.5 11.25 12.75 4.75"
                    pathLength="1"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Checkbox>
              <label
                :for="`todo-${todo.id}`"
                class="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-4"
              >
                <span class="todo-title truncate text-[13px] text-[#6f6f6b] line-through decoration-[#20201e]/22">
                  {{ todo.title }}
                </span>
                <span class="shrink-0 text-[10px] text-[#6f6f6b]">
                  可重新打开
                </span>
              </label>
            </li>
          </ul>
        </section>
      </section>

      <footer class="flex items-center justify-between px-1 pt-4 text-[10px] text-[#6f6f6b]">
        <span>本地演示数据</span>
        <span>AI Coding × Trellis</span>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.animated-check {
  transform: scale(1);
  animation: check-pop 320ms cubic-bezier(0.2, 0.9, 0.3, 1.25) both;
}

.animated-check path {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: check-draw 280ms ease-out both;
}

.animated-check.motion-reduced,
.animated-check.motion-reduced path {
  animation: none;
}

@keyframes check-draw {
  from {
    stroke-dashoffset: 1;
  }
}

@keyframes check-pop {
  0% {
    transform: scale(0.72);
  }
  65% {
    transform: scale(1.14);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-check,
  .animated-check path {
    animation: none;
  }
}
</style>

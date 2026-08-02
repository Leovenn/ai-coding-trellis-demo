<script setup lang="ts">
import {
  BookOpenIcon,
  GraduationCapIcon,
  PlusIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
} from '@lucide/vue'
import { computed, reactive, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  calculateAverageScore,
  findHighestScore,
  initialScores,
  subjects,
  type StudentScore,
  type Subject,
} from '@/domain/score'

const scores = ref<StudentScore[]>(
  initialScores.map((item) => ({ ...item })),
)

const form = reactive({
  studentName: '',
  subject: '数学' as Subject,
  score: '' as string | number,
})

let nextScoreId = initialScores.length + 1

const averageScore = computed(() => calculateAverageScore(scores.value))
const highestScore = computed(() => findHighestScore(scores.value))

const subjectBadgeClasses: Record<Subject, string> = {
  语文: 'border-rose-200 bg-rose-50 text-rose-700',
  数学: 'border-sky-200 bg-sky-50 text-sky-700',
  英语: 'border-violet-200 bg-violet-50 text-violet-700',
}

function addScore() {
  const studentName = form.studentName.trim()
  const score = Number(form.score)

  if (studentName.length === 0 || form.score === '' || !Number.isFinite(score)) {
    return
  }

  const item: StudentScore = {
    id: `score-${String(nextScoreId).padStart(3, '0')}`,
    studentName,
    subject: form.subject,
    score,
    recordedAt: new Intl.DateTimeFormat('zh-CN').format(new Date()),
  }

  nextScoreId += 1
  scores.value = [item, ...scores.value]
  form.studentName = ''
  form.score = ''
}
</script>

<template>
  <main class="relative min-h-screen overflow-hidden bg-[#f6fbf9] text-slate-800">
    <div
      class="pointer-events-none absolute -top-32 -left-24 size-80 rounded-full bg-emerald-200/35 blur-3xl"
    />
    <div
      class="pointer-events-none absolute top-32 -right-36 size-96 rounded-full bg-sky-200/35 blur-3xl"
    />

    <div class="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div class="max-w-2xl">
          <Badge
            variant="outline"
            class="mb-4 border-emerald-200 bg-white/80 px-3 py-1 text-emerald-700 shadow-sm"
          >
            <SparklesIcon data-icon="inline-start" />
            AI Coding × Trellis
          </Badge>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            青禾成绩册
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            用一个清晰、轻量的成绩看板，演示需求记录、代码实现、质量检查与规范沉淀。
          </p>
        </div>

        <div
          class="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm text-slate-500 shadow-sm backdrop-blur"
        >
          <span class="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.14)]" />
          本地演示数据
        </div>
      </header>

      <section class="mb-5 grid gap-4 sm:grid-cols-3" aria-label="成绩概览">
        <Card class="border-0 bg-white/85 shadow-[0_16px_45px_rgba(45,84,72,0.08)] backdrop-blur">
          <CardContent class="flex items-center justify-between px-5 py-5">
            <div>
              <p class="text-sm text-slate-500">学生人数</p>
              <p class="student-count mt-2 text-3xl font-semibold text-slate-900">
                {{ scores.length }}
                <span class="text-sm font-normal text-slate-400">人</span>
              </p>
            </div>
            <div class="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <UsersIcon class="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card class="border-0 bg-white/85 shadow-[0_16px_45px_rgba(45,84,72,0.08)] backdrop-blur">
          <CardContent class="flex items-center justify-between px-5 py-5">
            <div>
              <p class="text-sm text-slate-500">平均分</p>
              <p class="mt-2 text-3xl font-semibold text-slate-900">
                {{ averageScore.toFixed(1) }}
                <span class="text-sm font-normal text-slate-400">分</span>
              </p>
            </div>
            <div class="grid size-11 place-items-center rounded-2xl bg-sky-50 text-sky-600">
              <BookOpenIcon class="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card class="border-0 bg-white/85 shadow-[0_16px_45px_rgba(45,84,72,0.08)] backdrop-blur">
          <CardContent class="flex items-center justify-between px-5 py-5">
            <div>
              <p class="text-sm text-slate-500">最高分</p>
              <p class="mt-2 text-3xl font-semibold text-slate-900">
                {{ highestScore?.score ?? '—' }}
                <span class="text-sm font-normal text-slate-400">分</span>
              </p>
            </div>
            <div class="grid size-11 place-items-center rounded-2xl bg-amber-50 text-amber-600">
              <TrophyIcon class="size-5" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section class="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card class="border-0 bg-white/90 shadow-[0_18px_55px_rgba(45,84,72,0.09)] backdrop-blur">
          <CardHeader class="px-5 pt-5">
            <div class="mb-2 grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <GraduationCapIcon class="size-5" />
            </div>
            <CardTitle class="text-lg text-slate-900">录入成绩</CardTitle>
            <CardDescription class="leading-6">
              添加一条学生成绩，数据仅保存在当前页面。
            </CardDescription>
          </CardHeader>

          <Separator class="bg-slate-100" />

          <CardContent class="px-5 pb-5">
            <form class="grid gap-5" @submit.prevent="addScore">
              <div class="grid gap-2">
                <Label for="student-name" class="text-slate-600">学生姓名</Label>
                <Input
                  id="student-name"
                  v-model="form.studentName"
                  name="student-name"
                  type="text"
                  maxlength="20"
                  placeholder="例如：江小满"
                  required
                  class="h-10 border-slate-200 bg-white shadow-none focus-visible:border-emerald-400 focus-visible:ring-emerald-100"
                />
              </div>

              <div class="grid gap-2">
                <Label for="subject" class="text-slate-600">考试科目</Label>
                <Select v-model="form.subject">
                  <SelectTrigger
                    id="subject"
                    class="h-10 w-full border-slate-200 bg-white shadow-none focus-visible:border-emerald-400 focus-visible:ring-emerald-100"
                  >
                    <SelectValue placeholder="请选择科目" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="subject in subjects" :key="subject" :value="subject">
                      {{ subject }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="grid gap-2">
                <Label for="score" class="text-slate-600">考试成绩</Label>
                <Input
                  id="score"
                  v-model="form.score"
                  name="score"
                  type="number"
                  step="any"
                  placeholder="请输入分数"
                  required
                  class="h-10 border-slate-200 bg-white shadow-none focus-visible:border-emerald-400 focus-visible:ring-emerald-100"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                class="mt-1 h-10 bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
              >
                <PlusIcon data-icon="inline-start" />
                添加成绩
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card class="border-0 bg-white/90 shadow-[0_18px_55px_rgba(45,84,72,0.09)] backdrop-blur">
          <CardHeader class="flex-row items-start justify-between gap-4 px-5 pt-5">
            <div>
              <CardTitle class="text-lg text-slate-900">成绩记录</CardTitle>
              <CardDescription class="mt-1.5 leading-6">
                当前展示全部学生成绩，共 {{ scores.length }} 条。
              </CardDescription>
            </div>
            <Badge variant="secondary" class="bg-emerald-50 text-emerald-700">
              全部科目
            </Badge>
          </CardHeader>

          <CardContent class="px-0 pb-1">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr class="border-y border-slate-100 bg-slate-50/60 text-xs text-slate-600">
                    <th class="px-5 py-3 font-medium">学生</th>
                    <th class="px-4 py-3 font-medium">科目</th>
                    <th class="px-4 py-3 font-medium">录入日期</th>
                    <th class="px-5 py-3 text-right font-medium">成绩</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in scores"
                    :key="item.id"
                    class="border-b border-slate-100/80 transition-colors last:border-0 hover:bg-emerald-50/35"
                  >
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700"
                        >
                          {{ item.studentName.slice(0, 1) }}
                        </div>
                        <div>
                          <div class="student-name flex items-center gap-1.5 font-medium text-slate-700">
                            {{ item.studentName }}
                            <TrophyIcon
                              v-if="item.id === highestScore?.id"
                              class="size-3.5 text-amber-500"
                              aria-label="当前最高分"
                            />
                          </div>
                          <p class="mt-0.5 text-xs text-slate-500">编号 {{ item.id }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-4">
                      <Badge variant="outline" :class="subjectBadgeClasses[item.subject]">
                        {{ item.subject }}
                      </Badge>
                    </td>
                    <td class="px-4 py-4 text-sm text-slate-500">{{ item.recordedAt }}</td>
                    <td class="px-5 py-4 text-right">
                      <span class="text-lg font-semibold text-slate-800">{{ item.score }}</span>
                      <span class="ml-1 text-xs text-slate-400">/ 100</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  </main>
</template>

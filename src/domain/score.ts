export const subjects = ['语文', '数学', '英语'] as const

export type Subject = (typeof subjects)[number]

export interface StudentScore {
  id: string
  studentName: string
  subject: Subject
  score: number
  recordedAt: string
}

export const initialScores: readonly StudentScore[] = [
  {
    id: 'score-001',
    studentName: '林知夏',
    subject: '语文',
    score: 96,
    recordedAt: '2026/8/1',
  },
  {
    id: 'score-002',
    studentName: '周予安',
    subject: '数学',
    score: 84,
    recordedAt: '2026/8/1',
  },
  {
    id: 'score-003',
    studentName: '苏可',
    subject: '英语',
    score: 72,
    recordedAt: '2026/7/31',
  },
  {
    id: 'score-004',
    studentName: '陈屿',
    subject: '数学',
    score: 58,
    recordedAt: '2026/7/31',
  },
  {
    id: 'score-005',
    studentName: '沈星禾',
    subject: '语文',
    score: 91,
    recordedAt: '2026/7/30',
  },
]

export function calculateAverageScore(scores: readonly StudentScore[]): number {
  if (scores.length === 0) {
    return 0
  }

  const total = scores.reduce((sum, item) => sum + item.score, 0)
  return total / scores.length
}

export function findHighestScore(
  scores: readonly StudentScore[],
): StudentScore | null {
  if (scores.length === 0) {
    return null
  }

  return scores.reduce((highest, item) =>
    item.score > highest.score ? item : highest,
  )
}

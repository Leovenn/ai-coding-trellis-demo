import { describe, expect, it } from 'vitest'
import {
  calculateAverageScore,
  findHighestScore,
  type StudentScore,
} from './score'

function createScore(id: string, score: number): StudentScore {
  return {
    id,
    studentName: `学生${id}`,
    subject: '数学',
    score,
    recordedAt: '2026/8/2',
  }
}

describe('成绩统计', () => {
  it('没有成绩时返回 0 平均分', () => {
    expect(calculateAverageScore([])).toBe(0)
  })

  it('计算全部成绩的平均分', () => {
    const scores = [createScore('1', 80), createScore('2', 90)]

    expect(calculateAverageScore(scores)).toBe(85)
  })

  it('找到最高分记录', () => {
    const highest = findHighestScore([
      createScore('1', 80),
      createScore('2', 96),
      createScore('3', 88),
    ])

    expect(highest?.id).toBe('2')
  })

  it('没有成绩时不存在最高分记录', () => {
    expect(findHighestScore([])).toBeNull()
  })
})

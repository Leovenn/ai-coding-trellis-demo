// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'

describe('App', () => {
  it('展示基础成绩统计', () => {
    const wrapper = mount(App)

    expect(wrapper.get('.student-count').text()).toContain('5')
    expect(wrapper.text()).toContain('80.2')
    expect(wrapper.text()).toContain('96')
  })

  it('提交表单后新增一条成绩记录', async () => {
    const wrapper = mount(App)

    await wrapper.get('input[name="student-name"]').setValue('江小满')
    await wrapper.get('input[name="score"]').setValue('88')
    await wrapper.get('form').trigger('submit')

    const firstRow = wrapper.get('tbody tr')

    expect(wrapper.findAll('tbody tr')).toHaveLength(6)
    expect(firstRow.get('.student-name').text()).toContain('江小满')
    expect(firstRow.text()).toContain('数学')
    expect(firstRow.text()).toContain('88')
    expect(wrapper.get('.student-count').text()).toContain('6')
  })
})

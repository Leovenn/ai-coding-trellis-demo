// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'

describe('App', () => {
  it('展示基础待办和完成概览', () => {
    const wrapper = mount(App)
    const progress = wrapper.get('[aria-live="polite"]')

    expect(wrapper.text()).toContain('今日待办')
    expect(progress.text()).toContain('1 / 4')
    expect(progress.text()).toContain('还有 3 项待完成')
    expect(wrapper.findAll('[data-slot="checkbox"]')).toHaveLength(4)
  })

  it('提交表单后新增一条未完成待办', async () => {
    const wrapper = mount(App)

    await wrapper.get('input[name="todo-title"]').setValue('整理分享材料')
    await wrapper.get('form').trigger('submit')

    const activeTitles = wrapper.findAll(
      'section[aria-labelledby="active-heading"] .todo-title',
    )
    const titleInput = wrapper.get<HTMLInputElement>(
      'input[name="todo-title"]',
    )

    expect(activeTitles).toHaveLength(4)
    expect(activeTitles[0]?.text()).toBe('整理分享材料')
    expect(titleInput.element.value).toBe('')
    expect(wrapper.get('[aria-live="polite"]').text()).toContain('1 / 5')
    expect(wrapper.get('[aria-live="polite"]').text()).toContain(
      '还有 4 项待完成',
    )
  })

  it('勾选待办后同步更新分组和统计', async () => {
    const wrapper = mount(App)
    const firstActiveCheckbox = wrapper.findAll('[data-slot="checkbox"]')[0]

    await firstActiveCheckbox?.trigger('click')

    expect(
      wrapper.findAll('section[aria-labelledby="active-heading"] .todo-title'),
    ).toHaveLength(2)
    expect(
      wrapper.findAll('section[aria-labelledby="completed-heading"] .todo-title'),
    ).toHaveLength(2)
    expect(wrapper.get('[aria-live="polite"]').text()).toContain('2 / 4')
    expect(wrapper.get('[aria-live="polite"]').text()).toContain(
      '还有 2 项待完成',
    )
  })
})

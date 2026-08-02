// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'

describe('App', () => {
  it('提交表单后新增一条待审批报销记录', async () => {
    const wrapper = mount(App)

    await wrapper.get('input[name="purpose"]').setValue('客户现场交通费')
    await wrapper.get('input[name="amount"]').setValue('12.5')
    await wrapper.get('form').trigger('submit')

    const firstRow = wrapper.get('tbody tr')

    expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    expect(firstRow.get('.purpose-cell').text()).toBe('客户现场交通费')
    expect(firstRow.get('.status-badge').text()).toBe('待审批')
    expect(wrapper.get('.record-count').text()).toContain('4')
  })
})

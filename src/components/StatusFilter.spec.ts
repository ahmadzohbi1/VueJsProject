import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusFilter from './StatusFilter.vue'

describe('StatusFilter', () => {
  it('emits update:modelValue when an option is clicked', async () => {
    const wrapper = mount(StatusFilter, {
      props: { modelValue: 'all' },
    })
    const buttons = wrapper.findAll('button')
    const inProgressBtn = buttons.find((b) => b.text() === 'In Progress')
    expect(inProgressBtn).toBeDefined()
    await inProgressBtn!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['in_progress']])
  })

  it('renders all filter options', () => {
    const wrapper = mount(StatusFilter, {
      props: { modelValue: 'all' },
    })
    const labels = wrapper.findAll('button').map((b) => b.text())
    expect(labels).toContain('All')
    expect(labels).toContain('Todo')
    expect(labels).toContain('In Progress')
    expect(labels).toContain('Done')
  })
})

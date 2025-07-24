import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DropdownMenu from '../DropdownMenu.vue'
import Text from '../Text.vue'
import IconArrow from '../icons/IconArrow.vue'

vi.mock('../Text.vue', () => ({
  default: {
    name: 'Text',
    props: ['variant', 'class'],
    template: '<span><slot /></span>'
  }
}))

vi.mock('../icons/IconArrow.vue', () => ({
  default: {
    name: 'IconArrow',
    template: '<svg><path /></svg>'
  }
}))

describe('DropdownMenu Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]

  const defaultProps = {
    options: mockOptions,
    modelValue: 'option1'
  }

  it('renders with required props', () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.findComponent(IconArrow).exists()).toBe(true)
  })

  it('displays selected option label', () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Option 1')
  })

  it('displays fallback text when no option matches modelValue', () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        options: mockOptions,
        modelValue: 'nonexistent'
      }
    })

    expect(wrapper.text()).toContain('Select option')
  })

  it('toggles dropdown visibility when button is clicked', async () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    expect(wrapper.find('.absolute').exists()).toBe(false)
    
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.absolute').exists()).toBe(true)
    
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.absolute').exists()).toBe(false)
  })

  it('renders all options when dropdown is open', async () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')
    
    const options = wrapper.findAll('li')
    expect(options).toHaveLength(3)
    expect(wrapper.text()).toContain('Option 1')
    expect(wrapper.text()).toContain('Option 2')
    expect(wrapper.text()).toContain('Option 3')
  })

  it('emits update:modelValue when option is selected', async () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')
    await wrapper.findAll('li')[1]?.trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['option2'])
  })

  it('closes dropdown after selecting an option', async () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.absolute').exists()).toBe(true)
    
    await wrapper.findAll('li')[1]?.trigger('click')
    expect(wrapper.find('.absolute').exists()).toBe(false)
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    const container = wrapper.find('.relative')
    expect(container.classes()).toContain('inline-block')
    expect(container.classes()).toContain('w-full')
    
    const button = wrapper.find('button')
    expect(button.classes()).toContain('flex')
    expect(button.classes()).toContain('justify-between')
    expect(button.classes()).toContain('items-center')
    expect(button.classes()).toContain('w-full')
  })

  it('applies rotation class to arrow when dropdown is open', async () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    const arrow = wrapper.findComponent(IconArrow)
    expect(arrow.classes()).not.toContain('rotate-180')
    
    await wrapper.find('button').trigger('click')
    expect(arrow.classes()).toContain('rotate-180')
  })

  it('handles numeric values correctly', async () => {
    const numericOptions = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' }
    ]
    
    const wrapper = mount(DropdownMenu, {
      props: {
        options: numericOptions,
        modelValue: 1
      }
    })

    expect(wrapper.text()).toContain('One')
    
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('li')[1]?.trigger('click')
    
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('handles empty options array', () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        options: [],
        modelValue: ''
      }
    })

    expect(wrapper.text()).toContain('Select option')
  })

  it('applies hover styling to options', async () => {
    const wrapper = mount(DropdownMenu, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')
    
    const options = wrapper.findAll('li')
    options.forEach(option => {
      expect(option.classes()).toContain('cursor-pointer')
      expect(option.classes()).toContain('hover:bg-gray-100')
    })
  })
})
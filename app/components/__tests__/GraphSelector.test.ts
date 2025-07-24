import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GraphSelector from '../GraphSelector.vue'
import Text from '../Text.vue'

vi.mock('../Text.vue', () => ({
  default: {
    name: 'Text',
    props: ['variant'],
    template: '<span><slot /></span>'
  }
}))

describe('GraphSelector Component', () => {
  const mockOptions = [
    { value: 'average', label: 'Average Position', color: '#28A6BD' },
    { value: 'top_3', label: 'Top 3%', color: '#97C72F' },
    { value: 'market_share', label: 'Market Share', color: '#1CA2CC' }
  ]

  const defaultProps = {
    options: mockOptions,
    modelValue: 'average'
  }

  it('renders with required props', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3)
    expect(wrapper.findAll('label')).toHaveLength(3)
  })

  it('applies correct variant to Text components', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const textComponents = wrapper.findAllComponents(Text)
    textComponents.forEach(textComponent => {
      expect(textComponent.props('variant')).toBe('bold')
    })
  })

  it('sets correct radio button attributes', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const radioInputs = wrapper.findAll('input[type="radio"]')
    
    expect(radioInputs[0]?.attributes('id')).toBe('average')
    expect(radioInputs[0]?.attributes('value')).toBe('average')
    expect(radioInputs[0]?.element.checked).toBe(true)
    
    expect(radioInputs[1]?.attributes('id')).toBe('top_3')
    expect(radioInputs[1]?.attributes('value')).toBe('top_3')
    expect(radioInputs[1]?.element.checked).toBe(false)
    
    expect(radioInputs[2]?.attributes('id')).toBe('market_share')
    expect(radioInputs[2]?.attributes('value')).toBe('market_share')
    expect(radioInputs[2]?.element.checked).toBe(false)
  })

  it('applies correct label attributes', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const labels = wrapper.findAll('label')
    
    expect(labels[0]?.attributes('for')).toBe('average')
    expect(labels[1]?.attributes('for')).toBe('top_3')
    expect(labels[2]?.attributes('for')).toBe('market_share')
  })

  it('applies selected styling to the active option', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const radioButtons = wrapper.findAll('.w-\\[24px\\]')
    
    expect(radioButtons[0]?.classes()).toContain('bg-gradient-to-br')
    expect(radioButtons[0]?.classes()).toContain('from-[#97C72F]')
    expect(radioButtons[0]?.classes()).toContain('to-[#1CA2CC]')
    expect(radioButtons[0]?.classes()).not.toContain('bg-white')
    
    expect(radioButtons[1]?.classes()).toContain('bg-white')
    expect(radioButtons[1]?.classes()).not.toContain('bg-gradient-to-br')
    
    expect(radioButtons[2]?.classes()).toContain('bg-white')
    expect(radioButtons[2]?.classes()).not.toContain('bg-gradient-to-br')
  })

  it('emits update:modelValue when option is selected', async () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const radioInputs = wrapper.findAll('input[type="radio"]')
    
    await radioInputs[1]?.trigger('change')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['top_3'])
  })

  it('updates selected state when modelValue changes', async () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    await wrapper.setProps({ modelValue: 'market_share' })

    const radioInputs = wrapper.findAll('input[type="radio"]')
    expect(radioInputs[0]?.element.checked).toBe(false)
    expect(radioInputs[1]?.element.checked).toBe(false)
    expect(radioInputs[2]?.element.checked).toBe(true)

    const radioButtons = wrapper.findAll('.w-\\[24px\\]')
    expect(radioButtons[0]?.classes()).toContain('bg-white')
    expect(radioButtons[1]?.classes()).toContain('bg-white')
    expect(radioButtons[2]?.classes()).toContain('bg-gradient-to-br')
  })

  it('renders with correct container layout classes', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('flex-col')
    expect(container.classes()).toContain('gap-4')
    expect(container.classes()).toContain('lg:flex-row')
    expect(container.classes()).toContain('lg:gap-8')
  })

  it('applies correct styling to radio button containers', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const radioButtons = wrapper.findAll('.w-\\[24px\\]')
    
    radioButtons.forEach(button => {
      expect(button.classes()).toContain('w-[24px]')
      expect(button.classes()).toContain('h-[24px]')
      expect(button.classes()).toContain('rounded-full')
      expect(button.classes()).toContain('border-4')
      expect(button.classes()).toContain('border-white')
      expect(button.classes()).toContain('ring-1')
      expect(button.classes()).toContain('ring-gray-2')
      expect(button.classes()).toContain('transition-all')
    })
  })

  it('handles empty options array', () => {
    const wrapper = mount(GraphSelector, {
      props: {
        options: [],
        modelValue: ''
      }
    })

    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0)
    expect(wrapper.findAll('label')).toHaveLength(0)
    expect(wrapper.findAllComponents(Text)).toHaveLength(0)
  })

  it('maintains accessibility with proper label associations', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const radioInputs = wrapper.findAll('input[type="radio"]')
    const labels = wrapper.findAll('label')
    
    radioInputs.forEach((input, index) => {
      const inputId = input.attributes('id')
      const labelFor = labels[index]?.attributes('for')
      expect(inputId).toBe(labelFor)
    })
  })

  it('applies sr-only class to radio inputs for screen readers', () => {
    const wrapper = mount(GraphSelector, {
      props: defaultProps
    })

    const radioInputs = wrapper.findAll('input[type="radio"]')
    radioInputs.forEach(input => {
      expect(input.classes()).toContain('sr-only')
    })
  })
})
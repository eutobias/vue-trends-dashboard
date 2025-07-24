import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LinkWithIcon from '../LinkWithIcon.vue'
import { defineComponent } from 'vue'

const MockIcon = defineComponent({
  name: 'MockIcon',
  template: '<svg><path /></svg>'
})

describe('LinkWithIcon Component', () => {
  const defaultProps = {
    url: 'https://example.com',
    label: 'Example Link',
    icon: MockIcon
  }

  it('renders link with correct attributes', () => {
    const wrapper = mount(LinkWithIcon, {
      props: defaultProps
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('displays correct label text', () => {
    const wrapper = mount(LinkWithIcon, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Example Link')
  })

  it('renders the provided icon component', () => {
    const wrapper = mount(LinkWithIcon, {
      props: defaultProps
    })

    expect(wrapper.findComponent(MockIcon).exists()).toBe(true)
  })

  it('applies correct CSS classes to link', () => {
    const wrapper = mount(LinkWithIcon, {
      props: defaultProps
    })

    const link = wrapper.find('a')
    expect(link.classes()).toContain('inline-flex')
    expect(link.classes()).toContain('items-center')
    expect(link.classes()).toContain('gap-2')
    expect(link.classes()).toContain('text-xs')
    expect(link.classes()).toContain('font-semibold')
    expect(link.classes()).toContain('text-link')
    expect(link.classes()).toContain('underline')
    expect(link.classes()).toContain('hover:no-underline')
    expect(link.classes()).toContain('transition-colors')
  })

  it('shows loading state when loading prop is true', () => {
    const wrapper = mount(LinkWithIcon, {
      props: {
        ...defaultProps,
        loading: true
      }
    })

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    
    const loadingElements = wrapper.findAll('.animate-pulse')
    expect(loadingElements).toHaveLength(2)
    
    expect(loadingElements[0]?.classes()).toContain('w-4')
    expect(loadingElements[0]?.classes()).toContain('h-4')
    expect(loadingElements[0]?.classes()).toContain('rounded')
    expect(loadingElements[0]?.classes()).toContain('bg-gray-200')
    
    expect(loadingElements[1]?.classes()).toContain('h-4')
    expect(loadingElements[1]?.classes()).toContain('w-20')
    expect(loadingElements[1]?.classes()).toContain('rounded')
    expect(loadingElements[1]?.classes()).toContain('bg-gray-200')
  })

  it('applies correct classes to loading container', () => {
    const wrapper = mount(LinkWithIcon, {
      props: {
        ...defaultProps,
        loading: true
      }
    })

    const loadingContainer = wrapper.find('.inline-flex')
    expect(loadingContainer.classes()).toContain('inline-flex')
    expect(loadingContainer.classes()).toContain('items-center')
    expect(loadingContainer.classes()).toContain('gap-2')
    expect(loadingContainer.classes()).toContain('text-link')
  })

  it('defaults loading prop to false', () => {
    const wrapper = mount(LinkWithIcon, {
      props: {
        url: 'https://test.com',
        label: 'Test',
        icon: MockIcon
      }
    })

    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
  })

  it('handles different URLs correctly', () => {
    const wrapper = mount(LinkWithIcon, {
      props: {
        ...defaultProps,
        url: 'https://different-url.com/path?param=value'
      }
    })

    expect(wrapper.find('a').attributes('href')).toBe('https://different-url.com/path?param=value')
  })

  it('handles different labels correctly', () => {
    const wrapper = mount(LinkWithIcon, {
      props: {
        ...defaultProps,
        label: 'Custom Label Text'
      }
    })

    expect(wrapper.text()).toContain('Custom Label Text')
  })

  it('switches between loading and normal state', async () => {
    const wrapper = mount(LinkWithIcon, {
      props: {
        ...defaultProps,
        loading: true
      }
    })

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)

    await wrapper.setProps({ loading: false })
    
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
  })
})
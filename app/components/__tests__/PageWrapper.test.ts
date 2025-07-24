import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageWrapper from '../PageWrapper.vue'

describe('PageWrapper Component', () => {
  it('renders with default classes', () => {
    const wrapper = mount(PageWrapper)

    const div = wrapper.find('div')
    expect(div.exists()).toBe(true)
    expect(div.classes()).toContain('border-5')
    expect(div.classes()).toContain('border-gray-5')
    expect(div.classes()).toContain('w-[100vw]')
    expect(div.classes()).toContain('min-h-[100vh]')
    expect(div.classes()).toContain('p-6')
    expect(div.classes()).toContain('lg:px-[36px]')
    expect(div.classes()).toContain('lg:py-[81px]')
  })

  it('renders slot content', () => {
    const wrapper = mount(PageWrapper, {
      slots: {
        default: '<p>Test content</p>'
      }
    })

    expect(wrapper.html()).toContain('<p>Test content</p>')
    expect(wrapper.text()).toContain('Test content')
  })

  it('merges additional classes from attrs', () => {
    const wrapper = mount(PageWrapper, {
      attrs: {
        class: 'custom-class another-class'
      }
    })

    const div = wrapper.find('div')
    expect(div.classes()).toContain('custom-class')
    expect(div.classes()).toContain('another-class')
    expect(div.classes()).toContain('border-5')
    expect(div.classes()).toContain('border-gray-5')
  })

  it('handles empty slot gracefully', () => {
    const wrapper = mount(PageWrapper)
    
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.text().trim()).toBe('')
  })

  it('renders multiple child elements in slot', () => {
    const wrapper = mount(PageWrapper, {
      slots: {
        default: `
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        `
      }
    })

    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Paragraph')
    expect(wrapper.text()).toContain('Button')
  })

  it('preserves other attributes', () => {
    const wrapper = mount(PageWrapper, {
      attrs: {
        'data-testid': 'page-wrapper',
        id: 'main-wrapper'
      }
    })

    const div = wrapper.find('div')
    expect(div.attributes('data-testid')).toBe('page-wrapper')
    expect(div.attributes('id')).toBe('main-wrapper')
  })
})
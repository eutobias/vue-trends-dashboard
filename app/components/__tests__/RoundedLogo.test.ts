import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RoundedLogo from '../RoundedLogo.vue'

describe('RoundedLogo Component', () => {
  it('renders with required url prop', () => {
    const wrapper = mount(RoundedLogo, {
      props: {
        url: 'https://example.com/logo.png'
      }
    })

    expect(wrapper.exists()).toBe(true)
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/logo.png')
  })

  it('displays image when url is provided', () => {
    const wrapper = mount(RoundedLogo, {
      props: {
        url: 'https://example.com/logo.png',
        alt: 'Company Logo'
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/logo.png')
    expect(img.attributes('alt')).toBe('Company Logo')
    expect(img.classes()).toContain('w-full')
    expect(img.classes()).toContain('h-full')
    expect(img.classes()).toContain('object-cover')

    const fallbackDiv = wrapper.find('.bg-gradient-to-br')
    expect(fallbackDiv.exists()).toBe(false)
  })

  it('displays fallback with first letter when url is null', () => {
    const wrapper = mount(RoundedLogo, {
      props: {
        url: null,
        alt: 'Company Name'
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)

    const fallbackDiv = wrapper.find('.bg-gradient-to-br')
    expect(fallbackDiv.exists()).toBe(true)
    expect(fallbackDiv.classes()).toContain('w-full')
    expect(fallbackDiv.classes()).toContain('h-full')
    expect(fallbackDiv.classes()).toContain('bg-gradient-to-br')
    expect(fallbackDiv.classes()).toContain('from-[#97C72F]')
    expect(fallbackDiv.classes()).toContain('to-[#1CA2CC]')
    expect(fallbackDiv.classes()).toContain('flex')
    expect(fallbackDiv.classes()).toContain('items-center')
    expect(fallbackDiv.classes()).toContain('justify-center')

    const span = fallbackDiv.find('span')
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe('C')
    expect(span.classes()).toContain('text-white')
    expect(span.classes()).toContain('font-semibold')
    expect(span.classes()).toContain('text-4xl')
  })

  it('uses default alt text when not provided', () => {
    const wrapper = mount(RoundedLogo, {
      props: {
        url: 'https://example.com/logo.png'
      }
    })

    const img = wrapper.find('img')
    expect(img.attributes('alt')).toBe('Logo')
  })

  it('displays default fallback letter when alt is default', () => {
    const wrapper = mount(RoundedLogo, {
      props: {
        url: null
      }
    })

    const span = wrapper.find('span')
    expect(span.text()).toBe('L')
  })

  it('renders with correct container classes', () => {
    const wrapper = mount(RoundedLogo, {
      props: {
        url: 'https://example.com/logo.png'
      }
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('w-20')
    expect(container.classes()).toContain('h-20')
    expect(container.classes()).toContain('rounded-full')
    expect(container.classes()).toContain('border-4')
    expect(container.classes()).toContain('border-white')
    expect(container.classes()).toContain('ring-1')
    expect(container.classes()).toContain('ring-gray-5')
    expect(container.classes()).toContain('overflow-hidden')
    expect(container.classes()).toContain('inline-block')
  })

  it('handles empty string url as falsy', () => {
    const wrapper = mount(RoundedLogo, {
      props: {
        url: '',
        alt: 'Test'
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)

    const fallbackDiv = wrapper.find('.bg-gradient-to-br')
    expect(fallbackDiv.exists()).toBe(true)
    
    const span = fallbackDiv.find('span')
    expect(span.text()).toBe('T')
  })

  it('handles different alt text values for fallback letter', () => {
    const testCases = [
      { alt: 'Apple', expected: 'A' },
      { alt: 'microsoft', expected: 'm' },
      { alt: '123 Company', expected: '1' },
      { alt: ' Leading Space', expected: 'L' },
      { alt: '', expected: '' }
    ]

    testCases.forEach(({ alt, expected }) => {
      const wrapper = mount(RoundedLogo, {
        props: {
          url: null,
          alt
        }
      })

      const span = wrapper.find('span')
      expect(span.text()).toBe(expected)
    })
  })

  it('handles various url formats', () => {
    const testCases = [
      'https://example.com/logo.png',
      'http://example.com/logo.jpg',
      '/assets/logo.svg',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    ]

    testCases.forEach(url => {
      const wrapper = mount(RoundedLogo, {
        props: {
          url,
          alt: 'Test Logo'
        }
      })

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(url)
      expect(img.attributes('alt')).toBe('Test Logo')
    })
  })

  it('switches between image and fallback when url prop changes', async () => {
    const wrapper = mount(RoundedLogo, {
      props: {
        url: 'https://example.com/logo.png',
        alt: 'Test'
      }
    })

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('.bg-gradient-to-br').exists()).toBe(false)

    await wrapper.setProps({ url: null })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.bg-gradient-to-br').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('T')

    await wrapper.setProps({ url: 'https://example.com/new-logo.png' })

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('.bg-gradient-to-br').exists()).toBe(false)
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/new-logo.png')
  })
})
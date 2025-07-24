import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Text from '../Text.vue'

describe('Text Component', () => {
  it('renders with default props', () => {
    const wrapper = mount(Text, {
      slots: {
        default: 'Test content'
      }
    })
    
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.text()).toBe('Test content')
    expect(wrapper.classes()).toContain('font-normal')
    expect(wrapper.classes()).toContain('text-main-text-2')
  })

  it('renders with bold variant', () => {
    const wrapper = mount(Text, {
      props: {
        variant: 'bold'
      },
      slots: {
        default: 'Bold text'
      }
    })
    
    expect(wrapper.classes()).toContain('font-semibold')
    expect(wrapper.classes()).not.toContain('font-normal')
  })

  it('renders with normal variant explicitly', () => {
    const wrapper = mount(Text, {
      props: {
        variant: 'normal'
      },
      slots: {
        default: 'Normal text'
      }
    })
    
    expect(wrapper.classes()).toContain('font-normal')
    expect(wrapper.classes()).not.toContain('font-semibold')
  })

  describe('tag prop variations', () => {
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
    
    headingTags.forEach(tag => {
      it(`renders as ${tag.toUpperCase()} tag`, () => {
        const wrapper = mount(Text, {
          props: {
            tag
          },
          slots: {
            default: `${tag} content`
          }
        })
        
        expect(wrapper.element.tagName).toBe(tag.toUpperCase())
        expect(wrapper.classes()).toContain('text-main-text-1')
      })
    })

    it('renders as span tag', () => {
      const wrapper = mount(Text, {
        props: {
          tag: 'span'
        },
        slots: {
          default: 'Span content'
        }
      })
      
      expect(wrapper.element.tagName).toBe('SPAN')
      expect(wrapper.classes()).toContain('text-main-text-2')
    })

    it('renders as p tag (default)', () => {
      const wrapper = mount(Text, {
        slots: {
          default: 'Paragraph content'
        }
      })
      
      expect(wrapper.element.tagName).toBe('P')
      expect(wrapper.classes()).toContain('text-main-text-2')
    })
  })

  describe('text color classes', () => {
    it('applies text-main-text-2 for p and span tags', () => {
      const pWrapper = mount(Text, {
        props: { tag: 'p' },
        slots: { default: 'Paragraph' }
      })
      
      const spanWrapper = mount(Text, {
        props: { tag: 'span' },
        slots: { default: 'Span' }
      })
      
      expect(pWrapper.classes()).toContain('text-main-text-2')
      expect(spanWrapper.classes()).toContain('text-main-text-2')
    })

    it('applies text-main-text-1 for heading tags', () => {
      const h1Wrapper = mount(Text, {
        props: { tag: 'h1' },
        slots: { default: 'Heading 1' }
      })
      
      const h3Wrapper = mount(Text, {
        props: { tag: 'h3' },
        slots: { default: 'Heading 3' }
      })
      
      expect(h1Wrapper.classes()).toContain('text-main-text-1')
      expect(h3Wrapper.classes()).toContain('text-main-text-1')
    })
  })

  it('combines variant and tag props correctly', () => {
    const wrapper = mount(Text, {
      props: {
        variant: 'bold',
        tag: 'h2'
      },
      slots: {
        default: 'Bold heading'
      }
    })
    
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('font-semibold')
    expect(wrapper.classes()).toContain('text-main-text-1')
    expect(wrapper.text()).toBe('Bold heading')
  })

  it('preserves additional classes from attrs', () => {
    const wrapper = mount(Text, {
      attrs: {
        class: 'custom-class another-class'
      },
      slots: {
        default: 'Custom styled text'
      }
    })
    
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.classes()).toContain('another-class')
    expect(wrapper.classes()).toContain('font-normal')
    expect(wrapper.classes()).toContain('text-main-text-2')
  })

  it('renders slot content correctly', () => {
    const wrapper = mount(Text, {
      slots: {
        default: '<strong>HTML content</strong>'
      }
    })
    
    expect(wrapper.html()).toContain('<strong>HTML content</strong>')
  })

  it('handles empty slot content', () => {
    const wrapper = mount(Text)
    
    expect(wrapper.text()).toBe('')
    expect(wrapper.element.tagName).toBe('P')
  })
})
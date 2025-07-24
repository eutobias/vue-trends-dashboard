import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Rating from '../Rating.vue'

// Mock the icon components
vi.mock('../icons/IconStarFilled.vue', () => ({
  default: {
    name: 'IconStarFilled',
    template: '<div class="icon-star-filled" data-testid="star-filled"></div>'
  }
}))

vi.mock('../icons/IconStarEmpty.vue', () => ({
  default: {
    name: 'IconStarEmpty',
    template: '<div class="icon-star-empty" data-testid="star-empty"></div>'
  }
}))

describe('Rating', () => {
  it('renders with default rating of 0', () => {
    const wrapper = mount(Rating)
    const overlay = wrapper.find('[style*="width"]')
    expect(overlay.attributes('style')).toBe('width: 0%;')
  })

  it('computes ratingPercentage correctly', () => {
    const wrapper = mount(Rating, { props: { rating: 2.5 } })
    const vm = wrapper.vm as any
    expect(vm.ratingPercentage).toBe(50)
  })

  it('renders 5 empty stars', () => {
    const wrapper = mount(Rating)
    expect(wrapper.findAll('[data-testid="star-empty"]')).toHaveLength(5)
  })

  it('renders 5 filled stars in overlay', () => {
    const wrapper = mount(Rating)
    expect(wrapper.findAll('[data-testid="star-filled"]')).toHaveLength(5)
  })

  it('sets correct width for rating 4', () => {
    const wrapper = mount(Rating, { props: { rating: 4 } })
    const overlay = wrapper.find('.overflow-x-hidden')
    expect(overlay.attributes('style')).toBe('width: 80%;')
  })

  it('handles maximum rating of 5', () => {
    const wrapper = mount(Rating, { props: { rating: 5 } })
    const overlay = wrapper.find('.overflow-x-hidden')
    expect(overlay.attributes('style')).toBe('width: 100%;')
  })
})
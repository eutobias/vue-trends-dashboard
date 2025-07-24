import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsViewer from '../StatsViewer.vue'
import Text from '../Text.vue'
import IconChartUp from '../icons/IconChartUp.vue'
import IconChartDown from '../icons/IconChartDown.vue'

vi.mock('../Text.vue', () => ({
  default: {
    name: 'Text',
    props: ['class'],
    template: '<span :class="$props.class"><slot /></span>'
  }
}))

vi.mock('../icons/IconChartUp.vue', () => ({
  default: {
    name: 'IconChartUp',
    props: ['class'],
    template: '<div data-testid="icon-chart-up" :class="$props.class">↗</div>'
  }
}))

vi.mock('../icons/IconChartDown.vue', () => ({
  default: {
    name: 'IconChartDown',
    props: ['class'],
    template: '<div data-testid="icon-chart-down" :class="$props.class">↘</div>'
  }
}))

describe('StatsViewer Component', () => {
  const defaultProps = {
    stats: '42',
    label: 'Test Metric',
    direction: 'up' as const,
    iconLabel: '+5'
  }

  it('renders with required props', () => {
    const wrapper = mount(StatsViewer, {
      props: defaultProps
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('Test Metric')
    expect(wrapper.text()).toContain('+5')
  })

  it('displays stats and label when not loading', () => {
    const wrapper = mount(StatsViewer, {
      props: {
        ...defaultProps,
        loading: false
      }
    })

    const textComponents = wrapper.findAllComponents(Text)
    expect(textComponents).toHaveLength(3)
    
    expect(textComponents?.[0]?.text()).toBe('42')
    expect(textComponents?.[0]?.classes()).toContain('text-2xl')
    expect(textComponents?.[0]?.classes()).toContain('font-semibold')
    expect(textComponents?.[0]?.classes()).toContain('text-stats')
    
    expect(textComponents?.[1]?.text()).toBe('Test Metric')
    expect(textComponents?.[1]?.classes()).toContain('text-xs')
    expect(textComponents?.[1]?.classes()).toContain('font-semibold')
    expect(textComponents?.[1]?.classes()).toContain('text-main-text-2')
  })

  it('shows loading skeleton when loading is true', () => {
    const wrapper = mount(StatsViewer, {
      props: {
        ...defaultProps,
        loading: true
      }
    })

    const skeletonElements = wrapper.findAll('.animate-pulse')
    expect(skeletonElements).toHaveLength(2)
    
    const textComponents = wrapper.findAllComponents(Text)
    expect(textComponents).toHaveLength(0)
    
    expect(wrapper.text()).not.toContain('42')
    expect(wrapper.text()).not.toContain('Test Metric')
    expect(wrapper.text()).not.toContain('+5')
  })

  it('renders IconChartUp when direction is up', () => {
    const wrapper = mount(StatsViewer, {
      props: {
        ...defaultProps,
        direction: 'up'
      }
    })

    expect(wrapper.findComponent(IconChartUp).exists()).toBe(true)
    expect(wrapper.findComponent(IconChartDown).exists()).toBe(false)
    expect(wrapper.find('[data-testid="icon-chart-up"]').exists()).toBe(true)
  })

  it('renders IconChartDown when direction is down', () => {
    const wrapper = mount(StatsViewer, {
      props: {
        ...defaultProps,
        direction: 'down'
      }
    })

    expect(wrapper.findComponent(IconChartDown).exists()).toBe(true)
    expect(wrapper.findComponent(IconChartUp).exists()).toBe(false)
    expect(wrapper.find('[data-testid="icon-chart-down"]').exists()).toBe(true)
  })

  it('applies positive text color when direction is up', () => {
    const wrapper = mount(StatsViewer, {
      props: {
        ...defaultProps,
        direction: 'up',
        iconLabel: '+10%'
      }
    })

    const textComponents = wrapper.findAllComponents(Text)
    const iconLabelText = textComponents.find(comp => comp.text() === '+10%')
    expect(iconLabelText?.classes()).toContain('text-positive')
    expect(iconLabelText?.classes()).not.toContain('text-negative')
  })

  it('applies negative text color when direction is down', () => {
    const wrapper = mount(StatsViewer, {
      props: {
        ...defaultProps,
        direction: 'down',
        iconLabel: '-5%'
      }
    })

    const textComponents = wrapper.findAllComponents(Text)
    const iconLabelText = textComponents.find(comp => comp.text() === '-5%')
    expect(iconLabelText?.classes()).toContain('text-negative')
    expect(iconLabelText?.classes()).not.toContain('text-positive')
  })

  it('renders with correct container classes', () => {
    const wrapper = mount(StatsViewer, {
      props: defaultProps
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('items-center')
    expect(container.classes()).toContain('justify-between')
    expect(container.classes()).toContain('p-3')
    expect(container.classes()).toContain('bg-white')
    expect(container.classes()).toContain('rounded')
    expect(container.classes()).toContain('shadow-sm')
    expect(container.classes()).toContain('border')
    expect(container.classes()).toContain('border-gray-2')
    expect(container.classes()).toContain('w-full')
    expect(container.classes()).toContain('lg:w-[300px]')
  })

  it('handles different stats values', () => {
    const testCases = [
      { stats: '0', expected: '0' },
      { stats: '100%', expected: '100%' },
      { stats: '1,234', expected: '1,234' },
      { stats: '∞', expected: '∞' }
    ]

    testCases.forEach(({ stats, expected }) => {
      const wrapper = mount(StatsViewer, {
        props: {
          ...defaultProps,
          stats
        }
      })

      expect(wrapper.text()).toContain(expected)
    })
  })

  it('handles different label values', () => {
    const testCases = [
      'Average Ranking',
      'Top 3%',
      'Market Share%',
      'Very Long Label Name'
    ]

    testCases.forEach(label => {
      const wrapper = mount(StatsViewer, {
        props: {
          ...defaultProps,
          label
        }
      })

      expect(wrapper.text()).toContain(label)
    })
  })

  it('handles different iconLabel values', () => {
    const testCases = [
      '+5',
      '-10%',
      '0',
      '+1,000'
    ]

    testCases.forEach(iconLabel => {
      const wrapper = mount(StatsViewer, {
        props: {
          ...defaultProps,
          iconLabel
        }
      })

      expect(wrapper.text()).toContain(iconLabel)
    })
  })

  it('defaults loading to false when not provided', () => {
    const wrapper = mount(StatsViewer, {
      props: defaultProps
    })

    expect(wrapper.findAll('.animate-pulse')).toHaveLength(0)
    expect(wrapper.findAllComponents(Text)).toHaveLength(3)
  })

  it('icon has correct classes', () => {
    const wrapper = mount(StatsViewer, {
      props: defaultProps
    })

    const icon = wrapper.findComponent(IconChartUp)
    expect(icon.classes()).toContain('w-5')
    expect(icon.classes()).toContain('h-5')
  })

  it('icon label text has correct base classes', () => {
    const wrapper = mount(StatsViewer, {
      props: {
        ...defaultProps,
        loading: false
      }
    })

    const textComponents = wrapper.findAllComponents(Text)
    const iconLabelText = textComponents.find(comp => comp.text() === '+5')
    expect(iconLabelText?.classes()).toContain('text-xs')
    expect(iconLabelText?.classes()).toContain('font-semibold')
  })
})
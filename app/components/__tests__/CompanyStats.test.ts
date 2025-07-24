import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CompanyStats from '../CompanyStats.vue'
import StatsViewer from '../StatsViewer.vue'
import { useTrendsStore } from '~/stores/trends'
import type { TrendsResponse } from '~/types/trends'

vi.mock('../StatsViewer.vue', () => ({
  default: {
    name: 'StatsViewer',
    props: ['loading', 'stats', 'label', 'direction', 'iconLabel'],
    template: '<div data-testid="stats-viewer">{{ label }}: {{ stats }} ({{ direction }}) {{ iconLabel }}</div>'
  }
}))

const mockTrendsData: TrendsResponse = {
  current: {
    average: 15,
    top_3_position: 5,
    top_3_percentage: 75.5,
    market_share_position: 3,
    market_share_percentage: 45.2,
    execution_date: new Date('2024-01-15')
  },
  previous: {
    average: 20,
    top_3_position: 8,
    top_3_percentage: 65.3,
    market_share_position: 5,
    market_share_percentage: 40.1,
    execution_date: new Date('2024-01-01')
  }
}

const mockTrendsDataDecreasing: TrendsResponse = {
  current: {
    average: 25,
    top_3_position: 10,
    top_3_percentage: 55.0,
    market_share_position: 7,
    market_share_percentage: 35.0,
    execution_date: new Date('2024-01-15')
  },
  previous: {
    average: 20,
    top_3_position: 8,
    top_3_percentage: 65.3,
    market_share_position: 5,
    market_share_percentage: 40.1,
    execution_date: new Date('2024-01-01')
  }
}

describe('CompanyStats Component', () => {
  let pinia: any
  let trendsStore: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    trendsStore = useTrendsStore()
  })

  it('renders three StatsViewer components', () => {
    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    const statsViewers = wrapper.findAllComponents(StatsViewer)
    expect(statsViewers).toHaveLength(3)
  })

  it('displays loading state when store is loading', () => {
    trendsStore.loading = true
    trendsStore.trend = null

    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    const statsViewers = wrapper.findAllComponents(StatsViewer)
    statsViewers.forEach(viewer => {
      expect(viewer.props('loading')).toBe(true)
    })
  })

  it('displays default values when trend data is null', () => {
    trendsStore.loading = false
    trendsStore.trend = null

    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    const statsViewers = wrapper.findAllComponents(StatsViewer)
    
    expect(statsViewers?.[0]?.props()).toEqual({
      loading: false,
      stats: '0',
      label: 'Average Ranking',
      direction: 'up',
      iconLabel: '0'
    })

    expect(statsViewers?.[1]?.props()).toEqual({
      loading: false,
      stats: '0',
      label: 'Top 3%',
      direction: 'up',
      iconLabel: '0'
    })

    expect(statsViewers?.[2]?.props()).toEqual({
      loading: false,
      stats: '0',
      label: 'Market Share%',
      direction: 'up',
      iconLabel: '0'
    })
  })

  it('calculates and displays correct stats when trend data improves', () => {
    trendsStore.loading = false
    trendsStore.trend = mockTrendsData

    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    const statsViewers = wrapper.findAllComponents(StatsViewer)
    
    expect(statsViewers?.[0]?.props()).toEqual({
      loading: false,
      stats: '15',
      label: 'Average Ranking',
      direction: 'down',
      iconLabel: '-5'
    })

    expect(statsViewers?.[1]?.props()).toEqual({
      loading: false,
      stats: '76%',
      label: 'Top 3%',
      direction: 'up',
      iconLabel: '10%'
    })

    expect(statsViewers?.[2]?.props()).toEqual({
      loading: false,
      stats: '45%',
      label: 'Market Share%',
      direction: 'up',
      iconLabel: '5%'
    })
  })

  it('calculates and displays correct stats when trend data worsens', () => {
    trendsStore.loading = false
    trendsStore.trend = mockTrendsDataDecreasing

    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    const statsViewers = wrapper.findAllComponents(StatsViewer)
    
    expect(statsViewers?.[0]?.props()).toEqual({
      loading: false,
      stats: '25',
      label: 'Average Ranking',
      direction: 'up',
      iconLabel: '5'
    })

    expect(statsViewers?.[1]?.props()).toEqual({
      loading: false,
      stats: '55%',
      label: 'Top 3%',
      direction: 'down',
      iconLabel: '-10%'
    })

    expect(statsViewers?.[2]?.props()).toEqual({
      loading: false,
      stats: '35%',
      label: 'Market Share%',
      direction: 'down',
      iconLabel: '-5%'
    })
  })

  it('updates when store trend changes', async () => {
    trendsStore.loading = false
    trendsStore.trend = null

    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    let statsViewers = wrapper.findAllComponents(StatsViewer)
    expect(statsViewers?.[0]?.props('stats')).toBe('0')

    trendsStore.trend = mockTrendsData
    await wrapper.vm.$nextTick()

    statsViewers = wrapper.findAllComponents(StatsViewer)
    expect(statsViewers?.[0]?.props('stats')).toBe('15')
  })

  it('updates when store loading changes', async () => {
    trendsStore.loading = false
    trendsStore.trend = mockTrendsData

    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    let statsViewers = wrapper.findAllComponents(StatsViewer)
    expect(statsViewers?.[0]?.props('loading')).toBe(false)

    trendsStore.loading = true
    await wrapper.vm.$nextTick()

    statsViewers = wrapper.findAllComponents(StatsViewer)
    expect(statsViewers?.[0]?.props('loading')).toBe(true)
  })

  it('renders with correct layout classes', () => {
    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('flex-col')
    expect(container.classes()).toContain('gap-4')
    expect(container.classes()).toContain('lg:flex-row')
  })

  it('handles percentage calculations correctly with decimals', () => {
    const preciseData: TrendsResponse = {
      current: {
        average: 12,
        top_3_position: 3,
        top_3_percentage: 67.789,
        market_share_position: 2,
        market_share_percentage: 33.456,
        execution_date: new Date('2024-01-15')
      },
      previous: {
        average: 15,
        top_3_position: 5,
        top_3_percentage: 55.123,
        market_share_position: 4,
        market_share_percentage: 28.789,
        execution_date: new Date('2024-01-01')
      }
    }

    trendsStore.loading = false
    trendsStore.trend = preciseData

    const wrapper = mount(CompanyStats, {
      global: {
        plugins: [pinia]
      }
    })

    const statsViewers = wrapper.findAllComponents(StatsViewer)
    
    expect(statsViewers?.[1]?.props('stats')).toBe('68%')
    expect(statsViewers?.[1]?.props('iconLabel')).toBe('13%')
    
    expect(statsViewers?.[2]?.props('stats')).toBe('33%')
    expect(statsViewers?.[2]?.props('iconLabel')).toBe('5%')
  })
})
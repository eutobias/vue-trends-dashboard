import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Chart from '../Chart.vue'
import GraphSelector from '../GraphSelector.vue'
import { useTrendsHistoryStore } from '~/stores/trendsHistory'
import type { TrendsHistoryResponse } from '~/types/trendsHistory'

// Mock ApexCharts component
vi.mock('vue3-apexcharts', () => ({
  default: {
    name: 'apexchart',
    props: ['width', 'height', 'type', 'options', 'series'],
    template: '<div data-testid="apexchart">Chart</div>'
  }
}))

// Mock GraphSelector
vi.mock('../GraphSelector.vue', () => ({
  default: {
    name: 'GraphSelector',
    props: ['modelValue', 'options'],
    emits: ['update:modelValue'],
    template: '<div data-testid="graph-selector">Graph Selector</div>'
  }
}))

// Mock ClientOnly - Fix: Use correct Nuxt import
vi.mock('#app', () => ({
  ClientOnly: {
    name: 'ClientOnly',
    template: '<div><slot /></div>'
  }
}))

const mockTrendsHistoryData: TrendsHistoryResponse = {
  history: [
    {
      execution_date: new Date('2024-01-01'),
      average: 15.5,
      top_3_position: 5,
      top_3_percentage: 75.2,
      market_share_position: 3,
      market_share_percentage: 45.8,
      keywords: ['keyword1', 'keyword2', 'keyword3']
    },
    {
      execution_date: new Date('2024-01-02'),
      average: 12.3,
      top_3_position: 4,
      top_3_percentage: 78.1,
      market_share_position: 2,
      market_share_percentage: 48.2,
      keywords: ['keyword1', 'keyword2']
    }
  ]
}

describe('Chart Component', () => {
  let pinia: any
  let trendsHistoryStore: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    trendsHistoryStore = useTrendsHistoryStore()
  })

  it('renders with required components', () => {
    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(GraphSelector).exists()).toBe(true)
    expect(wrapper.find('[data-testid="graph-selector"]').exists()).toBe(true)
  })

  it('shows loading spinner when store is loading', () => {
    trendsHistoryStore.loading = true
    trendsHistoryStore.trendHistory = null

    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.find('[data-testid="apexchart"]').exists()).toBe(false)
  })

  it('passes correct props to GraphSelector', () => {
    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    const graphSelector = wrapper.findComponent(GraphSelector)
    expect(graphSelector.props('modelValue')).toBe('average')
    expect(graphSelector.props('options')).toEqual([
      { value: 'average', label: 'Average Position', color: '#28A6BD' },
      { value: 'top_3', label: 'Top 3%', color: '#28A6BD' },
      { value: 'market_share', label: 'Market Share', color: '#28A6BD' }
    ])
  })

  it('generates correct chart data for average series', () => {
    trendsHistoryStore.loading = false
    trendsHistoryStore.trendHistory = mockTrendsHistoryData

    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    const chartData = wrapper.vm.chartData
    
    expect(chartData).toHaveLength(1)
    expect(chartData[0]?.name).toBe('Average Position')
    expect(chartData[0]?.data).toHaveLength(2)
    expect(chartData[0]?.data?.[0]?.y).toBe(15.5)
    expect(chartData[0]?.data?.[1]?.y).toBe(12.3)
  })

  it('generates correct chart data for top_3 series', async () => {
    trendsHistoryStore.loading = false
    trendsHistoryStore.trendHistory = mockTrendsHistoryData

    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    // Fix: Use wrapper.vm to access component data
    wrapper.vm.selectedSeries = 'top_3'
    await wrapper.vm.$nextTick()

    const chartData = wrapper.vm.chartData
    expect(chartData[0]?.name).toBe('Top 3 Position')
    expect(chartData[0]?.data?.[0]?.y).toBe(5)
    expect(chartData[0]?.data?.[1]?.y).toBe(4)
  })

  it('generates correct chart data for market_share series', async () => {
    trendsHistoryStore.loading = false
    trendsHistoryStore.trendHistory = mockTrendsHistoryData

    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    // Fix: Use wrapper.vm to access component data
    wrapper.vm.selectedSeries = 'market_share'
    await wrapper.vm.$nextTick()

    const chartData = wrapper.vm.chartData
    expect(chartData[0]?.name).toBe('Market Share Position')
    expect(chartData[0]?.data?.[0]?.y).toBe(3)
    expect(chartData[0]?.data?.[1]?.y).toBe(2)
  })

  it('returns empty array when no history data', () => {
    trendsHistoryStore.loading = false
    trendsHistoryStore.trendHistory = null

    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.vm.chartData).toEqual([])
  })

  it('returns empty array when history is empty', () => {
    trendsHistoryStore.loading = false
    trendsHistoryStore.trendHistory = { history: [] }

    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.vm.chartData).toEqual([])
  })

  it('includes original data in chart data points', () => {
    trendsHistoryStore.loading = false
    trendsHistoryStore.trendHistory = mockTrendsHistoryData

    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    const chartData = wrapper.vm.chartData
    const firstDataPoint = chartData[0]?.data?.[0]
    
    expect(firstDataPoint?.originalData).toEqual(mockTrendsHistoryData.history[0])
    expect(firstDataPoint?.x).toBe(new Date('2024-01-01').getTime())
  })

  it('configures chart options correctly', () => {
    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    const chartOptions = wrapper.vm.chartOptions
    
    expect(chartOptions.chart.type).toBe('area')
    expect(chartOptions.chart.height).toBe(350)
    expect(chartOptions.chart.fontFamily).toBe('Montserrat')
    expect(chartOptions.xaxis.type).toBe('datetime')
    expect(chartOptions.stroke.colors).toEqual(['#28A6BD'])
    expect(chartOptions.fill.colors).toEqual(['#28A6BD'])
    expect(chartOptions.colors).toEqual(['#28A6BD'])
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('.w-full.bg-white').exists()).toBe(true)
    expect(wrapper.find('.h-\\[350px\\]').exists()).toBe(true)
  })

  it('includes SVG gradient definition', () => {
    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.find('linearGradient#markerGradient').exists()).toBe(true)
  })

  it('handles y-axis formatter correctly', () => {
    const wrapper = mount(Chart, {
      global: {
        plugins: [pinia]
      }
    })

    const chartOptions = wrapper.vm.chartOptions
    const formatter = chartOptions.yaxis.labels.formatter
    
    expect(formatter(15.7)).toBe('16')
    expect(formatter(10.2)).toBe('10')
    expect(formatter(5)).toBe('5')
  })
})
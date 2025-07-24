import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTrendsHistoryStore } from '../trendsHistory'
import type { TrendsHistoryResponse } from '~/types/trendsHistory'

// Mock useLazyFetch
const mockUseLazyFetch = vi.fn()
global.useLazyFetch = mockUseLazyFetch

const mockTrendsHistoryResponse: TrendsHistoryResponse = {
  history: [
    {
      execution_date: new Date('2024-01-01'),
      average: 15.5,
      top_3_position: 5,
      top_3_percentage: 75.2,
      market_share_position: 3,
      market_share_percentage: 45.8,
      keywords: ['keyword1', 'keyword2']
    },
    {
      execution_date: new Date('2024-01-02'),
      average: 12.3,
      top_3_position: 4,
      top_3_percentage: 78.1,
      market_share_position: 2,
      market_share_percentage: 48.2,
      keywords: ['keyword3']
    }
  ]
}

describe('TrendsHistory Store', () => {
  let pinia: any
  let store: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useTrendsHistoryStore()
    mockUseLazyFetch.mockClear()
  })

  it('initializes with correct default state', () => {
    expect(store.trendHistory).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('fetches trends history successfully', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: mockTrendsHistoryResponse }
    })

    await store.fetchTrends(1)

    expect(store.loading).toBe(false)
    expect(store.trendHistory).toEqual(mockTrendsHistoryResponse)
    expect(mockUseLazyFetch).toHaveBeenCalledWith('/api/trends-history/1')
  })

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockUseLazyFetch.mockRejectedValue(new Error('API Error'))

    await store.fetchTrends(1)

    expect(store.loading).toBe(false)
    expect(store.trendHistory).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching trends history:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('handles null data response', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: null }
    })

    await store.fetchTrends(1)

    expect(store.trendHistory).toBeNull()
    expect(store.loading).toBe(false)
  })
})
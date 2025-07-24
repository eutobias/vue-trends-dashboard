import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTrendsStore } from '../trends'
import type { TrendsResponse } from '~/types/trends'

// Mock useLazyFetch
const mockUseLazyFetch = vi.fn()
global.useLazyFetch = mockUseLazyFetch

const mockTrendsResponse: TrendsResponse = {
  current: {
    average: 15.5,
    top_3_position: 5,
    top_3_percentage: 75.2,
    market_share_position: 3,
    market_share_percentage: 45.8,
    execution_date: new Date('2024-01-15')
  },
  previous: {
    average: 18.2,
    top_3_position: 7,
    top_3_percentage: 68.9,
    market_share_position: 4,
    market_share_percentage: 42.1,
    execution_date: new Date('2024-01-01')
  }
}

describe('Trends Store', () => {
  let pinia: any
  let store: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useTrendsStore()
    mockUseLazyFetch.mockClear()
  })

  it('initializes with correct default state', () => {
    expect(store.trend).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('fetches trends successfully', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: mockTrendsResponse }
    })

    await store.fetchTrends(1)

    expect(store.loading).toBe(false)
    expect(store.trend).toEqual(mockTrendsResponse)
    expect(mockUseLazyFetch).toHaveBeenCalledWith('/api/trends/1')
  })

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockUseLazyFetch.mockRejectedValue(new Error('API Error'))

    await store.fetchTrends(1)

    expect(store.loading).toBe(false)
    expect(store.trend).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching trends:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('handles null data response', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: null }
    })

    await store.fetchTrends(1)

    expect(store.trend).toBeNull()
    expect(store.loading).toBe(false)
  })
})
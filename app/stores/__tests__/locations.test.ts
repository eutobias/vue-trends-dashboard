import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLocationsStore } from '../locations'
import type { Location, LocationsResponse } from '~/types/locations'

// Mock useLazyFetch as a global function
const mockUseLazyFetch = vi.fn()
global.useLazyFetch = mockUseLazyFetch

const mockLocations: Location[] = [
  {
    id: 1,
    name: 'Test Location 1',
    location_name: 'Test Location 1',
    image: null,
    location_image: null,
    primary_phone: '555-0001',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    zip_code: '12345',
    country: 'US',
    email: 'test1@example.com',
    description: 'Test description 1',
    media_count: 5,
    is_connected: 1,
    status: 'active',
    location_state: 'active',
    is_gmb_activate: 1,
    primary_category: 'Restaurant',
    website_url: 'https://test1.com',
    place_id: 'place_1',
    location_id: 'loc_1',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    deleted_at: null,
    latitude: 40.7128,
    longitude: -74.0060,
    subscription_id: 1,
    subscription_item_id: 1,
    review_count: 25,
    unreplied_review_count: 2,
    last_review_date: '2024-01-15',
    map_url: 'https://maps.google.com/test1',
    review_link: 'https://reviews.test1.com',
    ave_review_rating: 4.5,
    deleted_from_google: 0,
    lock_changes: 0,
    is_authorized: null,
    location_name_initials: 'TL',
    review_url: 'https://reviews.test1.com',
    completion_percentage: 85
  },
  {
    id: 2,
    name: 'Test Location 2',
    location_name: 'Test Location 2',
    image: null,
    location_image: null,
    primary_phone: '555-0002',
    address: '456 Test Ave',
    city: 'Test City 2',
    state: 'TS',
    zip: '67890',
    zip_code: '67890',
    country: 'US',
    email: 'test2@example.com',
    description: 'Test description 2',
    media_count: 3,
    is_connected: 1,
    status: 'active',
    location_state: 'active',
    is_gmb_activate: 1,
    primary_category: 'Retail',
    website_url: 'https://test2.com',
    place_id: 'place_2',
    location_id: 'loc_2',
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-02'),
    deleted_at: null,
    latitude: 34.0522,
    longitude: -118.2437,
    subscription_id: 2,
    subscription_item_id: 2,
    review_count: 18,
    unreplied_review_count: 1,
    last_review_date: '2024-01-10',
    map_url: 'https://maps.google.com/test2',
    review_link: 'https://reviews.test2.com',
    ave_review_rating: 4.2,
    deleted_from_google: 0,
    lock_changes: 0,
    is_authorized: null,
    location_name_initials: 'TL2',
    review_url: 'https://reviews.test2.com',
    completion_percentage: 92
  }
]

const mockLocationsResponse: LocationsResponse = {
  locations: mockLocations
}

describe('Locations Store', () => {
  let pinia: any
  let store: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useLocationsStore()
    mockUseLazyFetch.mockClear()
  })

  it('initializes with correct default state', () => {
    expect(store.locations).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.selectedLocation).toBeNull()
  })

  it('fetches locations successfully', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: mockLocationsResponse }
    })

    await store.fetchLocations()

    expect(store.loading).toBe(false)
    expect(store.locations).toEqual(mockLocations)
    expect(store.selectedLocation).toEqual(mockLocations[0])
    expect(mockUseLazyFetch).toHaveBeenCalledWith('/api/locations')
  })

  it('handles loading state during fetch', async () => {
    let resolvePromise: any
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    
    mockUseLazyFetch.mockReturnValue(promise)
    
    const fetchPromise = store.fetchLocations()
    expect(store.loading).toBe(true)
    
    resolvePromise({ data: { value: mockLocationsResponse } })
    await fetchPromise
    
    expect(store.loading).toBe(false)
  })

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockUseLazyFetch.mockRejectedValue(new Error('API Error'))

    await store.fetchLocations()

    expect(store.loading).toBe(false)
    expect(store.locations).toEqual([])
    expect(store.selectedLocation).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching locations:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('handles empty locations response', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: { locations: [] } }
    })

    await store.fetchLocations()

    expect(store.locations).toEqual([])
    expect(store.selectedLocation).toBeNull()
  })

  it('handles null data response', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: null }
    })

    await store.fetchLocations()

    expect(store.locations).toEqual([])
    expect(store.selectedLocation).toBeNull()
  })

  it('selects location by id successfully', () => {
    store.locations = mockLocations
    
    store.selectLocation(2)
    
    expect(store.selectedLocation).toEqual(mockLocations[1])
  })

  it('handles selecting non-existent location', () => {
    store.locations = mockLocations
    store.selectedLocation = mockLocations[0]
    
    store.selectLocation(999)
    
    expect(store.selectedLocation).toEqual(mockLocations[0])
  })

  it('handles selecting location when locations array is empty', () => {
    store.locations = []
    
    store.selectLocation(1)
    
    expect(store.selectedLocation).toBeNull()
  })

  it('auto-selects first location after successful fetch', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: mockLocationsResponse }
    })

    await store.fetchLocations()

    expect(store.selectedLocation).toEqual(mockLocations[0])
  })

  it('handles fetch with undefined locations data', async () => {
    mockUseLazyFetch.mockResolvedValue({
      data: { value: { locations: undefined } }
    })

    await store.fetchLocations()

    expect(store.locations).toEqual([])
    expect(store.selectedLocation).toBeNull()
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LocationDetails from '../LocationDetails.vue'
import RoundedLogo from '../RoundedLogo.vue'
import DropdownMenu from '../DropdownMenu.vue'
import LinkWithIcon from '../LinkWithIcon.vue'
import Text from '../Text.vue'
import { useLocationsStore } from '~/stores/locations'
import type { Location } from '~/types/locations'

vi.mock('../RoundedLogo.vue', () => ({
  default: {
    name: 'RoundedLogo',
    props: ['url', 'alt'],
    template: '<div class="rounded-logo">{{ alt }}</div>'
  }
}))

vi.mock('../DropdownMenu.vue', () => ({
  default: {
    name: 'DropdownMenu',
    props: ['modelValue', 'options'],
    emits: ['update:modelValue'],
    template: '<select @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>'
  }
}))

vi.mock('../LinkWithIcon.vue', () => ({
  default: {
    name: 'LinkWithIcon',
    props: ['url', 'label', 'icon'],
    template: '<a :href="url">{{ label }}</a>'
  }
}))

vi.mock('../Text.vue', () => ({
  default: {
    name: 'Text',
    props: ['class'],
    template: '<span><slot /></span>'
  }
}))

vi.mock('../icons/IconGoogleMaps.vue', () => ({
  default: {
    name: 'IconGoogleMaps',
    template: '<svg></svg>'
  }
}))

const mockLocation: Location = {
  id: 1,
  name: 'Test Location',
  location_name: 'Test Location',
  image: null,
  location_image: 'https://example.com/image.jpg',
  primary_phone: '+1234567890',
  address: '123 Test St, Test City, TC 12345',
  city: 'Test City',
  state: 'TC',
  zip: '12345',
  zip_code: '12345',
  country: 'US',
  email: 'test@example.com',
  description: 'Test description',
  media_count: 5,
  is_connected: 1,
  status: 'active',
  location_state: 'active',
  is_gmb_activate: 1,
  primary_category: 'Restaurant',
  website_url: 'https://example.com',
  place_id: 'test_place_id',
  location_id: 'test_location_id',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  latitude: 40.7128,
  longitude: -74.0060,
  subscription_id: 1,
  subscription_item_id: 1,
  review_count: 25,
  unreplied_review_count: 2,
  last_review_date: '2024-01-01',
  map_url: null,
  review_link: null,
  ave_review_rating: 4.5,
  deleted_from_google: 0,
  lock_changes: 0,
  is_authorized: null,
  location_name_initials: 'TL',
  review_url: 'https://example.com/reviews',
  completion_percentage: 85
}

describe('LocationDetails Component', () => {
  let store: ReturnType<typeof useLocationsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLocationsStore()
    store.locations = [mockLocation]
    store.selectedLocation = mockLocation
  })

  it('renders with selected location data', () => {
    const wrapper = mount(LocationDetails)

    expect(wrapper.findComponent(RoundedLogo).exists()).toBe(true)
    expect(wrapper.findComponent(DropdownMenu).exists()).toBe(true)
    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('(25)')
    expect(wrapper.text()).toContain('123 Test St, Test City, TC 12345')
    expect(wrapper.text()).toContain('+1234567890')
  })

  it('passes correct props to RoundedLogo', () => {
    const wrapper = mount(LocationDetails)
    const logo = wrapper.findComponent(RoundedLogo)

    expect(logo.props('url')).toBe('https://example.com/image.jpg')
    expect(logo.props('alt')).toBe('Test Location')
  })

  it('passes correct props to DropdownMenu', () => {
    const wrapper = mount(LocationDetails)
    const dropdown = wrapper.findComponent(DropdownMenu)

    expect(dropdown.props('modelValue')).toBe(1)
    expect(dropdown.props('options')).toEqual([{
      value: 1,
      label: 'Test Location'
    }])
  })

  it('displays review rating and count', () => {
    const wrapper = mount(LocationDetails)

    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('(25)')
  })

  it('displays address and phone', () => {
    const wrapper = mount(LocationDetails)

    expect(wrapper.text()).toContain('123 Test St, Test City, TC 12345')
    expect(wrapper.text()).toContain('+1234567890')
  })

  it('renders website link when website_url exists', () => {
    const wrapper = mount(LocationDetails)
    const links = wrapper.findAllComponents(LinkWithIcon)

    expect(links.length).toBeGreaterThan(0)
    const websiteLink = links.find(link => link.props('label') === 'Website')
    expect(websiteLink?.props('url')).toBe('https://example.com')
  })

  it('renders maps link when address exists', () => {
    const wrapper = mount(LocationDetails)
    const links = wrapper.findAllComponents(LinkWithIcon)

    const mapsLink = links.find(link => link.props('label') === 'View on Maps')
    expect(mapsLink?.props('url')).toContain('https://www.google.com/maps/search/?api=1&query=')
    expect(mapsLink?.props('url')).toContain(encodeURIComponent('123 Test St, Test City, TC 12345'))
  })

  it('does not render website link when website_url is null', () => {
    store.selectedLocation = { ...mockLocation, website_url: null }
    const wrapper = mount(LocationDetails)
    const links = wrapper.findAllComponents(LinkWithIcon)

    const websiteLink = links.find(link => link.props('label') === 'Website')
    expect(websiteLink).toBeUndefined()
  })

  it('does not render maps link when address is null', () => {
    store.selectedLocation = { ...mockLocation, address: null }
    const wrapper = mount(LocationDetails)
    const links = wrapper.findAllComponents(LinkWithIcon)

    const mapsLink = links.find(link => link.props('label') === 'View on Maps')
    expect(mapsLink).toBeUndefined()
  })

  it('handles null selected location gracefully', () => {
    store.selectedLocation = null
    const wrapper = mount(LocationDetails)

    expect(wrapper.findComponent(RoundedLogo).props('url')).toBeNull()
    expect(wrapper.findComponent(RoundedLogo).props('alt')).toBeUndefined()
    expect(wrapper.findAllComponents(LinkWithIcon)).toHaveLength(0)
  })

  it('updates selected location when dropdown changes', async () => {
    const secondLocation = { ...mockLocation, id: 2, name: 'Second Location' }
    store.locations = [mockLocation, secondLocation]
    
    const wrapper = mount(LocationDetails)
    const dropdown = wrapper.findComponent(DropdownMenu)

    await dropdown.vm.$emit('update:modelValue', 2)
    expect(store.selectedLocation?.id).toBe(2)
  })

  it('applies correct container classes', () => {
    const wrapper = mount(LocationDetails)
    const container = wrapper.find('.flex')

    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('items-start')
    expect(container.classes()).toContain('gap-5')
    expect(container.classes()).toContain('w-full')
    expect(container.classes()).toContain('lg:w-auto')
  })
})
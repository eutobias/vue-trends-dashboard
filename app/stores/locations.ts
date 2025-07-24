import { defineStore } from 'pinia'
import type { Location, LocationsResponse } from '~/types/locations'

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [] as Location[],
    loading: false,
    selectedLocation: null as Location | null
  }),
  actions: {
    async fetchLocations() {
      this.loading = true
      try {
        const { data } = await useLazyFetch<LocationsResponse>('/api/locations')
        this.locations = data.value?.locations || [] as Location[]
        if (this.locations.length > 0) {
          this.selectLocation(this.locations[0]?.id || 0)
        }
      } catch(error) {
        console.error('Error fetching locations:', error)
      } 
      finally {
        this.loading = false
      }
    },
    selectLocation(locationId: number) {
      const location = this.locations.find(loc => loc.id === locationId)
      if (location) {
        this.selectedLocation = location
      }
    }
  }
})
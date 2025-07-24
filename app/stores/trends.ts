import { defineStore } from 'pinia'
import type { TrendsResponse } from '~/types/trends'

export const useTrendsStore = defineStore('trends', {
  state: () => ({
    trend: null as TrendsResponse | null,
    loading: false,
  }),

  actions: {
    async fetchTrends(locationId: number) {
      this.loading = true
      try {
        const { data } = await useLazyFetch<TrendsResponse>(`/api/trends/${locationId}`)
        if (data.value) {
          this.trend = data.value
        }
      } catch (error) {
        console.error('Error fetching trends:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
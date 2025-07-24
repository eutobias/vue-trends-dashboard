import { defineStore } from 'pinia'
import type { TrendsHistoryResponse } from '~/types/trendsHistory'

export const useTrendsHistoryStore = defineStore('trendsHistory', {
  state: () => ({
    trendHistory: null as TrendsHistoryResponse | null,
    loading: false,
  }),

  actions: {
    async fetchTrends(locationId: number) {
      this.loading = true
      try {
        const { data } = await useLazyFetch<TrendsHistoryResponse>(`/api/trends-history/${locationId}`) 
        if (data.value) {
          this.trendHistory = data.value
        }
      } catch (error) {
        console.error('Error fetching trends history:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
<script setup lang="ts">
import { useTrendsStore } from '~/stores/trends'
import StatsViewer, { type Direction } from './StatsViewer.vue'
import { computed, watch, ref } from 'vue'
import type { TrendsResponse } from '~/types/trends'

const trendsStore = useTrendsStore()
const trend = ref<TrendsResponse | null>(null)
const loading = ref<boolean>(false)

const averageRanking = computed<{ stats: string, direction: Direction, iconLabel: string }>(() => {
  if (trend.value === null) return { stats: "0", direction: "up", iconLabel: "0" }

  return {
    stats: String(trend.value.current?.average),
    direction: trend.value.previous?.average <= trend.value.current?.average ? 'up' : 'down' as Direction,
    iconLabel: `${(trend.value?.current?.average - trend.value?.previous?.average)}`
  }
})

const top3 = computed<{ stats: string, direction: Direction, iconLabel: string }>(() => {
  if (trend.value === null) return { stats: "0", direction: "up", iconLabel: "0" }

  return {
    stats: `${trend.value.current?.top_3_percentage.toFixed(0)}%`,
    direction:  trend.value.previous?.top_3_percentage <= trend.value.current?.top_3_percentage ? 'up' : 'down' as Direction,
    iconLabel: `${(trend.value?.current?.top_3_percentage - trend.value?.previous?.top_3_percentage).toFixed(0)}%`
  }
})

const marketShare = computed<{ stats: string, direction: Direction, iconLabel: string }>(() => {
  if (trend.value === null) return { stats: "0", direction: "up", iconLabel: "0" }

  return {
    stats: `${trend.value.current?.market_share_percentage.toFixed(0)}%`,
    direction: trend.value.previous?.market_share_percentage <= trend.value.current?.market_share_percentage ? 'up' : 'down' as Direction,
    iconLabel: `${(trend.value?.current?.market_share_percentage - trend.value?.previous?.market_share_percentage).toFixed(0)}%`
  }
})

watch(() => trendsStore.trend,
  (newTrend) => {
    trend.value = newTrend
  },
  { immediate: true }
)

watch(() => trendsStore.loading,
  (newLoading) => {
    loading.value = newLoading
  },
  { immediate: true }
)

</script>

<template>
  <div class="flex flex-col gap-4 lg:flex-row">
    <StatsViewer :loading="loading" :stats="averageRanking.stats" label="Average Ranking"
      :direction="averageRanking.direction" :icon-label="averageRanking.iconLabel" />
    <StatsViewer :loading="loading" :stats="top3.stats" label="Top 3%"
      :direction="top3.direction" :icon-label="top3.iconLabel" />
    <StatsViewer :loading="loading" :stats="marketShare.stats" label="Market Share%"
      :direction="marketShare.direction" :icon-label="marketShare.iconLabel" />
  </div>
</template>
<script setup lang="ts">
import Text from './Text.vue'

export type Direction = 'up' | 'down'

interface StatsViewerProps {
  stats: string
  label: string
  direction: Direction
  iconLabel: string
  loading?: boolean
}

defineProps<StatsViewerProps>()

import IconChartUp from './icons/IconChartUp.vue'
import IconChartDown from './icons/IconChartDown.vue'
</script>

<template>
  <div
    class="flex items-center justify-between p-3 bg-white rounded shadow-sm border border-gray-2
    transition-shadow hover:bg-stats-bg-hover hover:shadow-[0_7px_15px_rgba(0,0,0,0.1)] w-full lg:w-[300px]"
  >
    <div class="flex flex-col">
      <div v-if="loading" class="animate-pulse">
        <div class="h-7 w-20 bg-gray-200 rounded"></div>
        <div class="h-4 w-16 bg-gray-200 rounded mt-1"></div>
      </div>
      <template v-else>
        <Text class="text-2xl font-semibold text-stats">{{ stats }}</Text>
        <Text class="text-xs font-semibold text-main-text-2">{{ label }}</Text>
      </template>
    </div>
    <div class="flex flex-col items-center gap-2 text-gray-400">
      <div v-if="loading" class="animate-pulse">
        <div class="h-5 w-5 bg-gray-200 rounded"></div>
        <div class="h-4 w-10 bg-gray-200 rounded mt-2"></div>
      </div>
      <template v-else>
        <component :is="direction === 'up' ? IconChartUp : IconChartDown" class="w-5 h-5" />
        <Text
          :class="['text-xs font-semibold', direction === 'up' ? 'text-positive' : 'text-negative']"
          >{{ iconLabel }}</Text
        >
      </template>
    </div>
  </div>
</template>

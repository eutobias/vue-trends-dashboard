<script setup lang="ts">
import Text from './Text.vue'

type Direction = 'up' | 'down'

interface StatsViewerProps {
  stats: string
  label: string
  direction: Direction
  iconLabel: string
}

defineProps<StatsViewerProps>()

import IconChartUp from './icons/IconChartUp.vue'
import IconChartDown from './icons/IconChartDown.vue'
</script>

<template>
  <div
    class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-2 max-w-[300px] transition-shadow hover:bg-stats-bg-hover hover:shadow-[0_7px_15px_rgba(0,0,0,0.1)]"
  >
    <div class="flex flex-col">
      <Text class="text-2xl font-semibold text-stats">{{ stats }}</Text>
      <Text class="text-xs font-semibold text-main-text-2">{{ label }}</Text>
    </div>
    <div class="flex flex-col items-center gap-2 text-gray-400">
      <component :is="direction === 'up' ? IconChartUp : IconChartDown" class="w-5 h-5" />
      <Text
        :class="['text-xs font-semibold', direction === 'up' ? 'text-positive' : 'text-negative']"
        >{{ iconLabel }}</Text
      >
    </div>
  </div>
</template>

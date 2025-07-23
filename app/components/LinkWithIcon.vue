<script setup lang="ts">
import { type Component } from 'vue'

interface LinkWithIconProps {
  url: string
  label: string
  icon: Component
  loading?: boolean
}

const props = withDefaults(defineProps<LinkWithIconProps>(), {
  loading: false
})
</script>

<template>
  <template v-if="loading">
    <div class="inline-flex items-center gap-2 text-link">
      <div class="w-4 h-4 rounded bg-gray-200 animate-pulse" />
      <div class="h-4 w-20 rounded bg-gray-200 animate-pulse" />
    </div>
  </template>
  <a
    v-else
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 text-xs font-semibold text-link underline hover:no-underline transition-colors"
  >
    <component :is="icon" />
    <span>{{ label }}</span>
  </a>
</template>

<script setup lang="ts">
import IconStarFilled from './icons/IconStarFilled.vue'
import IconStarEmpty from './icons/IconStarEmpty.vue'
import { computed } from 'vue'

interface Props {
  rating: number
}

const props = withDefaults(defineProps<Props>(), {
  rating: 0
})

const ratingPercentage = computed(() => (props.rating / 5) * 100)
</script>

<template>
  <div class="flex relative">
    <div class="flex gap-0">
      <template v-for="star in 5" :key="star">
        <IconStarEmpty class="w-3 h-3" />
      </template>
    </div>
    <div 
      class="flex gap-0 overflow-x-hidden absolute top-0 left-0" 
      :style="{ width: `${ratingPercentage}%` }"
    >
      <template v-for="star in 5" :key="star">
        <IconStarFilled class="shrink-0 w-3 h-3" />
      </template>
    </div>
  </div>
</template>

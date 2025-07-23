<script setup lang="ts">
interface RoundedLogoProps {
  url: string
  alt?: string
}

withDefaults(defineProps<RoundedLogoProps>(), {
  alt: 'Logo',
})
</script>

<template>
  <div
    class="w-20 h-20 rounded-full border-4 border-white ring-1 ring-gray-5 overflow-hidden inline-block"
  >
    <img :src="url" :alt="alt" class="w-full h-full object-cover" />
  </div>
</template>

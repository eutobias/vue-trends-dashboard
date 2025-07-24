<script setup lang="ts">
interface RoundedLogoProps {
  url: string | null
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
    <img v-if="url" :src="url" :alt="alt" class="w-full h-full object-cover" />
    <div v-else class="w-full h-full bg-gradient-to-br from-[#97C72F] to-[#1CA2CC] flex items-center justify-center">
      <span class="text-white font-semibold text-4xl">{{ (alt || '').trim().slice(0, 1) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoundedLogo from './RoundedLogo.vue'
import DropdownMenu from './DropdownMenu.vue'
import LinkWithIcon from './LinkWithIcon.vue'
import Text from './Text.vue'
import IconGoogleMaps from './icons/IconGoogleMaps.vue'

interface LocationDetailsProps {
  name: string
  address: string
  phone: string
  rating: number
  totalReviews: number
  websiteUrl: string
  logoUrl: string
}

defineProps<LocationDetailsProps>()
</script>

<template>
  <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-2">
    <div class="flex items-start gap-6">
      <RoundedLogo :url="logoUrl" :alt="name" />
      
      <div class="flex-1 space-y-2">
        <div class="flex items-start justify-between">
          <div>
            <Text as="h2" class="text-xl font-semibold text-main-text mb-1">{{ name }}</Text>
            <div class="flex items-center gap-1">
              <Text class="text-main-text-2">{{ rating }}</Text>
              <Text class="text-main-text-2">({{ totalReviews }})</Text>
            </div>
          </div>
          <DropdownMenu />
        </div>

        <div class="space-y-1">
          <Text class="text-main-text-2">{{ address }}</Text>
          <Text class="text-main-text-2">{{ phone }}</Text>
        </div>

        <div class="flex items-center gap-4">
          <LinkWithIcon
            :url="websiteUrl"
            label="Website"
            :icon="IconGoogleMaps"
          />
          <LinkWithIcon
            :url="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`"
            label="View on Maps"
            :icon="IconGoogleMaps"
          />
        </div>
      </div>
    </div>
  </div>
</template>
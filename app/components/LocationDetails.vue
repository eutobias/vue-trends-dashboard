<script setup lang="ts">
import RoundedLogo from './RoundedLogo.vue'
import DropdownMenu from './DropdownMenu.vue'
import LinkWithIcon from './LinkWithIcon.vue'
import Text from './Text.vue'
import IconGoogleMaps from './icons/IconGoogleMaps.vue'
import { useLocationsStore } from '~/stores/locations'
import { computed } from 'vue'

const store = useLocationsStore()

const selectedLocationId = computed({
  get: () => store.selectedLocation?.id ?? '',
  set: (id: number) => store.selectLocation(id)
})

const locationOptions = computed(() => 
  store.locations.map(location => ({
    value: location.id,
    label: location.name
  }))
)
</script>

<template>
  <div class="flex items-start gap-5 w-full lg:w-auto">
    <RoundedLogo
      :url="store.selectedLocation?.location_image ?? null"
      :alt="store.selectedLocation?.name" 
    />

    <div class="flex-1">
      <DropdownMenu 
        v-model="selectedLocationId"
        :options="locationOptions"
      />
      
      <IconStarFilled />
<IconStarEmpty />

      <div class="flex items-center gap-1">
        <Text class="text-main-text-2 text-xs">{{ store.selectedLocation?.ave_review_rating || "---" }}</Text>
        <Rating v-if="store.selectedLocation?.ave_review_rating" :rating="store.selectedLocation?.ave_review_rating" />
        <Text class="text-main-text-2 text-xs">({{ store.selectedLocation?.review_count || "---" }})</Text>
      </div>

      <Text class="text-main-text-1 text-xs">{{ store.selectedLocation?.address || "---" }}</Text>
      <Text class="text-main-text-1 text-xs">{{ store.selectedLocation?.primary_phone || "---" }}</Text>

      <div class="flex items-center gap-4 mt-1">
        <LinkWithIcon 
          v-if="store.selectedLocation?.website_url" 
          :url="store.selectedLocation.website_url" 
          label="Website"
          :icon="IconGoogleMaps" 
        />
        <LinkWithIcon 
          v-if="store.selectedLocation?.address"
          :url="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.selectedLocation.address)}`"
          label="View on Maps" 
          :icon="IconGoogleMaps" 
        />
      </div>
    </div>
  </div>
</template>
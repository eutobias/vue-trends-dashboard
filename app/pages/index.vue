<script setup lang="ts">
import LocationDetails from '../components/LocationDetails.vue'
import { useLocationsStore } from '~/stores/locations'
import { useTrendsStore } from '~/stores/trends'
import { computed, watch } from 'vue'

const store = useLocationsStore()
await store.fetchLocations()

const trendsStore = useTrendsStore()
const trendsHistoryStore = useTrendsHistoryStore()

const selectedLocationId = computed(() => store.selectedLocation?.id)

watch(selectedLocationId, async (newId) => {
  if (newId) {
    trendsStore.fetchTrends(newId)
    trendsHistoryStore.fetchTrends(newId)
  }
}, { immediate: true })

</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-4 lg:flex-row lg:justify-between mb-6">
      <LocationDetails />
      <CompanyStats />
    </div>
    <div class="flex flex-col gap-4 w-full border border-gray-4">
      <!-- 
        again i made choice to round the padding, in layout are top: 21, bottom: 15 
        another change was the border bellow Ranking Position who looks broke, i've made it goes till the end of the container
        and yes i made the graph flow till the end of the container, it's a simple change if we need to rollback to limited size
        but for me the limited size, looks broke.
       -->
      <div class="flex gap-3 items-center border-b border-gray-4 p-3 py-4 lg:pt-5 lg:pb-4 lg:px-8">
        <IconsIconRanking />
        <Text variant="bold" class="text-[22px] leading-[22px]">
          Ranking Position
        </Text>
      </div>
      <!-- same decision here -->
      <div class="p-3 lg:px-8 lg:py-10">
        <Chart />
      </div>
    </div>
  </div>
</template>
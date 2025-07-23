<script setup lang="ts">
import IconGlobe from '../components/icons/IconGlobe.vue'
import LocationDetails from '../components/LocationDetails.vue'

import { ref } from 'vue'

const isLoading = ref(true)

const { data, status, error, refresh, clear, pending } = await useFetch('/api/locations')

</script>

<template>
  <div class="p-4 space-y-4">
    
  </div>
</template>
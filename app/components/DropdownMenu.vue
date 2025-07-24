<script setup lang="ts">
import { ref } from 'vue'
import Text from './Text.vue'
import IconArrow from '~/components/icons/IconArrow.vue'

interface Option {
  value: string | number
  label: string
}

defineProps<{
  options: Option[]
  modelValue: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const isOpen = ref(false)

function selectOption(option: Option) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}
</script>

<template>
  <div class="relative inline-block w-full">
    <button
      type="button"
      class="flex justify-between items-center w-full"
      @click="isOpen = !isOpen"
    >
      <Text variant="bold" class="text-start mr-4">
        {{ options.find(opt => opt.value === modelValue)?.label || 'Select option' }}
      </Text>
      <IconArrow :class="{ 'rotate-180': isOpen }"/>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-1 bg-white border border-gray-2 rounded-lg shadow-lg"
    >
      <ul class="py-1">
        <li
          v-for="option in options"
          :key="option.value"
          class="px-3 py-2 cursor-pointer hover:bg-gray-100"
          @click="selectOption(option)"
        >
          <Text>{{ option.label }}</Text>
        </li>
      </ul>
    </div>
  </div>
</template>

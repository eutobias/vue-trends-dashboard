<script setup lang="ts">
interface SeriesOption {
  value: string
  label: string
  color: string
}

interface Props {
  options: SeriesOption[]
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center space-x-8">
      <div 
        v-for="option in options" 
        :key="option.value"
        class="flex items-center"
      >
        <div class="relative">
          <input
            :id="option.value"
            :value="option.value"
            :checked="modelValue === option.value"
            type="radio"
            class="sr-only"
            @change="$emit('update:modelValue', option.value)"
          />
          <label
            :for="option.value"
            class="flex items-center cursor-pointer group"
          >
            <div class="relative">
              <div 
                class="w-3 h-3 rounded-full border transition-all duration-200 ease-in-out"
                :class="{
                  'border-gray-300': modelValue !== option.value,
                  'border-2': modelValue === option.value
                }"
                :style="{
                  backgroundColor: modelValue === option.value ? option.color : 'transparent',
                  borderColor: modelValue === option.value ? option.color : '#D1D5DB',
                  borderWidth: modelValue === option.value ? '2px' : '1px'
                }"
              >
                <div 
                  v-if="modelValue === option.value"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <div class="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <span 
              class="ml-3 text-sm transition-colors duration-200"
              :class="{
                'text-gray-900 font-medium': modelValue === option.value,
                'text-gray-600': modelValue !== option.value
              }"
            >
              {{ option.label }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
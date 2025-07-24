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
  <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
    <div v-for="option in options" :key="option.value" class="flex items-center">
      <div class="relative">
        <input :id="option.value" :value="option.value" :checked="modelValue === option.value" type="radio"
          class="sr-only" @change="$emit('update:modelValue', option.value)" />
        <label :for="option.value" class="flex items-center cursor-pointer group gap-3">
          <div class="w-[24px] h-[24px] rounded-full border-4 border-white ring-1 ring-gray-2 transition-all" :class="{
            'bg-white': modelValue !== option.value,
            'bg-gradient-to-br from-[#97C72F] to-[#1CA2CC]': modelValue === option.value
          }">
          </div>
          <Text variant="bold" class="text-sm">
            {{ option.label }}
          </Text>
        </label>
      </div>
    </div>
  </div>
</template>
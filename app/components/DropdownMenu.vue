<script setup lang="ts">
import { computed, ref } from 'vue'
import Text from './Text.vue'

interface Option {
  value: string
  label: string
}

interface DropdownProps {
  options: Option[]
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<DropdownProps>(), {
  placeholder: 'Select an option',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue),
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// Close dropdown when clicking outside
const dropdownRef = ref<HTMLElement | null>(null)

const onClickOutside = (ref: Ref<HTMLElement | null>, callback: () => void) => {
  const onClick = (e: MouseEvent) => {
    if (ref.value && !ref.value.contains(e.target as Node)) {
      callback()
    }
  }
  document.addEventListener('click', onClick)
  return () => {
    document.removeEventListener('click', onClick)
  }
}

const closeDropdown = onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block w-full">
    <button
      type="button"
      class="flex items-center justify-between w-full px-3 py-2 text-sm bg-white transition-colors hover:border-gray-3 focus:outline-none focus:border-gray-3"
      @click="toggleDropdown"
    >
      <Text variant="bold" class="text-main-text-1">
        {{ selectedOption?.label || placeholder }}
      </Text>
      <svg
        class="w-4 h-4 ml-2 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-2 rounded-lg shadow-lg"
    >
      <ul class="py-1">
        <li
          v-for="option in options"
          :key="option.value"
          class="px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-stats-bg-hover"
          @click="selectOption(option)"
        >
          <Text class="text-main-text-1">{{ option.label }}</Text>
        </li>
      </ul>
    </div>
  </div>
</template>

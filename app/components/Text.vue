<script setup lang="ts">
defineOptions({
  name: 'BaseText',
})
import { computed, defineProps, withDefaults } from 'vue'

type TextVariant = 'normal' | 'bold'
type TextTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

interface TextProps {
  variant?: TextVariant
  tag?: TextTag
}

const props = withDefaults(defineProps<TextProps>(), {
  variant: 'normal',
  tag: 'p',
})

const fontWeightClass = computed(() => {
  return props.variant === 'bold' ? 'font-semibold' : 'font-normal'
})

const textColorClass = computed(() => {
  return ['p', 'span'].includes(props.tag) ? 'text-main-text-2' : 'text-main-text-1'
})
</script>

<template>
  <component :is="tag" :class="[fontWeightClass, textColorClass, $attrs.class]">
    <slot />
  </component>
</template>

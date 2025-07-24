<template>
  <!-- This padding differ from layout, in layout is was left: 37, top: 81, right: 35, i assume 37 and 35 was a design error, so i add 36px and 81px -->
  <div :class="['border-5 border-gray-5 w-[100vw] min-h-[100vh] p-6 lg:px-[36px] lg:py-[81px]',$attrs.class]">
    <slot />
  </div>
</template>

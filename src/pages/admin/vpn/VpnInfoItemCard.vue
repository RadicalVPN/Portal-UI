<template>
  <va-card-content class="grid grid-cols-12">
    <div class="col-span-6 flex items-center">{{ title }}</div>
    <div class="col-span-6 flex justify-between items-center pr-4">
      {{ value }}
    </div>
  </va-card-content>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    value: string
  }>()
</script>

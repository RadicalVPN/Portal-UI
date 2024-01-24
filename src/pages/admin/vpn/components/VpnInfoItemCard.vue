<template>
  <va-card-content class="grid grid-cols-12">
    <div class="col-span-6 flex items-center">{{ title }}</div>
    <div class="col-span-6 flex justify-between items-center pr-4">
      <va-icon v-if="icon && !value" :name="icon" />

      <VaPopover v-else-if="icon && value" :message="value || 'N/A'">
        <va-icon :name="icon" />
      </VaPopover>

      <a v-else>{{ value }}</a>
    </div>
  </va-card-content>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    value?: string
    icon?: string
  }>()
</script>

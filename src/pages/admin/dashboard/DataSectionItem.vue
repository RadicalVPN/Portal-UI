<template>
  <VaCard>
    <VaCardContent>
      <section>
        <header class="flex items-center justify-between">
          <VaSkeleton v-if="loading" variant="text" :lines="1" />
          <div v-else class="text-lg font-semibold grow">{{ value }}</div>
          <div
            class="p-1 rounded"
            :style="{
              backgroundColor: iconBackground,
              color: iconColor,
            }"
          >
            <slot name="icon"></slot>
          </div>
        </header>
        <div>
          <p class="mb-2">{{ title }}</p>
        </div>
      </section>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { VaCard } from 'vuestic-ui'

  defineProps<{
    title: string
    value: string | number
    loading?: boolean
    iconBackground: string
    iconColor: string
  }>()
</script>

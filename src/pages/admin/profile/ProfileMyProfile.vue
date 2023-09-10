<template>
  <va-card class="horizontal-bars">
    <va-card-title style="font-size: 0.875rem">My Profile</va-card-title>

    <va-card-content class="my-3 grid grid-cols-12 gap-6">
      <div class="col-span-10">
        <div class="mb-4">
          <p class="text-sm font-semibold">Username:</p>
          <p class="text-lg">{{ user.username }}</p>
        </div>
        <div class="mb-4">
          <p class="text-sm font-semibold">E-Mail:</p>
          <p class="text-lg">{{ user.email }}</p>
        </div>
        <div class="mb-4">
          <p class="text-sm font-semibold">Subscription</p>
          <p class="text-xl">Free</p>
        </div>
        <div>
          <p class="text-sm font-semibold">Active</p>
          <p class="text-xl">{{ userActive }}</p>
        </div>
      </div></va-card-content
    >
  </va-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useGlobalStore } from '../../../stores/global-store'

  const store = useGlobalStore()
  const user = store.user
  const userActive = computed(() => (user.active ? 'Yes' : 'No'))
</script>

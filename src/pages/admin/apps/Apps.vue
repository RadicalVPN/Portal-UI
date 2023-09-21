<template>
  <div>
    <div v-for="([key, item], index) in Object.entries(items)" :key="index">
      <div class="text-2xl font-bold mb-4">{{ key }}</div>

      <div class="grid gap-4">
        <va-card v-for="(_item, _index) in item" :key="_index" class="cursor-pointer">
          <va-card-content class="flex items-center">
            <component :is="_item.icon" class="mr-2" />

            <div class="flex-1">
              <div class="text-lg font-bold">{{ _item.name }}</div>
              <div class="text-sm">{{ _item.description }}</div>
            </div>

            <div class="flex">
              <div class="text-sm mr-2">Version {{ _item.version }}</div>
              <va-icon name="fa-download" />
            </div>
          </va-card-content>
        </va-card>
      </div>

      <div class="mb-6"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import MacOs from '../../../components/icons/os/MacOS.vue'
  import Linux from '../../../components/icons/os/Linux.vue'
  import Windows from '../../../components/icons/os/Windows.vue'
  import Ios from '../../../components/icons/os/iOS.vue'
  import Android from '../../../components/icons/os/Android.vue'
  import { ref } from 'vue'

  const items = ref({
    ['Desktops / Laptops']: [
      {
        name: 'macOS',
        icon: MacOs,
        description: 'Manage your VPNs',
        version: '1.0.0',
      },
      {
        name: 'Windows',
        icon: Windows,
        description: 'Manage your VPNs',
        version: '1.0.0',
      },
      {
        name: 'Linux',
        icon: Linux,
        description: 'Manage your VPNs',
        version: '1.0.0',
      },
    ],
    ['Mobile']: [
      {
        name: 'iOS',
        icon: Ios,
        description: 'Manage your VPNs',
        version: '1.0.0',
      },
      {
        name: 'Android',
        icon: Android,
        description: 'Manage your VPNs',
        version: '1.0.0',
      },
    ],
  })
</script>

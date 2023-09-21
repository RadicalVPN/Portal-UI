<template>
  <div>
    <div v-for="([key, item], index) in Object.entries(items)" :key="index">
      <div class="text-2xl font-bold mb-4">{{ key }}</div>

      <div class="grid gap-4">
        <va-card
          v-for="(_item, _index) in item"
          :key="_index"
          class="cursor-pointer"
          @click="downloadClient(_item.url)"
        >
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

  interface Apps {
    [key: string]: {
      name: string
      icon: any
      description: string
      version: string
      url: string
    }[]
  }

  const items = ref<Apps>({
    ['Desktops / Laptops']: [
      {
        name: 'macOS',
        icon: MacOs,
        description: 'Supports macOS 12.0+',
        version: '1.0.16',
        url: 'https://itunes.apple.com/us/app/wireguard/id1451685025?ls=1&mt=12',
      },
      {
        name: 'Windows',
        icon: Windows,
        description: 'Supports Windows 7, 8.1, 10, 11',
        version: '0.5.3',
        url: 'https://download.wireguard.com/windows-client/wireguard-installer.exe',
      },
      {
        name: 'Linux',
        icon: Linux,
        description: 'Support Depends on the distribution',
        version: '1.0.2',
        url: 'https://www.wireguard.com/install/',
      },
    ],
    ['Mobile']: [
      {
        name: 'iOS',
        icon: Ios,
        description: 'Supports iOS 15.0+',
        version: '1.0.16',
        url: 'https://itunes.apple.com/us/app/wireguard/id1441195209?ls=1&mt=8',
      },
      {
        name: 'Android',
        icon: Android,
        description: 'Supports Android 5.0+',
        version: '1.0.2',
        url: 'https://play.google.com/store/apps/details?id=com.wireguard.android',
      },
    ],
  })

  function downloadClient(url: string) {
    window.open(url, '_blank')
  }
</script>

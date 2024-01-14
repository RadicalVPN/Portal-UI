<template>
  <va-card class="horizontal-bars">
    <va-card-content class="my-3 grid grid-cols-12 gap-6">
      <div class="col-span-8 flex items-center">
        <span class="font-bold">Total Server Online: {{ `${onlineServer.length}/${store.server.length || 0}` }}</span>
      </div>
      <div class="col-span-4 flex justify-between items-center pr-4">
        <div class="ml-auto">
          <va-button @click="store.refreshServerList()">
            <va-icon name="fa-refresh" size="xs"></va-icon>
          </va-button>
        </div>
      </div>
    </va-card-content>
  </va-card>

  <div class="grid grid-cols-12 gap-6">
    <va-card
      v-for="(server, index) in store.server"
      :key="index"
      class="vpn-page__cards va-text-center col-span-12 sm:col-span-5 lg:col-span-3 xl:col-span-3 overflow-clip pt-2"
    >
      <div class="flex justify-center items-center">
        <span
          :class="`fi fi-${server.country} fi-size-large`"
          style="height: 85px; max-width: 1000px; width: 100%"
        ></span>
      </div>

      <va-card-content>
        <va-divider />

        <vpn_info_card title="Name" :value="server.hostname" />
        <vpn_info_card title="Country" :value="server.country" />
        <vpn_info_card title="City" :value="server.city" />

        <va-card-content class="grid grid-cols-12">
          <div class="col-span-6 flex items-center">{{ 'Status' }}</div>
          <div class="col-span-6 flex justify-between items-center pr-4">
            <va-badge v-if="server.online" text="Online" color="success" class="mr-2" />
            <va-badge v-else text="Offline" color="danger" class="mr-2" />
          </div>
        </va-card-content>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useGlobalStore } from '../../../stores/global-store'
  import vpn_info_card from '../vpn/VpnInfoItemCard.vue'

  const store = useGlobalStore()
  const onlineServer = computed(() => {
    return store.server.filter((server) => server.online)
  })
</script>

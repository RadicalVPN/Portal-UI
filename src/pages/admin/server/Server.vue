<template>
  <div class="grid grid-cols-12 gap-6">
    <va-card
      v-for="(server, index) in store.server"
      :key="index"
      class="vpn-page__cards va-text-center col-span-12 sm:col-span-5 lg:col-span-3 xl:col-span-3 overflow-clip pt-2"
    >
      <span
        class="fi fi-de fi-size-large"
        style="
          height: 100px;
          max-width: 1000px;
          position: relative;
          width: 80%;
          background-repeat: unset;
          background-position: unset;
          background-size: unset;
        "
      ></span>

      <va-card-title>{{ server.name }}</va-card-title>

      <va-card-content>
        <vpn_info_card title="Country" :value="server.country" />
        <vpn_info_card title="City" :value="server.city" />
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { useGlobalStore } from '../../../stores/global-store'
  import vpn_info_card from '../vpn/VpnInfoItemCard.vue'

  const store = useGlobalStore()
</script>

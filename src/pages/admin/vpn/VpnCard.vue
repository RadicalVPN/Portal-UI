<template>
  <va-card-title style="font-size: 0.875rem">
    {{ vpn.alias }}
    <va-spacer />
    <va-icon name="fa-trash" color="secondary" @click="deleteVpn(vpn.id)" />
  </va-card-title>

  <va-card-content>
    <vpn_info_card title="Upstream" :value="`${store.humanFileSize(vpnStates?.[vpn.id]?.rx || 0)}/s`" />
    <vpn_info_card title="Downstream" :value="`${store.humanFileSize(vpnStates?.[vpn.id]?.tx || 0)}/s`" />
    <vpn_toggle_card :vpn="vpn" />
    <vpn_info_card title="IPv4" :value="vpn.status.allowedIps[0] || 'N/A'" />
    <vpn_info_card title="IPv6" :value="vpn.status.allowedIps?.[1] || 'N/A'" />
    <vpn_info_card title="Server" :value="vpnServer?.hostname || 'N/A'" :icon="vpnServerIcon" />

    <div class="flex">
      <va-button @click="showVpnQrModel = true">
        <va-icon name="fa-qrcode"></va-icon>
      </va-button>

      <va-spacer class="spacer" />

      <va-button @click="downloadConfiguration(vpn.id, vpn.alias)">
        <va-icon name="fa-download"></va-icon>
      </va-button>
    </div>
  </va-card-content>

  <va-modal v-model="showVpnQrModel" title="VPN QR Code" cancel-text="Cancel" blur>
    <img class="items-center" :src="`/api/1.0/vpn/${vpn.id}/qrcode`"
  /></va-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { saveAs } from 'file-saver'
  import { useGlobalStore } from '../../../stores/global-store'
  import vpn_toggle_card from './components/VpnToggleCard.vue'
  import vpn_info_card from './components/VpnInfoItemCard.vue'

  const store = useGlobalStore()
  const props = defineProps<{
    vpn: any
    vpnStates: any
  }>()

  const vpnServer = computed(() => store.server.find((server) => server.id === props.vpn.node))
  const vpnServerIcon = computed(() => `flag-icon-${vpnServer.value?.country} small`)
  const showVpnQrModel = ref(false)

  async function deleteVpn(id: number) {
    store.vpns = store.vpns.filter((vpn: any) => vpn.id !== id)
    await fetch(`/api/1.0/vpn/${id}`, {
      method: 'DELETE',
    })
  }

  async function downloadConfiguration(id: number, alias: string) {
    const data = await (await fetch(`/api/1.0/vpn/${id}/config`)).text()
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `radical_vpn-${alias.replaceAll(' ', '')}.conf`)
  }
</script>

<style lang="scss">
  @import 'flag-icons/css/flag-icons.css';

  .va-modal__inner {
    min-width: 326px;
  }
</style>

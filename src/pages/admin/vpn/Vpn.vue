<template>
  <div class="vpn-page">
    <!-- TODO: SPLIT THIS INTO A SEPERATE COMPONENT -->

    <va-card class="horizontal-bars">
      <va-card-content class="my-3 grid grid-cols-12 gap-6">
        <div class="col-span-7 flex items-center">
          <span class="font-bold">Total VPNs: {{ vpns?.length || 0 }}</span>
        </div>
        <div class="col-span-5 flex justify-between items-center pr-4">
          <va-input v-model="vpnSearch" type="text" placeholder="Search..." />
          <div class="ml-4">
            <va-button icon="fa-plus" @click="showVpnAddModel = true">Create new VPN</va-button>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <div class="grid grid-cols-12 gap-6">
      <va-inner-loading v-if="busy" loading />
      <va-card
        v-for="(vpn, index) in vpnSearch ? vpns.filter((vpn: any) => vpn.alias.toLowerCase().includes(vpnSearch.toLowerCase())) : vpns"
        :key="index"
        class="vpn-page__cards va-text-center col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 overflow-clip"
      >
        <vpn_card :vpn="vpn"></vpn_card>
      </va-card>
    </div>

    <va-modal v-model="showVpnAddModel" title="Create VPN" ok-text="Create" cancel-text="Cancel" blur @ok="addVPN">
      <va-input v-model="vpnAddAlias" class="mb-4" type="email" label="Alias" />
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  interface LastTxRxHash {
    [key: string]: {
      rx: number
      tx: number
    }
  }

  interface ShowQrCodeModel {
    [key: string]: boolean
  }

  import { saveAs } from 'file-saver'
  import { onMounted, ref } from 'vue'
  import vpn_card from './VpnCard.vue'
  import { useGlobalStore } from '../../../stores/global-store'

  let busy = ref(false)
  let vpns = ref()
  const toggles = ref({} as any)
  const vpnStates = ref({} as LastTxRxHash)
  const showVpnAddModel = ref(false)
  const vpnSearch = ref('')
  const vpnAddAlias = ref('')

  const store = useGlobalStore()

  async function requestVPNs() {
    return (await (await fetch('/api/1.0/vpn')).json()).sort((a: any, b: any) => a.id - b.id)
  }

  async function addVPN() {
    await fetch('/api/1.0/vpn', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alias: vpnAddAlias.value,
      }),
    })
    showVpnAddModel.value = false

    //refetch vpns
    vpns.value = await requestVPNs()
  }

  onMounted(async () => {
    busy.value = true
    const _vpns = await requestVPNs()
    //set current active toggles to model
    _vpns.forEach((vpn: any) => (toggles.value[vpn.id] = vpn.active))

    vpns.value = _vpns
    busy.value = false

    //fetch vpn states every seocnd
    setInterval(async () => {
      vpns.value?.forEach((vpn: any) => {
        store.lastVpnTrafficHash[vpn.id] = {
          rx: vpn?.status.transfer.rx || 0,
          tx: vpn?.status.transfer.tx || 0,
        }
      })

      vpns.value = await requestVPNs()
      vpns.value?.forEach((vpn: any) => {
        vpnStates.value[vpn.id] = {
          rx: vpn.status.transfer.rx - (store.lastVpnTrafficHash[vpn.id]?.rx || 0),
          tx: vpn.status.transfer.tx - (store.lastVpnTrafficHash[vpn.id]?.tx || 0),
        }
      })
    }, 1000)
  })
</script>

<template>
  <h1 class="page-title font-bold">VPN</h1>

  <va-card class="horizontal-bars">
    <va-card-content class="my-3 grid grid-cols-12 gap-6">
      <div class="col-span-8 flex items-center">
        <span class="font-bold">Total VPNs: {{ store.vpns.length || 0 }}</span>
      </div>
      <div class="col-span-4 flex justify-between items-center pr-4">
        <va-input v-model="vpnSearch" type="text" placeholder="Search..." clearable />
        <div class="ml-4">
          <va-button @click="router.push({ name: 'vpn-add' })">
            <va-icon name="fa-plus" size="xs"></va-icon>
          </va-button>
        </div>
      </div>
    </va-card-content>
  </va-card>

  <div class="grid grid-cols-12 gap-6">
    <va-inner-loading v-if="busy" loading />
    <va-card
      v-for="(vpn, index) in filteredVpns"
      :key="index"
      class="vpn-page__cards va-text-center col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 overflow-clip"
    >
      <vpn_card :vpn="vpn" :vpn-states="vpnStates"></vpn_card>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import vpn_card from './VpnCard.vue'
  import { useGlobalStore } from '../../../stores/global-store'
  import { useRouter } from 'vue-router'

  interface LastTxRxHash {
    [key: string]: {
      rx: number
      tx: number
    }
  }

  let busy = ref(false)
  const toggles = ref({} as any)
  const vpnStates = ref({} as LastTxRxHash)

  const router = useRouter()
  const store = useGlobalStore()

  const vpnSearch = ref('')
  const filteredVpns = computed(() => {
    return store.vpns.filter((vpn: any) => vpn.alias.toLowerCase().includes(vpnSearch.value.toLowerCase()))
  })

  async function requestVPNs() {
    return (await (await fetch('/api/1.0/vpn')).json()).sort((a: any, b: any) => a.id - b.id)
  }

  let refreshTimer: any
  onMounted(async () => {
    busy.value = true
    const _vpns = await requestVPNs()
    //set current active toggles to model
    _vpns.forEach((vpn: any) => (toggles.value[vpn.id] = vpn.active))

    store.vpns = _vpns
    busy.value = false

    //fetch vpn states every seocnd
    refreshTimer = setInterval(async () => {
      store.vpns.forEach((vpn: any) => {
        store.lastVpnTrafficHash[vpn.id] = {
          rx: vpn?.status.transfer.rx || 0,
          tx: vpn?.status.transfer.tx || 0,
        }
      })

      store.vpns = await requestVPNs()
      store.vpns.forEach((vpn: any) => {
        vpnStates.value[vpn.id] = {
          rx: vpn.status.transfer.rx - (store.lastVpnTrafficHash[vpn.id]?.rx || 0),
          tx: vpn.status.transfer.tx - (store.lastVpnTrafficHash[vpn.id]?.tx || 0),
        }
      })
    }, 1000)
  })

  //make sure to clean the interval before unmounting
  onBeforeUnmount(() => {
    console.log('unmounting refresh timer')
    clearInterval(refreshTimer)
  })
</script>

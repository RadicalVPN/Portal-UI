<template>
  <div class="vpn-page">
    <!-- TODO: SPLIT THIS INTO A SEPERATE COMPONENT -->

    <va-card class="horizontal-bars">
      <va-card-content class="my-3 grid grid-cols-12 gap-6">
        <div class="col-span-7 flex items-center">
          <span class="font-bold">Total VPNs: {{ vpns?.length || 0 }}</span>
        </div>
        <div class="col-span-5 flex justify-between items-center pr-4">
          <!-- Input-Box für die Suche -->
          <va-input v-model="vpnSearch" type="text" placeholder="Search..." />
          <div class="ml-4">
            <!-- Padding zwischen Input und Button -->
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
        <va-card-title style="font-size: 0.875rem">
          <!-- Hier können Sie die gewünschte Textgröße festlegen -->
          {{ vpn.alias }}
          <va-spacer />
          <va-button size="small" icon="fa-trash" color="danger" />
        </va-card-title>

        <va-card-content>
          <va-card-content class="grid grid-cols-12">
            <div class="col-span-6 flex items-center">Upstream</div>
            <div class="col-span-6 flex justify-between items-center pr-4">
              {{ humanFileSize(vpnStates?.[vpn.id]?.rx || 0) }}/s
            </div>
          </va-card-content>
          <va-card-content class="grid grid-cols-12">
            <div class="col-span-6 flex items-center">Downstream</div>
            <div class="col-span-6 flex justify-between items-center pr-4">
              {{ humanFileSize(vpnStates?.[vpn.id]?.tx || 0) }}/s
            </div>
          </va-card-content>
          <va-card-content class="grid grid-cols-12">
            <div class="col-span-3 flex items-center">Activated</div>
            <div class="col-span-9">
              <va-switch v-model="toggles[vpn.id]" size="small" @click="toggleVpn(vpn.id)" />
            </div>
          </va-card-content>
          <va-card-content class="grid grid-cols-12">
            <div class="col-span-6 flex items-center">KeepAlive</div>
            <div class="col-span-6 flex justify-between items-center pr-4">
              {{ vpn.status.persistentKeepalive }}
            </div>
          </va-card-content>
          <va-card-content class="grid grid-cols-12">
            <div class="col-span-6 flex items-center">IP</div>
            <div class="col-span-6 flex justify-between items-center pr-4">
              {{ vpn.status.allowedIps[0] || 'N/A' }}
            </div>
          </va-card-content>
          <va-card-content class="grid grid-cols-12">
            <div class="col-span-6 flex items-center"></div>
            <div class="col-span-6 flex justify-between items-center pr-4">
              {{ vpn.status.allowedIps?.[1]?.slice(13, -1) || 'N/A' }}
            </div>
          </va-card-content>

          <div class="my-3 grid grid-cols-12 gap-6">
            <div class="col-span-6 flex items-center">
              <va-button icon="fa-qrcode" @click="showVPNQrCodeModel[vpn.id] = true"></va-button>
            </div>
            <div class="col-span-3"></div>
            <div class="col-span-2">
              <va-button icon="fa-download" @click="downloadConfiguration(vpn.id, vpn.alias)" />
            </div>
          </div>
        </va-card-content>

        <va-modal v-model="showVPNQrCodeModel[vpn.id]" title="VPN QR Code" cancel-text="Cancel" blur>
          <img class="items-center" :src="`/api/2.0/vpn/${vpn.id}/qrcode`"
        /></va-modal>
      </va-card>
    </div>

    <va-modal v-model="showVpnAddModel" title="Create VPN" ok-text="Create" cancel-text="Cancel" blur>
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

  let busy = ref(false)
  let vpns = ref()
  const toggles = ref({} as any)
  const lastVpnStates = ref({} as LastTxRxHash)
  const vpnStates = ref({} as LastTxRxHash)
  const showVpnAddModel = ref(false)
  const showVPNQrCodeModel = ref({} as ShowQrCodeModel)
  const vpnSearch = ref('')
  const vpnAddAlias = ref('')

  async function toggleVpn(id: number) {
    await fetch(`/api/1.0/vpn/${id}/toggle`, {
      method: 'POST',
    })
  }

  function humanFileSize(size: number) {
    if (size < 1024) return size + ' B'
    let i = Math.floor(Math.log(size) / Math.log(1024))
    let num = size / Math.pow(1024, i)
    let round = Math.round(num)
    const out = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round
    return `${out} ${'KMGTPEZY'[i - 1]}B`
  }

  async function requestVPNs() {
    return (await (await fetch('/api/1.0/vpn')).json()).sort((a: any, b: any) => a.id - b.id)
  }

  async function downloadConfiguration(id: number, alias: string) {
    const data = await (await fetch(`/api/1.0/vpn/${id}/config`)).text()
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `radical_vpn-${alias.replace(' ', '')}.conf`)
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
        lastVpnStates.value[vpn.id] = {
          rx: vpn?.status.transfer.rx || 0,
          tx: vpn?.status.transfer.tx || 0,
        }
      })

      vpns.value = await requestVPNs()
      vpns.value?.forEach((vpn: any) => {
        vpnStates.value[vpn.id] = {
          rx: vpn.status.transfer.rx - (lastVpnStates?.value[vpn.id]?.rx || 0),
          tx: vpn.status.transfer.tx - (lastVpnStates.value[vpn.id]?.tx || 0),
        }
      })
    }, 1000)
  })
</script>

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
          <va-input type="text" placeholder="Search..." />
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
        v-for="(vpn, index) in vpns"
        :key="index"
        class="vpn-page__cards va-text-center col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3"
      >
        <va-card-title style="font-size: 1rem">
          <!-- Hier können Sie die gewünschte Textgröße festlegen -->
          {{ vpn.alias }}
          <va-spacer />
          <va-button size="small" icon="fa-trash" color="danger" />
        </va-card-title>

        <va-card-content>
          <div class="pt-6">
            <span>Transfer RX/s: {{ vpn.status.transfer.rx - lastVpnStates?.[vpn.id]?.rx || 0 }}</span>
            <span>Transfer TX/s: {{ vpn.status.transfer.tx - lastVpnStates?.[vpn.id]?.tx || 0 }}</span>
          </div>

          <va-switch v-model="toggles[vpn.id]" size="small" @click="toggleVpn(vpn.id)" />

          <div class="not-found-pages__button-container pt-4 mb-0">
            <va-button size="small">
              {{ 'Show QR Code' }}
            </va-button>
            <va-button size="small">
              {{ 'Download' }}
            </va-button>
          </div>
          <div class="not-found-pages__button-container pt-4 mb-0"></div>
        </va-card-content>
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

  import { onMounted, ref } from 'vue'
  let busy = ref(false)
  let vpns = ref()
  const toggles = ref({} as any)
  const lastVpnStates = ref({} as LastTxRxHash)
  const showVpnAddModel = ref(false)
  const vpnAddAlias = ref('')

  async function toggleVpn(id: number) {
    await fetch(`/api/1.0/vpn/${id}/toggle`, {
      method: 'POST',
    })
  }

  async function requestVPNs() {
    return (await (await fetch('/api/1.0/vpn')).json()).sort((a: any, b: any) => a.id - b.id)
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
          rx: vpn.status.transfer.rx,
          tx: vpn.status.transfer.tx,
        }
      })

      vpns.value = await requestVPNs()
    }, 1000)
  })
</script>

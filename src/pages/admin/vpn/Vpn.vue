<template>
  <div class="vpn-page">
    <div class="grid grid-cols-12 gap-6">
      <va-inner-loading v-if="busy" loading />

      <va-card
        v-for="(vpn, index) in vpns"
        :key="index"
        class="vpn-page__cards va-text-center col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3"
      >
        <va-card-content>
          {{ vpn.alias }}

          <div class="pt-6">
            <span>Active: {{ vpn.active }}</span>
          </div>

          <va-switch size="small" @click="toggleVpn(vpn.id)" v-model="toggles[vpn.id]" />

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
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  let busy = ref(false)
  let vpns = ref()
  const toggles = ref({} as any)

  async function toggleVpn(id: number) {
    await fetch(`/api/1.0/vpn/${id}/toggle`, {
      method: 'POST',
    })
  }

  onMounted(async () => {
    busy.value = true
    const _vpns = await (await fetch('/api/1.0/vpn')).json()

    //set current active toggles to model
    _vpns.forEach((vpn: any) => (toggles.value[vpn.id] = vpn.active))

    vpns.value = _vpns
    busy.value = false
  })
</script>

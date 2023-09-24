<template>
  <div class="grid grid-cols-12 gap-6 pb-6">
    <va-card class="col-span-12 sm:col-span-2" color="success">
      <va-card-content>
        <h2 class="va-h2 m-0 text-white">{{ store.vpns.length }}</h2>
        <p class="text-white">{{ t('dashboard.info.vpns') }}</p>
      </va-card-content>
    </va-card>

    <va-card class="col-span-12 sm:col-span-2" color="success">
      <va-card-content>
        <h2 class="va-h2 m-0 text-white">{{ store.humanFileSize(trafficDown) }}</h2>
        <p class="text-white">{{ t('dashboard.info.trafficDown') }}</p>
      </va-card-content>
    </va-card>

    <va-card class="col-span-12 sm:col-span-2" color="success">
      <va-card-content>
        <h2 class="va-h2 m-0 text-white">{{ store.humanFileSize(trafficUp) }}</h2>
        <p class="text-white">{{ t('dashboard.info.trafficUp') }}</p>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { VaCard, VaCardContent } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  const { t } = useI18n()
  const store = useGlobalStore()

  const trafficUp = ref(0)
  const trafficDown = ref(0)

  onMounted(async () => {
    store.vpns = await (await fetch('/api/1.0/vpn')).json()

    const trafficDat = await (await fetch('/api/1.0/vpn/prometheus/metrics/day')).json()
    trafficUp.value = trafficDat.rx
    trafficDown.value = trafficDat.tx
  })
</script>

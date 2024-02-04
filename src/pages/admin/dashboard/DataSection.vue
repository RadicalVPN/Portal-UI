<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <DataSectionItem
      v-for="metric in dashboardMetrics"
      :key="metric.id"
      :title="metric.title"
      :value="metric.value"
      :icon-background="metric.iconBackground"
      :icon-color="metric.iconColor"
      :loading="metric.loading"
    >
      <template #icon>
        <VaIcon :name="metric.icon" size="large" />
      </template>
    </DataSectionItem>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useColors } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import DataSectionItem from './DataSectionItem.vue'

  const store = useGlobalStore()

  const trafficUp = ref(0)
  const trafficDown = ref(0)

  const trafficLoading = ref(true)
  const vpnsLoading = ref(true)

  interface DashboardMetric {
    id: string
    title: string
    value: string
    icon: string
    iconBackground: string
    iconColor: string
    loading?: boolean
  }

  const { getColor } = useColors()

  const dashboardMetrics = computed<DashboardMetric[]>(() => [
    {
      id: 'totalvpn',
      title: 'Total VPNs',
      value: store.vpns.length.toString(),
      icon: 'fa-shield-alt',
      iconBackground: getColor('success'),
      iconColor: getColor('on-success'),
      loading: vpnsLoading.value,
    },
    {
      id: 'totaldownload',
      title: 'Total Download 24h',
      value: store.humanFileSize(trafficDown.value),
      icon: 'fa-download',
      iconBackground: getColor('info'),
      iconColor: getColor('on-info'),
      loading: trafficLoading.value,
    },
    {
      id: 'totalupload',
      title: 'Total Upload 24h',
      value: store.humanFileSize(trafficUp.value),
      icon: 'fa-upload',
      iconBackground: getColor('danger'),
      iconColor: getColor('on-danger'),
      loading: trafficLoading.value,
    },
  ])

  onMounted(async () => {
    store.vpns = await (await fetch('/api/1.0/vpn')).json()
    vpnsLoading.value = false

    const trafficDat = await (await fetch('/api/1.0/vpn/prometheus/metrics/day')).json()
    trafficLoading.value = false
    trafficUp.value = trafficDat.rx
    trafficDown.value = trafficDat.tx
  })
</script>

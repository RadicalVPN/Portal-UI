<template>
  <div class="grid grid-cols-12 gap-6">
    <va-card class="col-span-12 lg:col-span-12">
      <va-card-title>
        <h1>Traffic Insights</h1>
        <div>
          <va-button class="m-1" size="small" plain icon="fa fa-refresh" @click="loadChart"> </va-button>
        </div>
      </va-card-title>
      <va-card-content>
        <va-chart class="chart" :data="chartData" :options="chartOptions" type="line" />
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { TLineChartData } from '../../../data/types'
  import VaChart from '../../../components/va-charts/VaChart.vue'
  import { useChartData } from '../../../data/charts/composables/useChartData'
  import { useGlobalStore } from '../../../stores/global-store'

  const store = useGlobalStore()
  const dataSet = ref([])
  const labels = ref<string[]>([])

  const chartData = computed<TLineChartData>(() => {
    return useChartData({
      labels: labels.value,
      datasets: dataSet.value,
    }).value
  })

  const chartOptions = computed<any>(() => {
    return {
      scales: {
        y: {
          display: true,
          stacked: true,
          ticks: {
            callback: (value: number) => formatBytes(value),
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => formatBytes(tooltipItem.raw as number),
          },
          bodyFont: {
            size: 14,
            family: 'sans-serif',
          },
          boxPadding: 4,
        },
        legend: {
          position: 'bottom',
          labels: {
            font: {
              color: '#34495e',
              family: 'sans-serif',
              size: 14,
            },
            usePointStyle: true,
          },
        },
      },
    }
  })

  function formatBytes(byte: number) {
    return `${store.humanFileSize(byte)}/s`
  }

  async function loadChart() {
    const data = await (await fetch('/api/1.0/vpn/prometheus/metrics')).json()

    labels.value = data.labels
    dataSet.value = data.datasets
  }

  onMounted(async () => {
    await loadChart()
  })
</script>

<style scoped>
  .chart {
    height: 400px;
  }
</style>

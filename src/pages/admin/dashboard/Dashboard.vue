<template>
  <div class="dashboard">
    <dashboard-info-block />

    <dashboard-traffic />

    <div class="flex justify-center mt-2">
      <va-button
        class="mr-2"
        size="small"
        preset="plain"
        href="https://www.iubenda.com/privacy-policy/19055770"
        title="Privacy Policy"
      >
        Privacy Policy
      </va-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import DashboardTraffic from './DashboardTraffic.vue'
  import DashboardCharts from './DashboardCharts.vue'
  import DashboardInfoBlock from './DashboardInfoBlock.vue'
  import DashboardTabs from './DashboardTabs.vue'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import DashboardMap from './DashboardMap.vue'

  const dashboardMap = ref()

  function addAddressToMap({ city, country }: { city: { text: string }; country: string }) {
    dashboardMap.value.addAddress({ city: city.text, country })
  }
</script>

<style lang="scss">
  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
      &__title {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>

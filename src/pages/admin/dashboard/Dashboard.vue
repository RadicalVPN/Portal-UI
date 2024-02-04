<template>
  <h1 class="page-title font-bold">Dashboard</h1>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <RevenueUpdates class="w-full sm:w-[70%]" />
      <div class="flex flex-col gap-4 w-full sm:w-[30%]"></div>
    </div>

    <dashboard-data-section />

    <dashboard-traffic class="dashboard" />
  </section>
</template>

<script setup lang="ts">
  import DashboardTraffic from './DashboardTraffic.vue'
  import DashboardDataSection from './DataSection.vue'
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

<template>
  <va-card-content class="grid grid-cols-12">
    <div class="col-span-6 flex items-center">Activated</div>
    <va-checkbox v-model="vpnActive" size="small" @click="toggleVpn(vpn.id)" />
  </va-card-content>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps<{
    vpn: any
  }>()
  const vpnActive = ref(props.vpn.active)

  async function toggleVpn(id: number) {
    await fetch(`/api/1.0/vpn/${id}/toggle`, {
      method: 'POST',
    })
  }
</script>

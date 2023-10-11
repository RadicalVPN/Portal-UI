<template>
  <va-card>
    <va-card-title>Create VPN</va-card-title>
    <va-card-content>
      <form>
        <va-input
          v-model="vpnAlias"
          class="mb-4"
          type="email"
          label="Alias"
          :error="!!vpnAliasErrors.length"
          :error-messages="vpnAliasErrors"
        />
        <va-select
          v-model="vpnNodeSearch"
          label="Select a VPN Server"
          searchable
          placeholder="Search a VPN Server"
          :options="vpnNodeOptions"
          :error="!!vpnNodeErrors.length"
          :error-messages="vpnNodeErrors"
        />
      </form>

      <div class="mt-4 flex flex-wrap gap-2">
        <va-button @click="saveVpn">Save</va-button>
        <va-button color="secondary" @click="router.push('vpn')">Cancel</va-button>
      </div>
    </va-card-content>
  </va-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGlobalStore } from '../../../stores/global-store'

  const router = useRouter()
  const store = useGlobalStore()

  const vpnAlias = ref('')
  const vpnAliasErrors = ref<string[]>([])

  const vpnNodeSearch = ref<any>({})
  const vpnNodeOptions = ref<any[]>(
    store.server
      .filter((server) => server.online)
      .map((server) => ({
        code: server.id,
        text: `${server.city} - "${server.hostname}"`,
        icon: `flag-icon-${server.country} large`,
      })),
  )
  const vpnNodeErrors = ref<string[]>([])

  async function saveVpn() {
    vpnAliasErrors.value = vpnAlias.value ? [] : ['Please enter an alias']
    vpnNodeErrors.value = vpnNodeSearch.value ? [] : ['Please select a VPN Server']

    const res = await fetch('/api/1.0/vpn', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alias: vpnAlias.value,
        node: vpnNodeSearch.value.code,
      }),
    })

    if (res.status === 200) {
      console.log('valid')
      router.push('vpn')
      return
    }

    const json = await res.json()
    json.errors.forEach((error: any) => {
      const property = error.instancePath.split('/')[1]
      switch (property) {
        case 'alias':
          vpnAliasErrors.value = [error.message]
          break
      }
    })
  }
</script>

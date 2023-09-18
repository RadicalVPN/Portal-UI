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
          autocomplete
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
  import { SelectableOption } from 'vuestic-ui/dist/types/composables'

  const router = useRouter()

  const vpnAlias = ref('')
  const vpnAliasErrors = ref<string[]>([])

  const vpnNodeSearch = ref('')
  const vpnNodeOptions = ref<SelectableOption[]>([{ code: 'gb', text: 'Information', icon: 'flag-icon-de large' }])
  const vpnNodeErrors = ref<string[]>([])

  async function saveVpn() {
    vpnAliasErrors.value = vpnAlias.value ? [] : ['Please enter an alias']
    vpnNodeErrors.value = vpnNodeSearch.value ? [] : ['Please select a VPN Server']
  }
</script>

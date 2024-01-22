<template>
  <VaModal
    :mobile-fullscreen="false"
    hide-default-actions
    close-button
    model-value
    @update:model-value="emits('cancel')"
  >
    <h3 class="va-h3">Passkeys</h3>
    <p>
      Passkeys are a password replacement that validates your identity using touch, facial recognition, a device
      password, or a PIN.
    </p>

    <VaAlert v-if="!passkeysSupported" color="warning">
      Your current browser does not seem to support Passkeys.
    </VaAlert>

    <VaAlert v-if="!!registrationError" color="danger" class="mb-6"> {{ registrationError }}. </VaAlert>

    <div class="flex justify-end">
      <VaButton
        size="medium"
        :disabled="!passkeysSupported"
        :loading="isRegistrationRunning"
        class="mb-3 mt-6"
        @click="register"
        >Add New Passkey</VaButton
      >
    </div>

    <VaDataTable class="table-crud mt-6" :items="passkeys" :columns="columns" :loading="passKeyLoading">
      <template #cell(actions)="{ rowData }">
        <VaButton preset="plain" icon="delete" class="ml-3" @click="deletePasskey(rowData)" />
      </template>
    </VaDataTable>
  </VaModal>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useGlobalStore } from '../../../../stores/global-store'
  import { client } from '@passwordless-id/webauthn'
  import { RegistrationEncoded } from '@passwordless-id/webauthn/dist/esm/types'
  import axios from 'axios'

  interface IPassKey {
    name: string
    lastUsed: string
    id: string
  }

  const store = useGlobalStore()
  const emits = defineEmits(['cancel'])
  const registrationError = ref('')
  const isRegistrationRunning = ref(false)
  const passKeyLoading = ref(false)

  const rawPasskeys = ref([])
  const passkeys = computed<IPassKey[]>(() => {
    return rawPasskeys.value.map((key: any) => ({
      name: key.authenticatorName,
      lastUsed: new Date(key.lastUsage).toLocaleString(),
      id: key.id,
    }))
  })

  const columns = [
    { key: 'name', sortable: true },
    { key: 'lastUsed', sortable: true },
    { key: 'actions', width: 60 },
  ]

  const passkeysSupported = client.isAvailable()

  onMounted(async () => {
    await loadPasskeys()
  })

  async function loadPasskeys() {
    passKeyLoading.value = true
    rawPasskeys.value = await (await fetch('/api/1.0/passkey')).json()
    passKeyLoading.value = false
  }

  async function register() {
    registrationError.value = ''
    isRegistrationRunning.value = true

    const challenge = (await axios.get('/api/1.0/user/webauthn/challenge')).data.challenge

    let registration: RegistrationEncoded
    try {
      registration = await client.register(store.user.email, challenge, {
        authenticatorType: 'auto',
        userVerification: 'required',
        discoverable: 'required',
        timeout: 60000,
        attestation: false,
      })
    } catch (error: any) {
      const msg = error.message

      console.log('Webauthn: Registration failed', msg)
      registrationError.value = msg.split('.')[0] ?? 'Unknown Webauthn error'
      return
    } finally {
      isRegistrationRunning.value = false
    }

    const result = (await axios.put('/api/1.0/user/webauthn/verify', registration, { validateStatus: () => true })).data

    if (result.success === false) {
      registrationError.value = result.message ?? 'Unknown Server Webauthn error'
    }

    console.log('WebAuthn: Registration complete', result)
  }

  async function deletePasskey(passKey: IPassKey) {
    console.log('delete passkey', passKey.id)

    await loadPasskeys()
  }
</script>

<style lang="scss">
  .va-modal__inner {
    min-width: 326px;
  }
</style>

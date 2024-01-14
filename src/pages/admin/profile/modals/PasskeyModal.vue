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
      Your current browser does not seem to support Passkeys,
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

    <VaDataTable class="table-crud mt-6" :items="passkeys" :columns="columns">
      <template #cell(actions)="{}">
        <VaButton preset="plain" icon="delete" class="ml-3" />
      </template>
    </VaDataTable>
  </VaModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useGlobalStore } from '../../../../stores/global-store'
  import { client } from '@passwordless-id/webauthn'
  import { RegistrationEncoded } from '@passwordless-id/webauthn/dist/esm/types'

  const store = useGlobalStore()
  const emits = defineEmits(['cancel'])
  const registrationError = ref('')
  const isRegistrationRunning = ref(false)

  const passkeys = ref([
    {
      name: 'Yubikey',
      lastUsed: '2021-08-01 12:00:00',
    },
  ])

  const columns = [
    { key: 'name', sortable: true },
    { key: 'lastUsed', sortable: true },
    { key: 'actions', width: 60 },
  ]

  const passkeysSupported = client.isAvailable()

  async function register() {
    registrationError.value = ''
    isRegistrationRunning.value = true

    //TOOD: GENERATE THIS ON THE SERVEr
    const randomNum = Math.floor(Math.random() * 10)
    const challenge = `a7c61ef9-dc23-4806-b486-2428938a54${randomNum}e`

    console.log('Webauthn: Starting registration')
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

    console.log('WebAuthn: Registration complete')

    console.log(registration)

    //TODO: SEND REGISTRATION TO SERVER
  }
</script>

<style lang="scss">
  .va-modal__inner {
    min-width: 326px;
  }
</style>

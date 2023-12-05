<template>
  <VaModal
    :mobile-fullscreen="false"
    hide-default-actions
    model-value
    blur
    close-button
    no-dismiss
    @update:model-value="emits('cancel')"
  >
    <va-input
      v-model="currentPassword"
      label="Current Password"
      placeholder="•••••••••••••"
      type="password"
      class="mb-4"
      :error="!!currentPasswordErrors.length"
      :error-messages="currentPasswordErrors"
    ></va-input>

    <va-input
      v-model="totp"
      label="Current TOTP Token"
      placeholder="123456"
      type="number"
      class="mb-4"
      :error="!!totpErrors.length"
      :error-messages="totpErrors"
    ></va-input>

    <va-button @click="onTotpDisableSubmit">Send</va-button>
  </VaModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useToast } from 'vuestic-ui/web-components'
  import { useGlobalStore } from '../../../../stores/global-store'

  const emits = defineEmits(['cancel'])
  const { init } = useToast()
  const store = useGlobalStore()

  const currentPassword = ref()
  const currentPasswordErrors = ref<string[]>([])

  const totp = ref('')
  const totpErrors = ref<string[]>([])

  async function onTotpDisableSubmit() {
    currentPasswordErrors.value = []
    totpErrors.value = []

    try {
      const res = await fetch('/api/1.0/auth/totp', {
        method: 'DELETE',
        body: JSON.stringify({
          password: currentPassword.value,
          totp: totp.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status !== 200) {
        switch (await res.text()) {
          case 'invalid password':
            currentPasswordErrors.value.push('Invalid password')
            break
          case 'invalid totp token':
            totpErrors.value.push('Invalid TOTP token')
            break
          default:
            unknownError()
            break
        }

        return
      }

      init({
        message: '2FA successfully disabled',
        color: 'success',
      })

      emits('cancel')

      store.user.totp = false
    } catch {
      unknownError()
    }
  }

  function unknownError() {
    currentPasswordErrors.value.push('Unknown error')
    totpErrors.value.push('Unknown error')
  }
</script>

<style lang="scss">
  .va-modal__inner {
    min-width: 326px;
  }
</style>

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
    <VaStepper v-model="step" :steps="steps" navigation-disabled controls-hidden :finish-button-hidden="false">
      <template #step-content-0>
        <va-input
          v-model="currentPassword"
          label="Current Password"
          class="mb-4"
          type="password"
          :error="!!currentPasswordErrors.length"
          :error-messages="currentPasswordErrors"
        ></va-input>

        <va-button @click="onPasswordSubmit">Send</va-button>
      </template>
      <template #step-content-1>
        <div class="flex flex-auto items-center justify-center h-full">
          <img alt="TOTP QrCode" class="mb-4 object-none object-top" :src="imageUrl" />

          <p class="leading-6 mb-4">
            Scan the code with an app like Google Authenticator or Authy.<br />Once you have done that, enter the 6
            digit code here.
          </p>
        </div>

        <va-input
          v-model="totpVerify"
          label="Verify TOTP Token"
          type="number"
          class="mb-4"
          :error="!!totpVerifyErrors.length"
          :error-messages="totpVerifyErrors"
        ></va-input>

        <VaSpacer class="spacer" />
        <va-button @click="onTotpTokenSubmit">Send</va-button>
      </template>
      <template #step-content-2>
        <p class="leading-6 mb-4">
          🎉✅ TOTP has been set up successfully. At the next Login you will be asked for your TOTP code.
        </p>

        <va-button @click="emits('cancel')">Finish</va-button>
      </template>
    </VaStepper>
  </VaModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useGlobalStore } from '../../../../stores/global-store'

  const emits = defineEmits(['cancel'])
  const store = useGlobalStore()

  const step = ref(0)
  const steps = [{ label: 'Current Password' }, { label: 'Scan and Confirm' }, { label: 'Finish' }]

  const currentPassword = ref('')
  const currentPasswordErrors = ref<string[]>([])

  const totpVerify = ref('')
  const totpVerifyErrors = ref<string[]>([])

  const imageUrl = ref('')

  async function onPasswordSubmit() {
    currentPasswordErrors.value = []

    const url = `/api/1.0/auth/totp/qrcode?password=${encodeURIComponent(currentPassword.value)}`
    const image = await fetch(url)
    const statusCode = image.status
    const text = await image.text()
    if (statusCode === 401 && text === 'invalid password') {
      currentPasswordErrors.value = ['Invalid Password']
    } else if (statusCode === 200) {
      step.value = 1
      imageUrl.value = url
    } else {
      currentPasswordErrors.value = ['unknown error']
    }
  }

  async function onTotpTokenSubmit() {
    currentPasswordErrors.value = []

    const image = await fetch(`/api/1.0/auth/totp/verify?token=${encodeURIComponent(totpVerify.value)}`)
    const statusCode = image.status
    const text = await image.text()
    if (statusCode === 401 && text === 'invalid totp token') {
      totpVerifyErrors.value = ['Invalid TOTP Token']
    } else if (statusCode === 200) {
      step.value = 2
      store.user.totp = true
    } else {
      totpVerifyErrors.value = ['unknown error']
    }
  }
</script>

<style lang="scss">
  .va-modal__inner {
    min-width: 326px;
  }
</style>

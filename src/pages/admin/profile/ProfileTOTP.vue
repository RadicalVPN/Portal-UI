<template>
  <va-card class="horizontal-bars">
    <va-card-title style="font-size: 0.875rem">TOTP</va-card-title>

    <va-card-content class="my-3 gap-6">
      <p class="text-sm leading-6">
        TOTP (Time-Based One-Time Password) is a two-factor authentication method that enhances account security by
        requiring a time-sensitive code in addition to a password. This code changes at regular intervals, making it
        significantly more challenging for unauthorized users to gain access, even if they have the password.
      </p>

      <va-divider class="mb-4" />

      <p v-if="store.user.totp === true" class="leading-6 mb-4">✅ TOTP has already been successfully set up.</p>

      <va-button
        v-if="totpSetupStep == TOTPSetupStep.INIT && store.user.totp === false"
        @click="totpSetupStep = TOTPSetupStep.CURRENT_PASSWORD"
        >Start TOTP Setup</va-button
      >
      <p v-if="totpSetupStep > 1" class="mb-4 text-lg">TOTP Setup - Step {{ totpSetupStep - 1 }} / 32</p>
      <va-input
        v-if="totpSetupStep == TOTPSetupStep.CURRENT_PASSWORD"
        v-model="currentPassword"
        label="Current Password"
        class="mb-4"
        type="password"
        :error="!!currentPasswordErrors.length"
        :error-messages="currentPasswordErrors"
      ></va-input>
      <va-button v-if="totpSetupStep == TOTPSetupStep.CURRENT_PASSWORD" @click="onPasswordSubmit">Send</va-button>

      <img v-if="totpSetupStep === TOTPSetupStep.VERIFY_TOKEN" class="mb-4" :src="imageUrl" />

      <p v-if="totpSetupStep === TOTPSetupStep.VERIFY_TOKEN" class="leading-6 mb-4">
        Scan the code with an app like Google Authenticator or Authy.<br />Once you have done that, enter the 6 digit
        code here.
      </p>

      <va-input
        v-if="totpSetupStep == TOTPSetupStep.VERIFY_TOKEN"
        v-model="totpVerify"
        label="Verify TOTP Token"
        type="number"
        class="mb-4"
        :error="!!totpVerifyErrors.length"
        :error-messages="totpVerifyErrors"
      ></va-input>
      <va-button v-if="totpSetupStep == TOTPSetupStep.VERIFY_TOKEN" @click="onTotpTokenSubmit">Send</va-button>

      <p v-if="totpSetupStep === TOTPSetupStep.DONE" class="leading-6 mb-4">
        🎉✅ TOTP has been set up successfully. At the next Login you will be asked for your TOTP code.
      </p>
    </va-card-content>
  </va-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useGlobalConfig } from 'vuestic-ui/web-components'
  import { useGlobalStore } from '../../../stores/global-store'

  enum TOTPSetupStep {
    INIT = 1,
    CURRENT_PASSWORD = 2,
    VERIFY_TOKEN = 3,
    DONE = 4,
  }
  const store = useGlobalStore()
  const totpSetupStep = ref(TOTPSetupStep.INIT)

  const currentPassword = ref('')
  const currentPasswordErrors = ref<string[]>([])

  const imageUrl = ref('')
  const totpVerify = ref('')
  const totpVerifyErrors = ref<string[]>([])

  async function onTotpTokenSubmit() {
    currentPasswordErrors.value = []

    const image = await fetch(`/api/1.0/auth/totp/verify?token=${encodeURIComponent(totpVerify.value)}`)
    const statusCode = image.status
    const text = await image.text()
    if (statusCode === 401 && text === 'invalid totp token') {
      totpVerifyErrors.value = ['Invalid TOTP Token']
    } else if (statusCode === 200) {
      totpSetupStep.value = TOTPSetupStep.DONE
    } else {
      totpVerifyErrors.value = ['unknown error']
    }
  }

  async function onPasswordSubmit() {
    currentPasswordErrors.value = []

    const url = `/api/1.0/auth/totp/qrcode?password=${encodeURIComponent(currentPassword.value)}`
    const image = await fetch(url)
    const statusCode = image.status
    const text = await image.text()
    if (statusCode === 401 && text === 'invalid password') {
      currentPasswordErrors.value = ['Invalid Password']
    } else if (statusCode === 200) {
      totpSetupStep.value = TOTPSetupStep.VERIFY_TOKEN
      imageUrl.value = url
    } else {
      currentPasswordErrors.value = ['unknown error']
    }
  }
</script>

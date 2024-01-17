<template>
  <div v-if="routeName === 'login' && passkeysSupported" class="flex justify-center col-span-12 p-4">
    <va-card class="auth-layout__card">
      <va-card-content>
        <div class="flex justify-center">
          <VaAlert v-if="!!loginError" color="danger" class="mb-6"> {{ loginError }}. </VaAlert>
        </div>

        <div class="flex justify-center">
          <va-inner-loading v-if="isLoginRunning" loading />
          <span v-else class="ml-1 va-link" @click="login">{{ t('auth.loginPasskey') }}</span>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { computed, ref } from 'vue'
  import axios from 'axios'
  import { client } from '@passwordless-id/webauthn'
  import { AuthenticationEncoded } from '@passwordless-id/webauthn/dist/esm/types'

  const router = useRouter()
  const { t } = useI18n()

  const passkeysSupported = client.isAvailable()
  const routeName = computed(() => {
    return router.currentRoute.value.name
  })
  const isLoginRunning = ref(false)
  const loginError = ref('')

  async function login() {
    loginError.value = ''
    isLoginRunning.value = true

    const challenge = (await axios.get('/api/1.0/auth/webauthn/challenge')).data.challenge
    const credentials: string[] = [] //use a empty array to let the user choose from all available credentials

    let authentification: AuthenticationEncoded
    try {
      authentification = await client.authenticate(credentials, challenge, {
        authenticatorType: 'auto',
        userVerification: 'required',
        timeout: 60000,
      })
    } catch (error: any) {
      const msg = error.message

      console.log('Webauthn: Login failed', msg)
      loginError.value = 'Login failed: ' + msg.split('.')[0] ?? 'Unknown Webauthn error'
      return
    } finally {
      isLoginRunning.value = false
    }

    const result = (await axios.put('/api/1.0/auth/webauthn/login', authentification, { validateStatus: () => true }))
      .data

    if (result.success === false) {
      loginError.value = 'Login failed: ' + result.message ?? 'Unknown Server Webauthn error'
      return
    }

    router.push({ name: 'dashboard' })
  }
</script>

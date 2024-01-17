<template>
  <va-form tag="form" @submit.prevent="">
    <va-input
      v-model="email"
      class="mb-4"
      type="email"
      :label="t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      v-model="password"
      class="mb-4"
      :type="isPasswordVisible ? 'text' : 'password'"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
      @click-append-inner="isPasswordVisible = !isPasswordVisible"
    >
      <template #appendInner>
        <va-icon :name="isPasswordVisible ? 'visibility_off' : 'visibility'" size="small" color="primary" /> </template
    ></va-input>

    <va-input
      v-if="showTotp === true"
      v-model="totp"
      class="mb-4"
      type="text"
      label="TOTP Code"
      :error="!!totpErrors.length"
      :error-messages="totpErrors"
    />

    <div class="auth-layout__options flex items-center justify-between">
      <va-switch v-model="keepLoggedIn" size="small" class="mb-0" :label="t('auth.keep_logged_in')" />
      <router-link class="ml-1 va-link" :to="{ name: 'recover-password' }">{{
        t('auth.recover_password')
      }}</router-link>
    </div>

    <div class="flex justify-center mt-4">
      <cloudflare-turnstile ref="turnstileRef" v-model="turnstile" />
    </div>

    <div class="flex justify-center mt-4">
      <va-button type="submit" class="w-full" :loading="authenticating" @click="onsubmit">{{
        t('auth.login')
      }}</va-button>
    </div>
  </va-form>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import CloudflareTurnstile from '../../../components/auth/CloudflareTurnstileWrapper.vue'

  const { t } = useI18n()
  const route = useRoute()

  const email = ref('')
  const emailErrors = ref<string[]>([])

  const password = ref('')
  const passwordErrors = ref<string[]>([])
  const isPasswordVisible = ref<boolean>(false)

  const showTotp = ref<boolean>(false)
  const totp = ref('')
  const totpErrors = ref<string[]>([])

  const keepLoggedIn = ref(false)
  const router = useRouter()
  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

  const authenticating = ref(false)

  const turnstile = ref('')
  const turnstileRef = ref()

  const oAuthClient = ref(route.query.client_id)

  async function checkAuth() {
    try {
      const res = await fetch('/api/1.0/auth')
      return {
        success: res.status === 200,
        data: await res.json(),
      }
    } catch {
      return null
    }
  }

  async function authenticate(email: string, password: string, totp: string, rememberMe = false) {
    try {
      const res = await fetch('/api/1.0/auth', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          ...(totp && {
            totpToken: totp,
          }),
          turnstileChallenge: turnstile.value,
          rememberMe,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return {
        success: res.status === 200,
        data: await res.text(),
        statusCode: res.status,
      }
    } catch {
      return {
        success: false,
        statusCode: 0,
        data: {},
      }
    }
  }

  onMounted(async () => {
    const authStats = await checkAuth()

    if (authStats?.success) {
      redirect()
    }
  })

  async function onsubmit() {
    emailErrors.value = email.value ? [] : ['Email is required']
    passwordErrors.value = password.value ? [] : ['Password is required']

    if (!formReady.value) return

    authenticating.value = true
    const authenticated = await authenticate(email.value, password.value, totp.value, keepLoggedIn.value)
    authenticating.value = false

    if (!authenticated.success) {
      //reload turnstile
      turnstileRef.value?.reset()

      if (authenticated.statusCode === 400) {
        const data = JSON.parse(authenticated.data as string)

        data.errors.forEach((error: any) => {
          const property = error.instancePath.split('/')[1]
          switch (property) {
            case 'email':
              emailErrors.value = [error.message]
              break
            case 'password':
              passwordErrors.value = [error.message]
              break
          }
        })

        return
      }

      if (authenticated.statusCode != 401) {
        emailErrors.value = ['Unknown error']
        passwordErrors.value = ['Unknown error']
        return
      }

      if (authenticated.statusCode === 401 && authenticated.data == 'invalid credentials') {
        emailErrors.value = ['Invalid credentials']
        passwordErrors.value = ['Invalid credentials']
        return
      }

      if (authenticated.statusCode === 401 && authenticated.data == 'totp required') {
        showTotp.value = true
        totpErrors.value = ['TOTP is required']
        return
      }

      if (authenticated.statusCode === 401 && authenticated.data == 'invalid totp token') {
        showTotp.value = true
        totpErrors.value = ['Invalid TOTP Token']
        return
      }

      if (authenticated.statusCode === 401 && authenticated.data == 'turnstile challenge failed') {
        const error = ['Captcha (Turnstile) challenge failed']

        emailErrors.value = error
        passwordErrors.value = error

        return
      }

      if (authenticated.statusCode === 401 && authenticated.data == 'email not verified') {
        router.push({ name: 'verify-email' })
        return
      }
    }

    await checkAuth()

    redirect()
  }

  function redirect() {
    if (oAuthClient.value) {
      router.push({ name: 'oauth', query: route.query })
    } else {
      router.push({ name: 'dashboard' })
    }
  }
</script>

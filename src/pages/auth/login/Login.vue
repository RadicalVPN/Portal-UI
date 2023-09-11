<template>
  <form @submit.prevent="onsubmit">
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
      type="password"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

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
      <va-button class="my-0" @click="onsubmit">{{ t('auth.login') }}</va-button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const email = ref('')
  const emailErrors = ref<string[]>([])

  const password = ref('')
  const passwordErrors = ref<string[]>([])

  const showTotp = ref<boolean>(false)
  const totp = ref('')
  const totpErrors = ref<string[]>([])

  const keepLoggedIn = ref(false)
  const router = useRouter()
  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

  async function checkAuth(): Promise<any> {
    try {
      const res = await fetch('/api/1.0/auth')
      return res.status === 200
    } catch {
      return null
    }
  }

  async function authenticate(email: string, password: string, totp: string) {
    try {
      const res = await fetch('/api/1.0/auth', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          ...(totp && {
            totpToken: totp,
          }),
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
    if (await checkAuth()) {
      router.push({ name: 'dashboard' })
    }
  })

  async function onsubmit() {
    emailErrors.value = email.value ? [] : ['Email is required']
    passwordErrors.value = password.value ? [] : ['Password is required']

    if (!formReady.value) return

    const authenticated = await authenticate(email.value, password.value, totp.value)
    if (!authenticated.success) {
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
    }

    await checkAuth()

    router.push({ name: 'dashboard' })
  }
</script>

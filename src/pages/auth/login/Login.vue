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
  import { useGlobalStore } from '../../../stores/global-store'
  import { storeToRefs } from 'pinia'
  const { t } = useI18n()

  const email = ref('')
  const password = ref('')
  const keepLoggedIn = ref(false)
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const router = useRouter()
  const GlobalStore = useGlobalStore()
  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

  async function checkAuth(): Promise<any> {
    try {
      await (await fetch('/api/1.0/auth')).json()
    } catch {
      return null
    }
  }

  async function authenticate(email: string, password: string): Promise<boolean> {
    try {
      const res = await fetch('/api/1.0/auth', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return res.status === 200
    } catch {
      return false
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

    const authenticated = await authenticate(email.value, password.value)
    if (!authenticated) {
      emailErrors.value = ['Invalid credentials']
      passwordErrors.value = ['Invalid credentials']
      return
    }

    await checkAuth()

    router.push({ name: 'dashboard' })
  }
</script>

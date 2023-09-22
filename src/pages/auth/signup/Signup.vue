<template>
  <form @submit.prevent="onsubmit()">
    <va-input
      v-model="email"
      class="mb-4"
      type="email"
      :label="t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      v-model="username"
      class="mb-4"
      type="text"
      :label="t('auth.username')"
      :error="!!usernameErrors.length"
      :error-messages="usernameErrors"
    />

    <va-separator />

    <va-input
      v-model="password"
      :type="isPasswordVisible ? 'text' : 'password'"
      class="mb-4"
      :label="t('auth.password')"
      @click-append-inner="isPasswordVisible = !isPasswordVisible"
    >
      <template #appendInner>
        <va-icon :name="isPasswordVisible ? 'visibility_off' : 'visibility'" size="small" color="primary" /> </template
    ></va-input>

    <va-input
      v-model="passwordConfirm"
      :typeq="isPasswordVisible ? 'text' : 'password'"
      class="mb-4"
      :rules="[(v) => v === password || `Passwords do not match`]"
      :label="t('auth.passwordConfirm')"
      @click-append-inner="isPasswordVisible = !isPasswordVisible"
      ><template #appendInner>
        <va-icon :name="isPasswordVisible ? 'visibility_off' : 'visibility'" size="small" color="primary" /> </template
    ></va-input>

    <div class="auth-layout__options flex items-center justify-between">
      <va-checkbox
        v-model="agreedToTerms"
        class="mb-0"
        :error="!!agreedToTermsErrors.length"
        :error-messages="agreedToTermsErrors"
      >
        <template #label>
          <span class="ml-2">
            {{ t('auth.agree') }}
            <span class="va-link">{{ t('auth.termsOfUse') }}</span>
          </span>
        </template>
      </va-checkbox>
      <router-link class="ml-1 va-link" :to="{ name: 'recover-password' }">
        {{ t('auth.recover_password') }}
      </router-link>
    </div>

    <div class="flex justify-center mt-4">
      <va-button class="my-0" @click="onsubmit">{{ t('auth.sign_up') }}</va-button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vuestic-ui'
  const { t } = useI18n()
  const { init } = useToast()

  const email = ref('')
  const password = ref('')
  const passwordConfirm = ref('')
  const username = ref('')
  const agreedToTerms = ref(false)
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const isPasswordVisible = ref<boolean>(false)
  const agreedToTermsErrors = ref<string[]>([])
  const usernameErrors = ref<string[]>([])
  const router = useRouter()

  const formReady = computed(() => {
    return !(emailErrors.value.length || passwordErrors.value.length || agreedToTermsErrors.value.length)
  })

  async function authenticate(email: string, username: string, password: string) {
    try {
      return await (
        await fetch('/api/1.0/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            username,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json()
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async function onsubmit() {
    emailErrors.value = email.value ? [] : ['Email is required']
    passwordErrors.value = password.value ? [] : ['Password is required']
    usernameErrors.value = username.value ? [] : ['Username is required']
    agreedToTermsErrors.value = agreedToTerms.value ? [] : ['You must agree to the terms of use to continue']

    if (password.value !== passwordConfirm.value) {
      return
    }

    if (!formReady.value) return

    const auth = await authenticate(email.value, username.value, password.value)

    //check if auth is a UserCreationError response
    if (auth?.name && auth?.message) {
      emailErrors.value = [auth.message]
      usernameErrors.value = [auth.message]
      return
    }

    if (auth?.valid === false) {
      auth.errors.forEach((error: any) => {
        const property = error.instancePath.split('/')[1]
        switch (property) {
          case 'email':
            emailErrors.value = [error.message]
            break
          case 'username':
            usernameErrors.value = [error.message]
            break
          case 'password':
            passwordErrors.value = [error.message]
            break
        }
      })
    }

    if (!formReady.value) return

    init({
      message: "You've successfully registered!\nWelcome to RadicalVPN!",
      position: 'top-right',
      duration: 10000,
      color: 'success',
    })

    router.push({ name: 'login' })
  }
</script>

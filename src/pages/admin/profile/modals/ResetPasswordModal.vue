<template>
  <VaModal :mobile-fullscreen="false" hide-default-actions model-value @update:model-value="emits('cancel')">
    <VaForm ref="form" class="space-y-6" @submit.prevent="submit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VaInput
          v-model="oldPassowrd"
          :rules="oldPasswordRules"
          :error="!!oldPasswordErrors.length"
          :error-messages="oldPasswordErrors"
          label="Old password"
          placeholder="Old password"
          required-mark
          type="password"
        />
        <div class="hidden md:block" />
        <VaInput
          v-model="newPassword"
          :rules="newPasswordRules"
          :error="!!newPasswordErrors.length"
          :error-messages="newPasswordErrors"
          label="New password"
          placeholder="New password"
          required-mark
          type="password"
        />
        <VaInput
          v-model="repeatNewPassword"
          :rules="repeatNewPasswordRules"
          label="Repeat new password"
          placeholder="Repeat new password"
          required-mark
          type="password"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <p>After changing your password, you will be logged out of all devices.</p>
        <p>Your current session (current device) will not be deleted.</p>
      </div>
      <div class="flex flex-col-reverse md:justify-end md:flex-row md:space-x-4">
        <VaButton :style="buttonStyles" preset="plain" @click="emits('cancel')"> Cancel</VaButton>
        <VaButton :style="buttonStyles" class="mb-4 md:mb-0" type="submit" @click="submit"> Update Password</VaButton>
      </div>
    </VaForm>
  </VaModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useForm, useToast } from 'vuestic-ui'
  import { buttonStyles } from '../styles'
  import axios from 'axios'

  const oldPassowrd = ref<string>()
  const newPassword = ref<string>()

  const oldPasswordErrors = ref<string[]>([])
  const newPasswordErrors = ref<string[]>([])

  const repeatNewPassword = ref<string>()

  const { validate } = useForm('form')
  const { init } = useToast()

  const emits = defineEmits(['cancel'])

  const submit = async () => {
    oldPasswordErrors.value = []
    newPasswordErrors.value = []

    if (validate()) {
      doPasswordReset()
    }
  }

  const oldPasswordRules = [(v: string) => !!v || 'Old password field is required']
  const newPasswordRules = [(v: string) => !!v || 'New password field is required']
  const repeatNewPasswordRules = [
    (v: string) => !!v || 'Repeat new password field is required',
    (v: string) => v === newPassword.value || 'Confirm password does not match new password',
  ]

  async function doPasswordReset() {
    const res = await axios.put(
      '/api/1.0/user/password',
      {
        oldPassword: oldPassowrd.value,
        newPassword: newPassword.value,
      },
      {
        validateStatus: () => true,
      },
    )

    if (res.status === 200) {
      init({ message: "You've successfully changed your password", color: 'success' })
      emits('cancel')
      return
    }

    const data = res.data as any
    if (typeof data === 'string') {
      if (data === 'invalid password') {
        oldPasswordErrors.value.push('Invalid password')
      }
    } else {
      data.errors.forEach((error: any) => {
        const property = error.instancePath.split('/')[1]
        switch (property) {
          case 'newPassword':
            newPasswordErrors.value = [error.message]
            break
        }
      })
    }
  }
</script>

<style lang="scss">
  .va-modal__inner {
    min-width: 326px;
  }
</style>

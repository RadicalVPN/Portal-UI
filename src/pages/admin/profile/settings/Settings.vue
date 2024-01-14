<template>
  <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">Name</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ store.user.username }}
      </div>
    </div>
    <VaButton :style="buttonStyles" class="w-fit h-fit" preset="primary" @click="emits('openNameModal')">
      Edit
    </VaButton>
  </div>
  <VaDivider />
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">Email</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ store.user.email }}
      </div>
    </div>
  </div>
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">Password</p>
    <div class="flex-1">
      <div class="max-w-[748px]">•••••••••••••</div>
    </div>
    <VaButton :style="buttonStyles" class="w-fit h-fit" preset="primary" @click="emits('openResetPasswordModal')">
      Reset Password
    </VaButton>
  </div>
  <VaDivider />
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">Two-factor authentication</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ twoFA.content }}
      </div>
    </div>
    <VaButton :style="buttonStyles" class="w-fit h-fit" :color="twoFA.color" @click="twoFA.open">
      {{ twoFA.button }}
    </VaButton>
  </div>
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">Passkeys</p>
    <div class="flex-1">
      <div class="max-w-[748px]">Manage your passkeys that are used for passwordless login</div>
    </div>
    <VaButton :style="buttonStyles" class="w-fit h-fit" color="primary" @click="emits('openPasskeysModal')">
      Manage passkeys
    </VaButton>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue'
  import { buttonStyles } from '../styles'
  import { useGlobalStore } from '../../../../stores/global-store'

  const store = useGlobalStore()

  const twoFA = computed(() => {
    if (store.user.totp) {
      return {
        color: 'danger',
        button: 'Disable 2FA',
        content:
          'Two-Factor Authentication (2FA) is now enabled for your account, adding an extra layer of security to your sign-ins.',
        open: () => emits('openDisableTotpModal'),
      }
    } else {
      return {
        color: 'primary',
        button: 'Set Up 2FA',
        content:
          'Add an extra layer of security to your account. To sign in, you’ll need to provide a code along with your username and password.',
        open: () => emits('openTotpModal'),
      }
    }
  })

  const emits = defineEmits([
    'openNameModal',
    'openResetPasswordModal',
    'openTotpModal',
    'openDisableTotpModal',
    'openPasskeysModal',
  ])
</script>

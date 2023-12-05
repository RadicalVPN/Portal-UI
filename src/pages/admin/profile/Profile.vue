<template>
  <h1 class="page-title">Profile</h1>
  <div class="flex flex-col p-4 space-y-10 bg-backgroundSecondary rounded-lg">
    <div class="flex space-x-5">
      <ProfileHeader />
    </div>
    <div class="space-y-4 md:space-y-6">
      <Settings
        @openNameModal="isEditNameModalOpen = true"
        @openResetPasswordModal="isResetPasswordModalOpen = true"
        @openTotpModal="isTotpSetupModalOpen = true"
        @openDisableTotpModal="isTotpDisableModalOpen = true"
      />
    </div>
  </div>
  <EditNameModal v-if="isEditNameModalOpen" @cancel="isEditNameModalOpen = false" />
  <ResetPasswordModal v-if="isResetPasswordModalOpen" @cancel="isResetPasswordModalOpen = false" />
  <SetupTotpModal v-if="isTotpSetupModalOpen" @cancel="isTotpSetupModalOpen = false" />
  <DisableTotpModal v-if="isTotpDisableModalOpen" @cancel="isTotpDisableModalOpen = false" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue'

  import ProfileHeader from './header/ProfileHeader.vue'
  import Settings from './settings/Settings.vue'
  import EditNameModal from './modals/EditNameModal.vue'
  import ResetPasswordModal from './modals/ResetPasswordModal.vue'
  import SetupTotpModal from './modals/SetupTotpModal.vue'
  import DisableTotpModal from './modals/DisableTotpModal.vue'

  const isEditNameModalOpen = ref(false)
  const isResetPasswordModalOpen = ref(false)
  const isTotpSetupModalOpen = ref(false)
  const isTotpDisableModalOpen = ref(false)
</script>

<template>
  <va-card class="horizontal-bars">
    <va-card-title style="font-size: 0.875rem">TOTP</va-card-title>

    <va-card-content class="my-3 gap-6">
      <p class="text-sm leading-6 mb-8">
        TOTP (Time-Based One-Time Password) is a two-factor authentication method that enhances account security by
        requiring a time-sensitive code in addition to a password. This code changes at regular intervals, making it
        significantly more challenging for unauthorized users to gain access, even if they have the password.
      </p>
      <va-button>Start TOTP Setup</va-button>

      <va-input :v-model="currentPassword"></va-input>
    </va-card-content>
  </va-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const currentPassword = ref('')
</script>

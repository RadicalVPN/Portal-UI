<template>
  <div v-if="routeName === 'login'" class="flex justify-center col-span-12 p-4">
    <va-card class="auth-layout__card">
      <va-card-content class="flex justify-center">
        <span class="ml-1 va-link">{{ t('auth.loginPasskey') }}</span>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { computed } from 'vue'

  const router = useRouter()
  const { t } = useI18n()

  const routeName = computed(() => {
    return router.currentRoute.value.name
  })
</script>

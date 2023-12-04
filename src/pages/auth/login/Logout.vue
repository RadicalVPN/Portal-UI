<template>Logout is being performed...</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { onMounted } from 'vue'

  const router = useRouter()

  onMounted(async () => {
    await fetch('/api/1.0/auth', {
      method: 'DELETE',
    })

    router.push('/auth/login')
  })
</script>

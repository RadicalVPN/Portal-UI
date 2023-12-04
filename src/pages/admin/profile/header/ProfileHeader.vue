<template>
  <VaAvatar
    size="large"
    color="warning"
    :src="`https://gravatar.com/avatar/${store.user.emailSha256}?d=retro`"
  ></VaAvatar>
  <div class="flex flex-col justify-center">
    <h2 class="text-[28px] md:text-[32px] leading-10 font-bold">{{ store.user.username }}</h2>
    <div class="flex space-x-1 text-[13px] leading-4">
      <p>Member since</p>
      <p>{{ 'N/A' }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useGlobalStore } from '../../../../stores/global-store'

  const store = useGlobalStore()
</script>

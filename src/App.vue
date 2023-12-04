<template>
  <RouterView />
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useColors } from 'vuestic-ui'
  import { useGlobalStore } from './stores/global-store'

  const { applyPreset } = useColors()
  const store = useGlobalStore()

  onMounted(() => {
    applyPreset(store.theme)
  })
</script>

<style lang="scss">
  @import 'scss/main.scss';

  #app {
    font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
  }
</style>

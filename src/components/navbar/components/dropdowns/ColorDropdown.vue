<template>
  <va-switch v-model="themeSwitch" size="small" @click="setTheme(themeSwitch ? 'light' : 'dark')">
    <template #innerLabel>
      <div class="va-text-center">
        <va-icon size="small" :name="themeSwitch ? 'light_mode' : 'dark_mode'" />
      </div>
    </template>
  </va-switch>
</template>

<script setup lang="ts">
  import { useColors } from 'vuestic-ui'
  import { ref, watchEffect } from 'vue'

  const { applyPreset } = useColors()

  const themeSwitch = ref()
  const currentTheme = ref(localStorage.getItem('theme') || 'light')

  watchEffect(() => {
    setTheme(currentTheme.value)
  })

  function setTheme(theme: string) {
    localStorage.setItem('theme', theme)
    themeSwitch.value = theme === 'light'
    applyPreset(theme)
  }
</script>

<style lang="scss" scoped>
  .color-dropdown {
    &__icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .va-dropdown__anchor {
      display: inline-block;
    }

    &__toggle {
      width: 100%;
      display: flex;
      justify-content: stretch;
    }
  }

  .button-restore {
    display: flex;
    margin: 0.375rem auto;
  }
</style>

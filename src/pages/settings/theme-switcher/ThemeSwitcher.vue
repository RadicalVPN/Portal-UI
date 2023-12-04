<template>
  <VaButtonSelect
    v-model="theme"
    :options="options"
    button-size="108px"
    selected-color="backgroundSecondary"
    background-color="backgroundElement"
  />
</template>
<script lang="ts" setup>
  import VaButtonSelect from '../../../components/va-button-select/VaButtonSelect.vue'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useColors } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'

  const { applyPreset, currentPresetName } = useColors()
  const store = useGlobalStore()

  const theme = computed({
    get() {
      return currentPresetName.value
    },
    set(value) {
      store.theme = value
      applyPreset(value)
    },
  })

  const { t } = useI18n()

  const options = [
    { name: t('themeSwitcher.dark'), value: 'dark' },
    { name: t('themeSwitcher.light'), value: 'light' },
  ]
</script>

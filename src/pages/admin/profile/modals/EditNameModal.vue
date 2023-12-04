<template>
  <VaModal :mobile-fullscreen="false" hide-default-actions model-value @update:modelValue="emits('cancel')">
    <VaForm ref="form" @submit.prevent="submit">
      <VaInput v-model="Name" class="mb-4" label="Name" placeholder="Name" />
      <div class="flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-4">
        <VaButton :style="buttonStyles" preset="plain" @click="emits('cancel')"> Cancel</VaButton>
        <VaButton :style="buttonStyles" class="mb-4 md:mb-0" type="submit" @click="submit"> Save</VaButton>
      </div>
    </VaForm>
  </VaModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'

  import { buttonStyles } from '../styles'
  import { useToast } from 'vuestic-ui/web-components'
  import { useGlobalStore } from '../../../../stores/global-store'

  const store = useGlobalStore()

  const { init } = useToast()

  const emits = defineEmits(['cancel'])

  const Name = ref<string>(store.user.username)

  const submit = () => {
    if (!Name.value || Name.value === store.user.username) {
      return emits('cancel')
    }

    store.changeUserName(Name.value)
    init({ message: "You've successfully changed your name", color: 'success' })
    emits('cancel')
  }
</script>

<style lang="scss">
  .va-modal__inner {
    min-width: 326px;
  }
</style>
<template>
  <VaModal
    :mobile-fullscreen="false"
    hide-default-actions
    close-button
    model-value
    @update:model-value="emits('cancel')"
  >
    <h3 class="va-h3">Passkeys</h3>
    <p>
      Passkeys are a password replacement that validates your identity using touch, facial recognition, a device
      password, or a PIN.
    </p>

    <VaDataTable class="table-crud mt-6" :items="passkeys" :columns="columns">
      <template #cell(actions)="{}">
        <VaButton preset="plain" icon="delete" class="ml-3" />
      </template>
    </VaDataTable>
  </VaModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { useGlobalStore } from '../../../../stores/global-store'

  //const store = useGlobalStore()
  const emits = defineEmits(['cancel'])

  const passkeys = ref([
    {
      name: 'Yubikey',
      lastUsed: '2021-08-01 12:00:00',
    },
  ])

  const columns = [
    { key: 'name', sortable: true },
    { key: 'lastUsed', sortable: true },
    { key: 'actions', width: 60 },
  ]
</script>

<style lang="scss">
  .va-modal__inner {
    min-width: 326px;
  }
</style>

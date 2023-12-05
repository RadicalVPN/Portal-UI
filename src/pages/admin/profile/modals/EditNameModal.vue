<template>
  <VaModal :mobile-fullscreen="false" hide-default-actions model-value @update:model-value="emits('cancel')">
    <VaForm ref="form" @submit.prevent="submit">
      <VaInput
        v-model="name"
        class="mb-4"
        label="Name"
        placeholder="Name"
        :error="!!nameErrors.length"
        :error-messages="nameErrors"
      />
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

  const name = ref<string>(store.user.username)
  const nameErrors = ref<string[]>([])

  const submit = async () => {
    nameErrors.value = []

    if (!name.value || name.value === store.user.username) {
      return emits('cancel')
    }

    try {
      const res = await fetch('/api/1.0/user/username', {
        method: 'PUT',
        body: JSON.stringify({
          username: name.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status !== 200) {
        if (res.headers.get('Content-Type') === 'application/json; charset=utf-8') {
          const data = await res.json()
          data.errors.forEach((error: any) => {
            const property = error.instancePath.split('/')[1]
            console.log(property)
            switch (property) {
              case 'username':
                nameErrors.value = [error.message]
                break
            }
          })
        } else {
          const data = await res.text()
          nameErrors.value.push(data)
        }

        return
      }
    } catch (e: any) {
      nameErrors.value.push(e.message)
      return
    }

    store.changeUserName(name.value)
    init({ message: "You've successfully changed your name", color: 'success' })
    emits('cancel')
  }
</script>

<style lang="scss">
  .va-modal__inner {
    min-width: 326px;
  }
</style>

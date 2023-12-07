<template>
  <vue-turnstile v-if="siteKey" ref="turnstileRef" v-model="tokenModel" :site-key="siteKey" />
  <va-skeleton v-else class="w-2/3" />
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import VueTurnstile from 'vue-turnstile'
  import axios from 'axios'

  const turnstileRef = ref<typeof VueTurnstile.methods>()
  let siteKey = ref<string>('')

  const props = defineProps({
    modelValue: { type: String, required: true },
  })

  const emit = defineEmits(['update:modelValue', 'resetTurnstile'])

  const tokenModel = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })

  const reset = function reset() {
    turnstileRef.value?.reset()
  }

  defineExpose({ reset })

  onMounted(async () => {
    siteKey.value = (await axios.get('/api/1.0/configuration/cloudflare/turnstile')).data.siteKey
  })
</script>

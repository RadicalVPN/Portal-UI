<template>
  <vue-turnstile v-if="siteKey" v-model="tokenModel" :site-key="siteKey" />
  <va-skeleton v-else class="w-2/3" />
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import VueTurnstile from 'vue-turnstile'
  import axios from 'axios'

  const props = defineProps({
    modelValue: { type: String, required: true },
  })
  const emit = defineEmits(['update:modelValue'])

  const tokenModel = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })

  let siteKey = ref<string>('')
  onMounted(async () => {
    siteKey.value = (await axios.get('/api/1.0/configuration/cloudflare/turnstile')).data.siteKey
  })
</script>

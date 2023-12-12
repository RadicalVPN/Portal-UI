<template>
  <div v-if="isInvalidClient" class="text-center">
    <a class="font-bold">Invalid Client</a>
    <p>Sorry, the OAuth2 client you are trying to use is invalid.</p>
  </div>
  <div v-else>
    <va-form method="post" action="/api/1.0/oauth2/authorize" tag="form">
      <input
        v-for="([key, value], index) in Object.entries(route.query)"
        :id="key"
        :key="index"
        type="hidden"
        :name="key"
        :value="value"
      />

      <div class="flex flex-col items-center justify-center">
        <a class="font-bold text-xl">Authorize {{ clientName }}</a>

        <a class="mt-6"
          ><b>{{ clientName }}</b> wants to access your <b>{{ store.user.username }}</b> account</a
        >

        <p class="mt-4">Would you like to authorize this application to access your account?</p>

        <div class="flex items-center justify-center mt-4">
          <va-button color="secondary" @click="router.push({ name: 'dashboard' })">{{ 'Cancel' }}</va-button>
          <va-button type="submit" color="success" class="ml-4">{{ 'Authorize ' + clientName }}</va-button>
        </div>
      </div>
    </va-form>
  </div>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import axios from 'axios'
  import { useGlobalStore } from '../../../stores/global-store'

  const route = useRoute()
  const router = useRouter()
  const store = useGlobalStore()

  const clientId = route.query.client_id
  const clientName = ref('N/A')

  const isInvalidClient = ref(false)

  onMounted(async () => {
    const clientData = await axios.get(`/api/1.0/oauth2/client/${clientId}`, {
      validateStatus: () => true,
    })

    if (clientData.status !== 200) {
      isInvalidClient.value = true
    }

    clientName.value = clientData.data.clientName
  })
</script>

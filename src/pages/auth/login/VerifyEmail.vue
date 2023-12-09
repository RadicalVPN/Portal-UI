<template>
  <div class="flex justify-center">
    <va-icon size="3rem" class="flex justify-center" name="fa-envelope" />
  </div>

  <div class="text-center mt-4">
    <p class="text-base mb-4 leading-5">We have sent a confirmation email to your email address.</p>

    <p class="text-base mb-4 leading-5">Check your inbox, including the spam folder if needed.</p>
  </div>

  <div class="flex justify-center mt-4">
    <VaButton :to="{ name: 'login' }">Back to login</VaButton>
  </div>
</template>

<script setup lang="ts"></script>

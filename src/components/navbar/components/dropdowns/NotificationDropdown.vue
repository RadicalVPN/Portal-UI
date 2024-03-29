<template>
  <VaDropdown :offset="[13, 0]" class="notification-dropdown" stick-to-edges>
    <template #anchor>
      <VaButton preset="secondary" color="textPrimary">
        <VaBadge overlap>
          <template #text> 2+</template>
          <VaIconNotification class="notification-dropdown__icon" />
        </VaBadge>
      </VaButton>
    </template>
    <VaDropdownContent class="md:max-w-[420px] p-4 w-full">
      <VaList class="space-y-1 mb-2">
        <template v-for="item in notifications" :key="item.id">
          <VaListItem class="text-base cursor-pointer">
            <VaListItemSection icon class="mx-0 p-0">
              <VaIcon :name="item.icon" color="secondary" />
            </VaListItemSection>
            <VaListItemSection>
              {{ item.message }}
            </VaListItemSection>
            <VaListItemSection icon class="mx-1">
              {{ item.updateTimestamp }}
            </VaListItemSection>
          </VaListItem>
          <VaListSeparator v-if="item.separator" class="mx-3" />
        </template>
      </VaList>
      <VaButton preset="primary" class="w-full">{{ t('notifications.all') }}</VaButton>
    </VaDropdownContent>
  </VaDropdown>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import VaIconNotification from '../../../icons/VaIconNotification.vue'

  const { t, locale } = useI18n()

  const rtf = new Intl.RelativeTimeFormat(locale.value, { style: 'short' })

  interface INotification {
    message: string
    icon: string
    id: number
    separator?: boolean
    updateTimestamp: string
  }

  const notifications: INotification[] = [
    {
      message: '4 pending requests',
      icon: 'favorite_outline',
      id: 1,
      separator: true,
      updateTimestamp: rtf.format(-3, 'minutes').toString(),
    },
    {
      message: '3 new reports',
      icon: 'calendar_today',
      id: 2,
      separator: true,
      updateTimestamp: rtf.format(-12, 'hours').toString(),
    },
    {
      message: 'Whoops! Your trial period has expired.',
      icon: 'error_outline',
      id: 3,
      separator: true,
      updateTimestamp: rtf.format(-2, 'days').toString(),
    },
    {
      message: 'It looks like your timezone is set incorrectly, please change it to avoid issues with Memory.',
      icon: 'schedule',
      id: 4,
      updateTimestamp: rtf.format(-1, 'weeks').toString(),
    },
  ]
</script>

<style lang="scss" scoped>
  .notification-dropdown {
    cursor: pointer;

    .notification-dropdown__icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .va-dropdown__anchor {
      display: inline-block;
    }
  }
</style>

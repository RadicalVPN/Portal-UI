import { createI18n } from 'vue-i18n'

const fileNameToLocaleModuleDict = import.meta.glob('./locales/*.json', { eager: true })

const messages: { [P: string]: Record<string, any> } = {}
Object.entries(fileNameToLocaleModuleDict)
  .map(([fileName, localeModul]: [string, any]) => {
    const fileNameParts = fileName.split('/')
    const fileNameWithoutPath = fileNameParts[fileNameParts.length - 1]
    const localeName = fileNameWithoutPath.split('.json')[0]

    return [localeName, localeModul.default]
  })
  .forEach((localeNameLocaleMessagesTuple) => {
    messages[localeNameLocaleMessagesTuple[0]] = localeNameLocaleMessagesTuple[1]
  })

export default createI18n({
  legacy: false,
  locale: 'gb',
  fallbackLocale: 'gb',
  messages,
})

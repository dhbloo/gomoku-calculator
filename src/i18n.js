import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const LOCALES = ['zh-CN', 'zh-TW', 'en', 'ko', 'ja', 'vi', 'ru']

function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

function getDefaultLanguage() {
  // Iterate through the user's preferred languages
  for (const lang of navigator.languages) {
    if (LOCALES.includes(lang)) {
      return lang // Exact match
    }

    // Check for partial match (e.g., "en-US" matching "en")
    const baseLang = lang.split('-')[0]
    if (LOCALES.includes(baseLang)) {
      return baseLang
    }
  }

  // Default to English if no match is found
  return 'en'
}

export default new VueI18n({
  locale: getDefaultLanguage(),
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
})

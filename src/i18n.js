import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const LOCALES = ['zh', 'en']

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
  for (const locale of LOCALES) {
    for (let lang of navigator.languages) {
      if (lang.indexOf(locale) > -1) return locale
    }
  }

  return 'en'
}

export default new VueI18n({
  locale: getDefaultLanguage(),
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
})

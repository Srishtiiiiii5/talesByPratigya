/**
 * i18next setup — powered by the existing translations.js strings.
 * Components continue to call t() from useLanguage() with no changes.
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translations from './utils/translations'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      hi: { translation: translations.hi },
      en: { translation: translations.en },
    },
    lng:          localStorage.getItem('tbp-lang') || 'hi',
    fallbackLng:  'en',
    interpolation: { escapeValue: false },
  })

export default i18n

import { createI18n } from 'vue-i18n'

// Import Japanese translations
import jaCommon from './ja/common.json'
import jaHome from './ja/home.json'
import jaAbout from './ja/about.json'
import jaComponents from './ja/components.json'

// Import English translations
import enCommon from './en/common.json'
import enHome from './en/home.json'
import enAbout from './en/about.json'
import enComponents from './en/components.json'

// Define message structure
const messages = {
  ja: {
    common: jaCommon,
    home: jaHome,
    about: jaAbout,
    components: jaComponents
  },
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    components: enComponents
  }
}

// Get browser language or default to Japanese
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.toLowerCase()
  const savedLang = localStorage.getItem('language')
  
  if (savedLang && ['ja', 'en'].includes(savedLang)) {
    return savedLang
  }
  
  if (browserLang.startsWith('ja')) {
    return 'ja'
  } else if (browserLang.startsWith('en')) {
    return 'en'
  }
  
  return 'ja' // Default to Japanese
}

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: getBrowserLanguage(),
  fallbackLocale: 'ja',
  messages,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})

export default i18n

// Export type for use in TypeScript
export type MessageSchema = typeof messages['ja']
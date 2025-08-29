import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import i18n from '@/locales'

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref<'ja' | 'en'>('ja')
  const availableLanguages = ref([
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ])

  // Get current language info
  const currentLanguageInfo = computed(() => {
    return availableLanguages.value.find(lang => lang.code === currentLanguage.value)
  })

  // Set language
  const setLanguage = (lang: 'ja' | 'en') => {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
    
    // Update HTML lang attribute
    document.documentElement.lang = lang
    
    // Update i18n locale using the imported instance
    try {
      i18n.global.locale.value = lang
    } catch (error) {
      console.error('Could not update i18n locale:', error)
    }
  }

  // Toggle between languages
  const toggleLanguage = () => {
    const newLang = currentLanguage.value === 'ja' ? 'en' : 'ja'
    setLanguage(newLang)
  }

  // Initialize language from localStorage or browser
  const initializeLanguage = () => {
    const savedLang = localStorage.getItem('language') as 'ja' | 'en' | null
    const browserLang = navigator.language.toLowerCase()
    
    let initialLang: 'ja' | 'en' = 'ja' // Default to Japanese
    
    if (savedLang && ['ja', 'en'].includes(savedLang)) {
      initialLang = savedLang
    } else if (browserLang.startsWith('en')) {
      initialLang = 'en'
    }
    
    setLanguage(initialLang)
  }

  // Format date based on current language
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: currentLanguage.value === 'ja' ? 'long' : 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    return new Intl.DateTimeFormat(
      currentLanguage.value === 'ja' ? 'ja-JP' : 'en-US',
      options
    ).format(d)
  }

  // Format number based on current language
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(
      currentLanguage.value === 'ja' ? 'ja-JP' : 'en-US'
    ).format(num)
  }

  return {
    currentLanguage,
    availableLanguages,
    currentLanguageInfo,
    setLanguage,
    toggleLanguage,
    initializeLanguage,
    formatDate,
    formatNumber
  }
})
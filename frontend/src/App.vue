<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <router-link 
            to="/" 
            class="text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
          >
            {{ t('common.app.name') }}
          </router-link>
          
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 dark:text-blue-400"
              exact-active-class="text-blue-600 dark:text-blue-400"
            >
              {{ t('common.nav.analyze') }}
            </router-link>
            <router-link 
              to="/about" 
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 dark:text-blue-400"
            >
              {{ t('common.nav.about') }}
            </router-link>
            
            <!-- Language Switcher -->
            <div class="relative">
              <button
                @click="toggleLanguageMenu"
                class="flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-w-[50px]"
                aria-label="Change language"
              >
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ languageStore.currentLanguageInfo?.code?.toUpperCase() || 'JA' }}
                </span>
              </button>
              
              <!-- Language Dropdown Menu -->
              <div
                v-show="showLanguageMenu"
                @click.stop
                class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div
                  v-for="lang in languageStore.availableLanguages"
                  :key="lang.code"
                  @click.stop="handleLanguageChange(lang.code as 'ja' | 'en')"
                  @mousedown.stop
                  class="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  :class="{ 'bg-blue-50 dark:bg-blue-900/20': lang.code === languageStore.currentLanguage }"
                >
                  <span>{{ lang.name }}</span>
                  <span class="text-xs font-mono text-gray-500 dark:text-gray-400">{{ lang.code.toUpperCase() }}</span>
                </div>
              </div>
            </div>
            
            <!-- Dark Mode Toggle -->
            <button
              @click="appStore.toggleDarkMode()"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Toggle dark mode"
            >
              <Sun v-if="appStore.isDarkMode" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useAppStore } from '@/stores/appStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useI18n } from 'vue-i18n'

const appStore = useAppStore()
const languageStore = useLanguageStore()
const { t, locale } = useI18n()
const showLanguageMenu = ref(false)

// Toggle language menu
const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
}

// Handle language change
const handleLanguageChange = (langCode: 'ja' | 'en') => {
  languageStore.setLanguage(langCode)
  locale.value = langCode
  showLanguageMenu.value = false
}

// Close language menu when clicking outside
const closeLanguageMenu = (event: Event) => {
  const target = event.target as HTMLElement
  const languageButton = document.querySelector('[aria-label="Change language"]')
  const languageMenu = document.querySelector('.absolute.right-0.mt-2')
  
  // Don't close if clicking on language button or menu
  if (languageButton?.contains(target) || languageMenu?.contains(target)) {
    return
  }
  
  if (showLanguageMenu.value) {
    showLanguageMenu.value = false
  }
}

// Watch for language store changes and sync with i18n
watch(() => languageStore.currentLanguage, (newLang) => {
  locale.value = newLang
}, { immediate: true })

onMounted(() => {
  // Initialize language store
  languageStore.initializeLanguage()
  
  // Add click outside listener
  document.addEventListener('click', closeLanguageMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeLanguageMenu)
})
</script>
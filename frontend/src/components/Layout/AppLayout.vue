<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Navigation -->
          <div class="flex items-center space-x-8">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold gradient-text">TextSummarizer</span>
            </router-link>
            
            <nav class="hidden md:flex space-x-6">
              <router-link 
                to="/" 
                class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'Home' }"
              >
                Analyze
              </router-link>
              <router-link 
                to="/about" 
                class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'About' }"
              >
                About
              </router-link>
            </nav>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <!-- API Status -->
            <div class="flex items-center space-x-2">
              <div 
                class="w-2 h-2 rounded-full transition-colors"
                :class="apiStatus === 'online' ? 'bg-green-500' : apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                API {{ apiStatus }}
              </span>
            </div>
            
            <!-- Dark Mode Toggle -->
            <button
              @click="appStore.toggleDarkMode()"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              <Moon v-if="!appStore.isDarkMode" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <Sun v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
              <X v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <!-- Mobile Navigation -->
        <div v-show="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <nav class="flex flex-col space-y-2">
            <router-link 
              to="/" 
              @click="mobileMenuOpen = false"
              class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'Home' }"
            >
              Analyze
            </router-link>
            <router-link 
              to="/about" 
              @click="mobileMenuOpen = false"
              class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'About' }"
            >
              About
            </router-link>
          </nav>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            © 2024 TextSummarizer. Built with Vue.js & AI.
          </div>
          <div class="flex items-center space-x-6">
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy
            </a>
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Terms
            </a>
            <a href="#" class="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FileText, Moon, Sun, Menu, X } from 'lucide-vue-next'
import { useAppStore } from '@/stores/appStore'
import axios from 'axios'

const appStore = useAppStore()
const mobileMenuOpen = ref(false)
const apiStatus = ref<'online' | 'offline' | 'checking'>('checking')

let statusCheckInterval: number

const checkApiStatus = async () => {
  try {
    await axios.get('http://localhost:3001/api/text/services/status', { timeout: 5000 })
    apiStatus.value = 'online'
  } catch {
    apiStatus.value = 'offline'
  }
}

onMounted(() => {
  checkApiStatus()
  statusCheckInterval = window.setInterval(checkApiStatus, 30000) // Check every 30 seconds
})

onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
  }
})
</script>
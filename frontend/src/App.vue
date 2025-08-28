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
            TextSummarizer
          </router-link>
          
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 dark:text-blue-400"
              exact-active-class="text-blue-600 dark:text-blue-400"
            >
              Home
            </router-link>
            <router-link 
              to="/about" 
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 dark:text-blue-400"
            >
              About
            </router-link>
            
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
import { Sun, Moon } from 'lucide-vue-next'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
</script>
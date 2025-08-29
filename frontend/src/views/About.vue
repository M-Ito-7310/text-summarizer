<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-6">
          {{ t('about.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed whitespace-pre-line">
          {{ t('about.hero.subtitle') }}
        </p>
      </div>
      
      <!-- Overview Section -->
      <div class="card p-8 mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Sparkles class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          {{ t('about.overview.title') }}
        </h2>
        
        <div class="prose dark:prose-invert max-w-none">
          <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
            {{ t('about.overview.description') }}
          </p>
          
          <div class="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {{ t('about.overview.summarization.title') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ t('about.overview.summarization.description') }}
              </p>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {{ t('about.overview.keywords.title') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ t('about.overview.keywords.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Technology Stack -->
      <div class="card p-8 mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Code class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
          {{ t('about.technology.title') }}
        </h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Frontend -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('about.technology.frontend') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span class="text-green-600 dark:text-green-400 font-bold text-sm">V</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Vue.js 3</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.vue.description') }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 font-bold text-sm">T</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">TypeScript</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.typescript.description') }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
                  <span class="text-cyan-600 dark:text-cyan-400 font-bold text-sm">T</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Tailwind CSS</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.tailwind.description') }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Backend -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('about.technology.backend') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span class="text-green-600 dark:text-green-400 font-bold text-sm">N</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Node.js</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.nodejs.description') }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span class="text-gray-600 dark:text-gray-400 font-bold text-sm">E</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Express.js</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.express.description') }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 font-bold text-sm">S</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">SQLite</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.sqlite.description') }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- AI/ML -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('about.technology.aiIntegration') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span class="text-purple-600 dark:text-purple-400 font-bold text-sm">G</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Google Gemini</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.gemini.description') }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <span class="text-yellow-600 dark:text-yellow-400 font-bold text-sm">H</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Hugging Face</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.huggingface.description') }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <span class="text-red-600 dark:text-red-400 font-bold text-sm">A</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">AI Coordination</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ t('about.technology.aiCoordination.description') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Features -->
      <div class="card p-8 mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Star class="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" />
          {{ t('about.features.title') }}
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Zap class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {{ t('about.features.summaryLengths.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('about.features.summaryLengths.description') }}
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Upload class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {{ t('about.features.fileSupport.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('about.features.fileSupport.description') }}
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Moon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {{ t('about.features.darkMode.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('about.features.darkMode.description') }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Download class="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {{ t('about.features.exportShare.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('about.features.exportShare.description') }}
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <Clock class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {{ t('about.features.history.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('about.features.history.description') }}
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <Shield class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {{ t('about.features.privacy.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('about.features.privacy.description') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- API Information -->
      <div class="card p-8 mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <Globe class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          {{ t('about.api.title') }}
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {{ t('about.api.endpoints.title') }}
            </h3>
            <div class="space-y-3 font-mono text-sm">
              <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <span class="text-green-600 dark:text-green-400 font-semibold">POST</span>
                <span class="text-gray-600 dark:text-gray-400 ml-2">/api/text/summarize</span>
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <span class="text-green-600 dark:text-green-400 font-semibold">POST</span>
                <span class="text-gray-600 dark:text-gray-400 ml-2">/api/text/keywords</span>
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <span class="text-green-600 dark:text-green-400 font-semibold">POST</span>
                <span class="text-gray-600 dark:text-gray-400 ml-2">/api/text/analyze</span>
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <span class="text-green-600 dark:text-green-400 font-semibold">POST</span>
                <span class="text-gray-600 dark:text-gray-400 ml-2">/api/files/upload</span>
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <span class="text-green-600 dark:text-green-400 font-semibold">POST</span>
                <span class="text-gray-600 dark:text-gray-400 ml-2">/api/files/analyze</span>
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <span class="text-blue-600 dark:text-blue-400 font-semibold">GET</span>
                <span class="text-gray-600 dark:text-gray-400 ml-2">/health</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {{ t('about.api.performance.title') }}
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('about.api.performance.responseTime') }}</span>
                <span class="font-semibold text-gray-900 dark:text-gray-100">~2-5 seconds</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('about.api.performance.maxFileSize') }}</span>
                <span class="font-semibold text-gray-900 dark:text-gray-100">5 MB</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('about.api.performance.supportedFormats') }}</span>
                <span class="font-semibold text-gray-900 dark:text-gray-100">TXT, PDF, DOCX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Call to Action -->
      <div class="text-center">
        <div class="card p-12">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ t('about.cta.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {{ t('about.cta.description') }}
          </p>
          <router-link to="/" class="btn-primary">
            {{ t('about.cta.button') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Sparkles, Code, Star, Zap, Upload, Moon, Download, 
  Clock, Shield, Globe
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-4">
          AI-Powered Text Analysis
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Extract key insights from your text with advanced summarization and keyword extraction powered by state-of-the-art AI models.
        </p>
      </div>
      
      <!-- Error Alert -->
      <ErrorAlert
        v-if="appStore.error"
        :show="!!appStore.error"
        :message="appStore.error"
        type="error"
        title="Analysis Error"
        @close="appStore.clearError()"
      />
      
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Input -->
        <div class="lg:col-span-2 space-y-8">
          <TextInput />
          
          <!-- Results -->
          <ResultDisplay :result="appStore.currentResult" />
          
          <!-- Features Overview -->
          <div v-if="!appStore.currentResult" class="card p-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Powerful Features
            </h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Zap class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Smart Summarization
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Generate concise, accurate summaries that capture the essence of your text using advanced AI models.
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Tag class="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Keyword Extraction
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Automatically identify the most important terms and concepts from your content.
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <FileText class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    File Support
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Upload and analyze TXT files directly without manual copying.
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Clock class="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    History & Export
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Keep track of your analyses and export results as PDF or share them easily.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- CTA -->
            <div class="mt-8 text-center">
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Ready to get started? Enter your text above or upload a file to begin.
              </p>
              <div class="flex justify-center space-x-4">
                <button
                  @click="scrollToInput"
                  class="btn-primary"
                >
                  Try It Now
                </button>
                <router-link to="/about" class="btn-secondary">
                  Learn More
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column: History -->
        <div class="lg:col-span-1">
          <HistoryPanel @item-selected="handleHistoryItemSelected" />
          
          <!-- Tips Card -->
          <div class="card p-6 mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Lightbulb class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              Pro Tips
            </h3>
            
            <div class="space-y-3 text-sm">
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p class="text-gray-600 dark:text-gray-400">
                  For best results, provide text with at least 100 words for meaningful summarization.
                </p>
              </div>
              
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p class="text-gray-600 dark:text-gray-400">
                  Use the "Medium" length setting for balanced summaries that capture key details.
                </p>
              </div>
              
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <p class="text-gray-600 dark:text-gray-400">
                  Upload TXT files directly instead of copying and pasting large documents.
                </p>
              </div>
              
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <p class="text-gray-600 dark:text-gray-400">
                  Your analysis history is saved locally and persists between sessions.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Stats Card -->
          <div class="card p-6 mt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <BarChart3 class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              Your Activity
            </h3>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Total Analyses</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ appStore.analysisHistory.length }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Words Processed</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ totalWordsProcessed.toLocaleString() }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Keywords Found</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ totalKeywords }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer Info -->
      <div class="mt-16 text-center">
        <div class="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
          <Shield class="w-4 h-4" />
          <span>Your data is processed securely and not stored on our servers</span>
        </div>
      </div>
    </div>
    
    <!-- Loading Overlay -->
    <LoadingSpinner
      :show="appStore.processingStatus.isLoading"
      size="lg"
      variant="gradient"
      :text="appStore.processingStatus.currentStep"
      subtext="Please wait while we analyze your text..."
      fullscreen
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { 
  Zap, Tag, FileText, Clock, Lightbulb, BarChart3, Shield
} from 'lucide-vue-next'
import { useAppStore, type AnalysisResult } from '@/stores/appStore'
import TextInput from '@/components/Input/TextInput.vue'
import ResultDisplay from '@/components/Results/ResultDisplay.vue'
import HistoryPanel from '@/components/History/HistoryPanel.vue'
import ErrorAlert from '@/components/UI/ErrorAlert.vue'
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'

const appStore = useAppStore()

const totalWordsProcessed = computed(() => {
  return appStore.analysisHistory.reduce((total, item) => {
    const wordCount = item.text.trim() ? item.text.trim().split(/\s+/).length : 0
    return total + wordCount
  }, 0)
})

const totalKeywords = computed(() => {
  return appStore.analysisHistory.reduce((total, item) => {
    return total + item.keywords.length
  }, 0)
})

const scrollToInput = () => {
  const element = document.querySelector('textarea')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.focus()
  }
}

const handleHistoryItemSelected = (item: AnalysisResult) => {
  appStore.currentResult = item
}

onMounted(() => {
  appStore.initializeDarkMode()
  appStore.loadHistoryFromStorage()
})
</script>
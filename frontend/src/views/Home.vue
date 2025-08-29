<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-5xl md:text-6xl font-bold gradient-text mb-6 animate-slide-up">
          {{ t('home.hero.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up whitespace-pre-line" style="animation-delay: 0.2s;">
          {{ t('home.hero.subtitle') }}
        </p>
        
        <!-- Features badges -->
        <div class="flex justify-center items-center space-x-3 mt-6 animate-slide-up" style="animation-delay: 0.4s;">
          <span class="tag-success">
            <FileText class="w-4 h-4 mr-1" />
            {{ t('home.hero.badges.fileSupport') }}
          </span>
          <span class="tag">
            <Zap class="w-4 h-4 mr-1" />
            {{ t('home.hero.badges.aiPowered') }}
          </span>
          <span class="tag-warning">
            <Shield class="w-4 h-4 mr-1" />
            {{ t('home.hero.badges.secure') }}
          </span>
        </div>
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
          <!-- Input Options Tabs -->
          <div class="card">
            <div class="flex border-b border-gray-200 dark:border-gray-700">
              <button
                @click="inputMode = 'file'"
                :class="[
                  'px-6 py-4 font-medium text-sm border-b-2 transition-colors duration-200',
                  inputMode === 'file' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                ]"
              >
                {{ t('home.tabs.fileUpload') }}
              </button>
              <button
                @click="inputMode = 'text'"
                :class="[
                  'px-6 py-4 font-medium text-sm border-b-2 transition-colors duration-200',
                  inputMode === 'text' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                ]"
              >
                {{ t('home.tabs.textInput') }}
              </button>
            </div>
          </div>
          
          
          <!-- Text Input -->
          <TextInput v-if="inputMode === 'text'" />
          
          <!-- File Upload -->
          <FileUpload 
            v-if="inputMode === 'file'"
            @text-extracted="handleTextExtracted"
            @file-uploaded="handleFileUploaded"
          />
          
          
          <!-- Results -->
          <ResultDisplay :result="appStore.currentResult" />
          
          <!-- Features Overview -->
          <div v-if="!appStore.currentResult" class="card p-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
              {{ t('home.features.title') }}
            </h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Zap class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {{ t('home.features.summarization.title') }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    {{ t('home.features.summarization.description') }}
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Tag class="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {{ t('home.features.keywords.title') }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    {{ t('home.features.keywords.description') }}
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <FileText class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {{ t('home.features.fileSupport.title') }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    {{ t('home.features.fileSupport.description') }}
                  </p>
                </div>
              </div>
              
              <div class="flex space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Clock class="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {{ t('home.features.history.title') }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    {{ t('home.features.history.description') }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- CTA -->
            <div class="mt-8 text-center">
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ t('home.features.cta.text') }}
              </p>
              <div class="flex justify-center">
                <router-link to="/about" class="btn-secondary">
                  {{ t('common.buttons.learnMore') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column: Activity, History, Pro Tips -->
        <div class="lg:col-span-1">
          <!-- Stats Card (Activity) -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <BarChart3 class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              {{ t('home.activity.title') }}
            </h3>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('home.activity.totalAnalyses') }}</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ appStore.analysisHistory.length }}
                </span>
              </div>
              
              <!-- Japanese Summaries -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('home.activity.japaneseSummaries') }}</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ appStore.japaneseAnalysesCount }}
                </span>
              </div>
              
              <!-- Japanese Sentences Processed -->
              <div v-if="appStore.japaneseAnalysesCount > 0" class="flex justify-between items-center pl-4">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('home.activity.sentencesProcessed') }}</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ appStore.japaneseSentencesProcessed.toLocaleString() }}
                </span>
              </div>
              
              <!-- English Summaries -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('home.activity.englishSummaries') }}</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ appStore.englishAnalysesCount }}
                </span>
              </div>
              
              <!-- English Words Processed -->
              <div v-if="appStore.englishAnalysesCount > 0" class="flex justify-between items-center pl-4">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('home.activity.wordsProcessedEn') }}</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ appStore.englishWordsProcessed.toLocaleString() }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('home.activity.keywordsFound') }}</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ totalKeywords }}
                </span>
              </div>
            </div>
          </div>

          <!-- History Panel -->
          <div class="mt-8">
            <HistoryPanel @item-selected="handleHistoryItemSelected" />
          </div>
          
          <!-- Tips Card -->
          <div class="card p-6 mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Lightbulb class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              {{ t('home.tips.title') }}
            </h3>
            
            <div class="space-y-3 text-sm">
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p class="text-gray-600 dark:text-gray-400">
                  {{ t('home.tips.tip1') }}
                </p>
              </div>
              
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p class="text-gray-600 dark:text-gray-400">
                  {{ t('home.tips.tip2') }}
                </p>
              </div>
              
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <p class="text-gray-600 dark:text-gray-400">
                  {{ t('home.tips.tip3') }}
                </p>
              </div>
              
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <p class="text-gray-600 dark:text-gray-400">
                  {{ t('home.tips.tip4') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer Info -->
      <div class="mt-16 text-center">
        <div class="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
          <Shield class="w-4 h-4" />
          <span>{{ t('home.privacy.message') }}</span>
        </div>
      </div>
    </div>
    
    <!-- Loading Overlay -->
    <LoadingSpinner
      :show="appStore.processingStatus.isLoading"
      size="lg"
      variant="gradient"
      :text="appStore.processingStatus.currentStep"
      :subtext="t('common.status.analyzing')"
      fullscreen
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { 
  Zap, Tag, FileText, Clock, Lightbulb, BarChart3, Shield
} from 'lucide-vue-next'
import { useAppStore, type AnalysisResult } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'
import TextInput from '@/components/Input/TextInput.vue'
import FileUpload from '@/components/Input/FileUpload.vue'
import ResultDisplay from '@/components/Results/ResultDisplay.vue'
import HistoryPanel from '@/components/History/HistoryPanel.vue'
import ErrorAlert from '@/components/UI/ErrorAlert.vue'
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'

const appStore = useAppStore()
const { t } = useI18n()
const inputMode = ref<'text' | 'file'>('file')

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

const handleTextExtracted = (text: string) => {
  // Switch to text input mode to show the extracted text
  inputMode.value = 'text'
  appStore.setText(text)
  
  // Automatically scroll to results
  setTimeout(() => {
    const resultsElement = document.querySelector('[data-results]')
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

const handleFileUploaded = (fileData: any) => {
  console.log('File uploaded successfully:', fileData)
  // Additional file upload handling if needed
}

onMounted(() => {
  appStore.initializeDarkMode()
  appStore.loadHistoryFromStorage()
})
</script>
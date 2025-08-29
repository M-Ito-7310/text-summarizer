<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ t('home.input.title') }}
      </h2>
      
      <!-- Summary Length Selector -->
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('home.input.lengthLabel') }}</span>
        <select 
          v-model="appStore.summaryLength"
          class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="short">{{ t('home.input.lengthOptions.short') }}</option>
          <option value="medium">{{ t('home.input.lengthOptions.medium') }}</option>
          <option value="long">{{ t('home.input.lengthOptions.long') }}</option>
        </select>
      </div>
    </div>
    
    <!-- Text Input -->
    <div class="space-y-4">
      <div>
        <textarea
          v-model="appStore.currentText"
          @input="handleTextInput"
:placeholder="t('home.input.placeholder')"
          class="input-field min-h-[200px]"
          :disabled="appStore.processingStatus.isLoading"
        />
        
        <!-- Character/Word Count -->
        <div class="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex space-x-4">
            <span>{{ appStore.characterCount.toLocaleString() }} {{ t('common.common.characters') }}</span>
            <span>{{ appStore.wordCount.toLocaleString() }} {{ /[\\u3040-\\u309f\\u30a0-\\u30ff\\u4e00-\\u9faf]/.test(appStore.currentText) ? t('common.common.sentences') : t('common.common.words') }}</span>
          </div>
          <div v-if="appStore.characterCount > 10000" class="text-amber-600 dark:text-amber-400">
            {{ t('home.input.warnings.longText') }}
          </div>
        </div>
      </div>
      
      <!-- Sample Text Button -->
      <button
        @click="loadSampleText"
        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        :disabled="appStore.processingStatus.isLoading"
      >
        {{ t('common.buttons.loadSample') }}
      </button>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex space-x-3 mt-6">
      <button
        @click="handleAnalyze"
        :disabled="!canAnalyze || appStore.processingStatus.isLoading"
        class="btn-primary flex-1 flex items-center justify-center space-x-2"
        :class="{ 'opacity-50 cursor-not-allowed': !canAnalyze || appStore.processingStatus.isLoading }"
      >
        <Sparkles class="w-4 h-4" />
        <span>{{ appStore.processingStatus.isLoading ? t('common.status.analyzing') : t('common.buttons.analyze') }}</span>
      </button>
      
      <button
        @click="handleClear"
        :disabled="appStore.processingStatus.isLoading"
        class="btn-secondary"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Processing Status -->
    <div v-if="appStore.processingStatus.isLoading" class="mt-4 space-y-3">
      <div class="flex justify-between items-center text-sm">
        <span class="text-gray-600 dark:text-gray-400">{{ appStore.processingStatus.currentStep }}</span>
        <span class="font-medium text-blue-600 dark:text-blue-400">{{ appStore.processingStatus.progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${appStore.processingStatus.progress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Type, Sparkles, Trash2 } from 'lucide-vue-next'
import { useAppStore } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'

const appStore = useAppStore()
const { t } = useI18n()


const canAnalyze = computed(() => {
  return appStore.currentText.trim().length > 0
})

const sampleText = `Artificial Intelligence (AI) has emerged as one of the most transformative technologies of the 21st century, revolutionizing industries from healthcare to finance, transportation to entertainment. At its core, AI refers to the development of computer systems that can perform tasks typically requiring human intelligence, such as visual perception, speech recognition, decision-making, and language translation.

Machine learning, a subset of AI, enables computers to learn and improve from experience without being explicitly programmed for every task. This approach has led to breakthrough applications like recommendation systems used by streaming platforms, fraud detection in banking, and diagnostic tools in medicine that can identify diseases from medical images with remarkable accuracy.

Deep learning, which uses artificial neural networks inspired by the human brain, has been particularly successful in areas like image recognition and natural language processing. Companies like Google, Amazon, and Microsoft have integrated these technologies into everyday products, making AI accessible to billions of people worldwide.

However, the rapid advancement of AI also raises important ethical questions about privacy, job displacement, and the need for responsible development. As we continue to push the boundaries of what machines can do, it becomes crucial to ensure that AI development serves humanity's best interests while addressing potential risks and challenges.

The future of AI holds immense promise, with potential applications in climate change mitigation, space exploration, and solving complex global challenges that require processing vast amounts of data and identifying patterns beyond human capability.`

const handleTextInput = () => {
  // Text is automatically updated through v-model
}

const loadSampleText = () => {
  appStore.setText(sampleText)
}

const handleAnalyze = () => {
  appStore.analyzeText(appStore.currentText)
}

const handleClear = () => {
  appStore.setText('')
}

</script>
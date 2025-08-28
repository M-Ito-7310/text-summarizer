<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Input Text
      </h2>
      
      <!-- Summary Length Selector -->
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Length:</span>
        <select 
          v-model="appStore.summaryLength"
          class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>
    </div>
    
    <!-- Tab Navigation -->
    <div class="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
      <button
        @click="activeTab = 'text'"
        :class="[
          'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
          activeTab === 'text'
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        <Type class="w-4 h-4 inline mr-2" />
        Text Input
      </button>
      <button
        @click="activeTab = 'file'"
        :class="[
          'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
          activeTab === 'file'
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        <Upload class="w-4 h-4 inline mr-2" />
        File Upload
      </button>
    </div>
    
    <!-- Text Input Tab -->
    <div v-if="activeTab === 'text'" class="space-y-4">
      <div>
        <textarea
          v-model="appStore.currentText"
          @input="handleTextInput"
          placeholder="Enter your text here for summarization and keyword extraction..."
          class="input-field min-h-[200px]"
          :disabled="appStore.processingStatus.isLoading"
        />
        
        <!-- Character/Word Count -->
        <div class="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex space-x-4">
            <span>{{ appStore.characterCount.toLocaleString() }} characters</span>
            <span>{{ appStore.wordCount.toLocaleString() }} words</span>
          </div>
          <div v-if="appStore.characterCount > 10000" class="text-amber-600 dark:text-amber-400">
            Long text may take more time to process
          </div>
        </div>
      </div>
      
      <!-- Sample Text Button -->
      <button
        @click="loadSampleText"
        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        :disabled="appStore.processingStatus.isLoading"
      >
        Load sample text
      </button>
    </div>
    
    <!-- File Upload Tab -->
    <div v-if="activeTab === 'file'" class="space-y-4">
      <div
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        :class="[
          'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        ]"
      >
        <Upload class="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <div class="space-y-2">
          <p class="text-lg font-medium text-gray-900 dark:text-gray-100">
            Drop files here to upload
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            or
          </p>
          <button
            @click="triggerFileSelect"
            class="btn-primary"
            :disabled="appStore.processingStatus.isLoading"
          >
            Choose Files
          </button>
        </div>
        <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Supports: TXT files (max 10MB)
        </p>
      </div>
      
      <!-- File Input -->
      <input
        ref="fileInput"
        type="file"
        @change="handleFileSelect"
        accept=".txt"
        class="hidden"
        :disabled="appStore.processingStatus.isLoading"
      />
      
      <!-- Selected File Display -->
      <div v-if="selectedFile" class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <FileText class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {{ selectedFile.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatFileSize(selectedFile.size) }}
          </p>
        </div>
        <button
          @click="clearSelectedFile"
          class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          :disabled="appStore.processingStatus.isLoading"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
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
        <span>{{ appStore.processingStatus.isLoading ? 'Analyzing...' : 'Analyze Text' }}</span>
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
import { Type, Upload, FileText, X, Sparkles, Trash2 } from 'lucide-vue-next'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

const activeTab = ref<'text' | 'file'>('text')
const selectedFile = ref<File | null>(null)
const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

const canAnalyze = computed(() => {
  return activeTab.value === 'text' 
    ? appStore.currentText.trim().length > 0
    : selectedFile.value !== null
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

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  // Only hide drag overlay if leaving the drop zone entirely
  if (e.relatedTarget && !(e.currentTarget as Element)?.contains(e.relatedTarget as Node)) {
    isDragOver.value = false
  }
}

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const handleFile = (file: File) => {
  // Validate file type
  const allowedTypes = ['.txt']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  
  if (!allowedTypes.includes(fileExtension)) {
    appStore.error = 'Please select a valid file type (TXT)'
    return
  }
  
  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    appStore.error = 'File size must be less than 10MB'
    return
  }
  
  selectedFile.value = file
  appStore.clearError()
}

const clearSelectedFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleAnalyze = () => {
  if (activeTab.value === 'text') {
    appStore.analyzeText(appStore.currentText)
  } else if (selectedFile.value) {
    appStore.analyzeFile(selectedFile.value)
  }
}

const handleClear = () => {
  if (activeTab.value === 'text') {
    appStore.setText('')
  } else {
    clearSelectedFile()
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>
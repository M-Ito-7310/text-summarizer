<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <Upload class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span>File Upload</span>
      </h2>
      
      <button
        v-if="uploadedFile"
        @click="clearFile"
        class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
      >
        Clear File
      </button>
    </div>

    <!-- Drag & Drop Zone -->
    <div
      ref="dropZone"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      :class="[
        'relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer',
        isDragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500',
        isProcessing ? 'pointer-events-none opacity-50' : ''
      ]"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept=".pdf,.docx,.txt"
        @change="handleFileSelect"
      />

      <!-- Upload Icon and Text -->
      <div v-if="!uploadedFile && !isProcessing" class="space-y-4">
        <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Upload :class="[
            'w-8 h-8',
            isDragActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
          ]" />
        </div>
        
        <div>
          <p class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {{ isDragActive ? 'Drop your file here' : 'Drop files here or click to browse' }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Supports PDF, DOCX, and TXT files (max 5MB)
          </p>
        </div>
      </div>

      <!-- Processing State -->
      <div v-if="isProcessing" class="space-y-4">
        <div class="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
        
        <div>
          <p class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Processing file...
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ processingStatus }}
          </p>
        </div>
      </div>

      <!-- Upload Success -->
      <div v-if="uploadedFile && !isProcessing" class="space-y-4">
        <div class="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <FileText class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        
        <div>
          <p class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            File uploaded successfully
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {{ uploadedFile.filename }} ({{ formatFileSize(uploadedFile.fileSize) }})
          </p>
          
          <div class="flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ uploadedFile.metadata.characterCount.toLocaleString() }} characters</span>
            <span>{{ uploadedFile.metadata.wordCount.toLocaleString() }} words</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-3">
          <button
            @click.stop="analyzeFile"
            class="btn-primary text-sm"
            :disabled="!uploadedFile"
          >
            <Zap class="w-4 h-4 mr-2" />
            Analyze Text
          </button>
          
          <button
            @click.stop="useAsInput"
            class="btn-secondary text-sm"
          >
            <Edit class="w-4 h-4 mr-2" />
            Use as Input
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center space-x-2">
        <AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400" />
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
    </div>

    <!-- Supported Formats -->
    <div class="mt-6 grid grid-cols-3 gap-4 text-center">
      <div class="flex flex-col items-center space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
          <FileText class="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">PDF</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Documents</p>
        </div>
      </div>

      <div class="flex flex-col items-center space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
          <FileText class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">DOCX</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Word Docs</p>
        </div>
      </div>

      <div class="flex flex-col items-center space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
          <FileText class="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">TXT</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Plain Text</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Upload, FileText, Zap, Edit, AlertCircle } from 'lucide-vue-next'
import { useAppStore } from '@/stores/appStore'
import axios from 'axios'


const appStore = useAppStore()

const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const isDragActive = ref(false)
const isProcessing = ref(false)
const processingStatus = ref('')
const uploadedFile = ref<any>(null)
const error = ref<string | null>(null)

const emit = defineEmits<{
  fileUploaded: [file: any]
  textExtracted: [text: string]
}>()

// Drag and drop handlers
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDragActive.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  // Only set isDragActive to false if we're leaving the drop zone entirely
  if (e.relatedTarget && !dropZone.value?.contains(e.relatedTarget as Node)) {
    isDragActive.value = false
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDragActive.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    processFile(file)
  }
}

const processFile = async (file: File) => {
  error.value = null
  isProcessing.value = true
  processingStatus.value = 'Validating file...'

  try {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    const allowedExtensions = ['.pdf', '.docx', '.txt']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      throw new Error('Unsupported file type. Only PDF, DOCX, and TXT files are allowed.')
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 5MB.')
    }

    processingStatus.value = 'Uploading file...'

    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post(`${appStore.API_BASE_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          processingStatus.value = `Uploading... ${progress}%`
        }
      }
    })

    processingStatus.value = 'Processing complete!'

    uploadedFile.value = response.data.data
    emit('fileUploaded', response.data.data)

    // Clear file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }

  } catch (err: any) {
    console.error('File processing failed:', err)
    error.value = err.response?.data?.error || err.message || 'Failed to process file'
  } finally {
    isProcessing.value = false
    processingStatus.value = ''
  }
}

const analyzeFile = () => {
  if (uploadedFile.value?.textContent) {
    emit('textExtracted', uploadedFile.value.textContent)
    appStore.analyzeText(uploadedFile.value.textContent)
  }
}

const useAsInput = () => {
  if (uploadedFile.value?.textContent) {
    emit('textExtracted', uploadedFile.value.textContent)
    appStore.setText(uploadedFile.value.textContent)
  }
}

const clearFile = () => {
  uploadedFile.value = null
  error.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Prevent default drag behavior on the entire document
onMounted(() => {
  document.addEventListener('dragover', (e) => e.preventDefault())
  document.addEventListener('drop', (e) => e.preventDefault())
})

onUnmounted(() => {
  document.removeEventListener('dragover', (e) => e.preventDefault())
  document.removeEventListener('drop', (e) => e.preventDefault())
})
</script>


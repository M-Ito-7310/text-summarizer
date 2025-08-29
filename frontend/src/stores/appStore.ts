import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface AnalysisResult {
  id: string
  text: string
  summary: string
  keywords: string[]
  timestamp: Date
  summaryLength: 'short' | 'medium' | 'long'
}

export interface ProcessingStatus {
  isLoading: boolean
  progress: number
  currentStep: string
}

export const useAppStore = defineStore('app', () => {
  // State
  const isDarkMode = ref(false)
  const currentText = ref('')
  const summaryLength = ref<'short' | 'medium' | 'long'>('medium')
  const processingStatus = ref<ProcessingStatus>({
    isLoading: false,
    progress: 0,
    currentStep: ''
  })
  const analysisHistory = ref<AnalysisResult[]>([])
  const currentResult = ref<AnalysisResult | null>(null)
  const error = ref<string | null>(null)
  
  // API Configuration
  const API_BASE_URL = 'http://localhost:3001/api'
  
  // Computed
  const characterCount = computed(() => currentText.value.length)
  const wordCount = computed(() => {
    return currentText.value.trim() ? currentText.value.trim().split(/\s+/).length : 0
  })
  
  // Actions
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }
  
  const initializeDarkMode = () => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      isDarkMode.value = saved === 'true'
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    }
  }
  
  const updateProcessingStatus = (step: string, progress: number) => {
    processingStatus.value.currentStep = step
    processingStatus.value.progress = progress
  }
  
  const analyzeText = async (text: string) => {
    if (!text.trim()) {
      error.value = 'Please enter some text to analyze'
      return
    }
    
    try {
      error.value = null
      processingStatus.value.isLoading = true
      updateProcessingStatus('Preparing text analysis...', 10)
      
      const response = await axios.post(`${API_BASE_URL}/text/analyze`, {
        text: text.trim()
      })
      
      updateProcessingStatus('Processing with AI...', 50)
      
      // Simulate processing steps
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateProcessingStatus('Extracting keywords...', 75)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      updateProcessingStatus('Finalizing results...', 90)
      
      const result: AnalysisResult = {
        id: Date.now().toString(),
        text: text.trim(),
        summary: response.data.data.summary.text,
        keywords: response.data.data.keywords.list.map((item: any) => item.word || item.keyword),
        timestamp: new Date(),
        summaryLength: summaryLength.value
      }
      
      currentResult.value = result
      analysisHistory.value.unshift(result)
      
      // Save to localStorage
      localStorage.setItem('analysisHistory', JSON.stringify(analysisHistory.value.slice(0, 50))) // Keep last 50
      
      updateProcessingStatus('Complete!', 100)
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to analyze text. Please try again.'
      console.error('Analysis error:', err)
    } finally {
      setTimeout(() => {
        processingStatus.value.isLoading = false
        processingStatus.value.progress = 0
        processingStatus.value.currentStep = ''
      }, 1000)
    }
  }
  
  const analyzeFile = async (file: File) => {
    try {
      error.value = null
      processingStatus.value.isLoading = true
      updateProcessingStatus('Reading file...', 20)
      
      // For now, we'll read the file as text and analyze it
      // In the future, this could be enhanced to support the backend file upload endpoint
      const text = await readFileAsText(file)
      
      if (!text || text.trim().length < 50) {
        throw new Error('File must contain at least 50 characters of text')
      }
      
      updateProcessingStatus('Processing file content...', 60)
      
      // Analyze the extracted text
      await analyzeText(text)
      
    } catch (err: any) {
      error.value = err.message || 'Failed to analyze file. Please try again.'
      console.error('File analysis error:', err)
    } finally {
      setTimeout(() => {
        processingStatus.value.isLoading = false
        processingStatus.value.progress = 0
        processingStatus.value.currentStep = ''
      }, 1000)
    }
  }
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
  
  const loadHistoryFromStorage = () => {
    try {
      const saved = localStorage.getItem('analysisHistory')
      if (saved) {
        const parsed = JSON.parse(saved)
        analysisHistory.value = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      }
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }
  
  const clearHistory = () => {
    analysisHistory.value = []
    localStorage.removeItem('analysisHistory')
  }
  
  const deleteHistoryItem = (id: string) => {
    analysisHistory.value = analysisHistory.value.filter(item => item.id !== id)
    localStorage.setItem('analysisHistory', JSON.stringify(analysisHistory.value))
  }
  
  const clearError = () => {
    error.value = null
  }
  
  const setSummaryLength = (length: 'short' | 'medium' | 'long') => {
    summaryLength.value = length
  }
  
  const setText = (text: string) => {
    currentText.value = text
  }
  
  return {
    // State
    isDarkMode,
    currentText,
    summaryLength,
    processingStatus,
    analysisHistory,
    currentResult,
    error,
    
    // API Configuration
    API_BASE_URL,
    
    // Computed
    characterCount,
    wordCount,
    
    // Actions
    toggleDarkMode,
    initializeDarkMode,
    analyzeText,
    analyzeFile,
    loadHistoryFromStorage,
    clearHistory,
    deleteHistoryItem,
    clearError,
    setSummaryLength,
    setText
  }
})
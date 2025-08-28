import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { textService, type SummarizeRequest, type KeywordsRequest, type AnalyzeRequest, type AnalyzeResponse } from '../services/api'

export const useTextStore = defineStore('text', () => {
  // State
  const inputText = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastAnalysis = ref<AnalyzeResponse['data'] | null>(null)
  const history = ref<Array<{
    id: string
    timestamp: Date
    text: string
    analysis: AnalyzeResponse['data']
  }>>([])

  // Getters
  const hasText = computed(() => inputText.value.length > 0)
  const wordCount = computed(() => {
    if (!inputText.value) return 0
    return inputText.value.split(/\s+/).filter(word => word.length > 0).length
  })
  const characterCount = computed(() => inputText.value.length)
  const canAnalyze = computed(() => hasText.value && inputText.value.length >= 50)

  // Actions
  const setInputText = (text: string) => {
    inputText.value = text
    error.value = null
  }

  const clearText = () => {
    inputText.value = ''
    error.value = null
    lastAnalysis.value = null
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
    isLoading.value = false
  }

  const clearError = () => {
    error.value = null
  }

  const summarizeText = async (options: { maxLength?: number; minLength?: number } = {}) => {
    if (!canAnalyze.value) {
      setError('Text must be at least 50 characters long')
      return null
    }

    isLoading.value = true
    clearError()

    try {
      const request: SummarizeRequest = {
        text: inputText.value,
        maxLength: options.maxLength || 150,
        minLength: options.minLength || 50
      }

      const response = await textService.summarize(request)
      
      if (response.success) {
        return response.data
      } else {
        setError('Failed to summarize text')
        return null
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to summarize text')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const extractKeywords = async (options: { maxKeywords?: number } = {}) => {
    if (!hasText.value) {
      setError('Please enter text to analyze')
      return null
    }

    isLoading.value = true
    clearError()

    try {
      const request: KeywordsRequest = {
        text: inputText.value,
        maxKeywords: options.maxKeywords || 10
      }

      const response = await textService.extractKeywords(request)
      
      if (response.success) {
        return response.data.keywords
      } else {
        setError('Failed to extract keywords')
        return null
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to extract keywords')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const analyzeText = async (options: {
    maxLength?: number
    minLength?: number
    maxKeywords?: number
  } = {}) => {
    if (!canAnalyze.value) {
      setError('Text must be at least 50 characters long')
      return null
    }

    isLoading.value = true
    clearError()

    try {
      const request: AnalyzeRequest = {
        text: inputText.value,
        maxLength: options.maxLength || 150,
        minLength: options.minLength || 50,
        maxKeywords: options.maxKeywords || 10
      }

      const response = await textService.analyze(request)
      
      if (response.success) {
        lastAnalysis.value = response.data
        
        // Add to history
        const historyItem = {
          id: Date.now().toString(),
          timestamp: new Date(),
          text: inputText.value.substring(0, 200) + (inputText.value.length > 200 ? '...' : ''),
          analysis: response.data
        }
        
        history.value.unshift(historyItem)
        
        // Keep only last 10 items
        if (history.value.length > 10) {
          history.value = history.value.slice(0, 10)
        }
        
        return response.data
      } else {
        setError('Failed to analyze text')
        return null
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze text')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const clearHistory = () => {
    history.value = []
  }

  const removeFromHistory = (id: string) => {
    history.value = history.value.filter(item => item.id !== id)
  }

  return {
    // State
    inputText,
    isLoading,
    error,
    lastAnalysis,
    history,
    
    // Getters
    hasText,
    wordCount,
    characterCount,
    canAnalyze,
    
    // Actions
    setInputText,
    clearText,
    setError,
    clearError,
    summarizeText,
    extractKeywords,
    analyzeText,
    clearHistory,
    removeFromHistory
  }
})
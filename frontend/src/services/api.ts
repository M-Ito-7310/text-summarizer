import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      // Redirect to login if needed
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      console.warn('Rate limit exceeded')
    }
    
    return Promise.reject(error)
  }
)

export interface SummarizeRequest {
  text: string
  maxLength?: number
  minLength?: number
}

export interface SummarizeResponse {
  success: boolean
  data: {
    originalLength: number
    summaryLength: number
    summary: string
    compressionRatio: string
  }
  message: string
}

export interface KeywordsRequest {
  text: string
  maxKeywords?: number
}

export interface Keyword {
  keyword: string
  frequency: number
  type: 'word' | 'phrase'
}

export interface KeywordsResponse {
  success: boolean
  data: {
    keywords: Keyword[]
    count: number
    textLength: number
  }
  message: string
}

export interface AnalyzeRequest {
  text: string
  maxLength?: number
  minLength?: number
  maxKeywords?: number
}

export interface AnalyzeResponse {
  success: boolean
  data: {
    originalLength: number
    summary: {
      text: string
      length: number
      compressionRatio: string
    }
    keywords: {
      list: Keyword[]
      count: number
    }
    metadata: {
      processedAt: string
      wordCount: number
    }
  }
  message: string
}

// Text API services
export const textService = {
  async summarize(data: SummarizeRequest): Promise<SummarizeResponse> {
    const response = await api.post<SummarizeResponse>('/api/text/summarize', data)
    return response.data
  },

  async extractKeywords(data: KeywordsRequest): Promise<KeywordsResponse> {
    const response = await api.post<KeywordsResponse>('/api/text/keywords', data)
    return response.data
  },

  async analyze(data: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await api.post<AnalyzeResponse>('/api/text/analyze', data)
    return response.data
  },

  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  }
}
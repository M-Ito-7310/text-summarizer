<template>
  <div id="app">
    <header>
      <h1>Text Summarizer & Keyword Extractor</h1>
      <p>AI-powered text analysis tool</p>
    </header>
    
    <main>
      <div class="card">
        <h2>Enter Text to Analyze</h2>
        <textarea
          v-model="inputText"
          class="textarea"
          placeholder="Enter your text here..."
          :disabled="loading"
        ></textarea>
        
        <div style="margin: 1rem 0;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Summary Length:</label>
            <select v-model="summaryLength" class="input" style="width: auto; margin-right: 1rem;">
              <option value="short">Short (50-100 chars)</option>
              <option value="medium">Medium (100-200 chars)</option>
              <option value="long">Long (200-300 chars)</option>
            </select>
            <small style="color: #6b7280;">Current text: {{ inputText.length }} characters</small>
          </div>
          
          <button 
            @click="analyzeText" 
            class="btn"
            :disabled="loading || !inputText.trim()"
          >
            <span v-if="loading" class="loading"></span>
            {{ loading ? 'Analyzing...' : 'Analyze Text' }}
          </button>
        </div>
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="result" class="result-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0;">Summary</h3>
          <div style="text-align: right;">
            <small style="color: #6b7280;">{{ getSummaryLength() }} characters</small>
            <br>
            <small style="color: #9ca3af; font-size: 0.75rem;">{{ getCompressionRatio() }}% compression</small>
          </div>
        </div>
        <p>{{ result.summary?.text || 'No summary available' }}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 1.5rem 0 1rem 0;">
          <h3 style="margin: 0;">Keywords</h3>
          <small style="color: #6b7280;" v-if="result.keywords?.list?.length">{{ result.keywords.list.length }} found</small>
        </div>
        <div v-if="result.keywords?.list?.length">
          <span 
            v-for="keyword in result.keywords.list" 
            :key="keyword.word"
            class="keyword-tag"
            :title="`Frequency: ${keyword.frequency || 'N/A'} | Type: ${keyword.type || 'word'}`"
          >
            {{ keyword.word }} ({{ Math.round(keyword.score * 100) }}%)
          </span>
        </div>
        <p v-else>No keywords found</p>
        
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
          <div style="display: flex; justify-content: space-between;">
            <small style="color: #6b7280;">
              Original: {{ inputText.length }} characters
            </small>
            <small style="color: #6b7280;" v-if="result.summary?.provider">
              Method: {{ result.summary?.provider }} {{ result.summary?.method ? `(${result.summary.method})` : '' }}
            </small>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const inputText = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<any>(null)
const summaryLength = ref('medium')

const API_BASE_URL = 'http://localhost:3001'

function getSummaryLength() {
  const summaryText = result.value?.summary?.text || ''
  return summaryText.length
}

function getCompressionRatio() {
  const originalLength = inputText.value.length
  const summaryLen = getSummaryLength()
  if (originalLength === 0) return 0
  return Math.round((summaryLen / originalLength) * 100)
}

function getSummaryLimits() {
  const limits = {
    short: { maxLength: 100, minLength: 30 },
    medium: { maxLength: 200, minLength: 50 },
    long: { maxLength: 300, minLength: 80 }
  }
  return limits[summaryLength.value as keyof typeof limits] || limits.medium
}


async function analyzeText() {
  if (!inputText.value.trim()) return
  
  loading.value = true
  error.value = ''
  result.value = null
  
  try {
    const limits = getSummaryLimits()
    const response = await axios.post(`${API_BASE_URL}/api/text/analyze`, {
      text: inputText.value.trim(),
      summaryOptions: {
        maxLength: limits.maxLength,
        minLength: limits.minLength
      },
      keywordOptions: {
        maxKeywords: 10
      }
    })
    
    result.value = response.data.data
    console.log('Frontend received result:', result.value)
    console.log('Keywords structure:', result.value.keywords)
    
    // Refresh API status after analysis
    await fetchApiStatus()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred while analyzing the text'
    console.error('Analysis error:', err)
  } finally {
    loading.value = false
  }
}

// Initialize API status on component mount
onMounted(() => {
  fetchApiStatus()
})
</script>
<template>
  <div v-if="result" class="card p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Analysis Results
      </h2>
      
      <div class="flex items-center space-x-2">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatDate(result.timestamp) }}
        </span>
        <div class="flex space-x-1">
          <button
            @click="copyToClipboard"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            :title="copyStatus === 'copied' ? 'Copied!' : 'Copy results'"
          >
            <Check v-if="copyStatus === 'copied'" class="w-4 h-4 text-green-600" />
            <Copy v-else class="w-4 h-4" />
          </button>
          
          <button
            @click="exportResults"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Export as PDF"
          >
            <Download class="w-4 h-4" />
          </button>
          
          <button
            @click="shareResults"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Share results"
          >
            <Share2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Summary Section -->
    <div class="mb-8">
      <div class="flex items-center space-x-2 mb-4">
        <FileText class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Summary</h3>
        <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
          {{ result.summaryLength }}
        </span>
      </div>
      
      <div class="prose dark:prose-invert max-w-none">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-l-4 border-blue-500">
          <p class="text-gray-800 dark:text-gray-200 leading-relaxed">
            {{ result.summary }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Keywords Section -->
    <div class="mb-8">
      <div class="flex items-center space-x-2 mb-4">
        <Tag class="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Keywords</h3>
        <span class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
          {{ result.keywords.length }}
        </span>
      </div>
      
      <!-- Keyword Cloud -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <div
          v-for="(keyword, index) in result.keywords"
          :key="keyword"
          class="group relative"
        >
          <div 
            :class="[
              'px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer',
              'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800',
              'border-gray-200 dark:border-gray-600',
              'hover:border-green-400 dark:hover:border-green-500',
              'hover:shadow-md hover:scale-105',
              'group-hover:from-green-50 group-hover:to-emerald-50',
              'dark:group-hover:from-green-900 dark:group-hover:to-emerald-900'
            ]"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="searchKeyword(keyword)"
          >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300">
              {{ keyword }}
            </span>
            <div class="absolute inset-0 bg-green-400 opacity-0 rounded-lg transition-opacity group-hover:opacity-10" />
          </div>
        </div>
      </div>
      
      <!-- Keyword List -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">All keywords:</p>
        <p class="text-sm text-gray-800 dark:text-gray-200">
          {{ result.keywords.join(', ') }}
        </p>
      </div>
    </div>
    
    <!-- Original Text Section (Collapsible) -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <button
        @click="showOriginalText = !showOriginalText"
        class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-4"
      >
        <ChevronRight 
          class="w-4 h-4 transition-transform duration-200" 
          :class="{ 'rotate-90': showOriginalText }"
        />
        <span class="text-sm font-medium">Original Text</span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ({{ result.text.length.toLocaleString() }} characters)
        </span>
      </button>
      
      <div v-if="showOriginalText" class="animate-slide-up">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {{ result.text }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Analysis Stats -->
    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {{ result.text.length.toLocaleString() }}
          </div>
          <div class="text-xs text-blue-600/70 dark:text-blue-400/70">Characters</div>
        </div>
        
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <div class="text-lg font-semibold text-green-600 dark:text-green-400">
            {{ wordCount.toLocaleString() }}
          </div>
          <div class="text-xs text-green-600/70 dark:text-green-400/70">Words</div>
        </div>
        
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <div class="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {{ result.keywords.length }}
          </div>
          <div class="text-xs text-purple-600/70 dark:text-purple-400/70">Keywords</div>
        </div>
        
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
          <div class="text-lg font-semibold text-orange-600 dark:text-orange-400">
            {{ compressionRatio }}%
          </div>
          <div class="text-xs text-orange-600/70 dark:text-orange-400/70">Compression</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Empty State -->
  <div v-else class="card p-12 text-center">
    <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
      <Sparkles class="w-8 h-8 text-gray-400" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      Ready to analyze your text
    </h3>
    <p class="text-gray-600 dark:text-gray-400">
      Enter some text or upload a file to get started with AI-powered summarization and keyword extraction.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  FileText, Tag, Copy, Check, Download, Share2, ChevronRight, Sparkles
} from 'lucide-vue-next'
import { useAppStore, type AnalysisResult } from '@/stores/appStore'
import jsPDF from 'jspdf'

interface Props {
  result?: AnalysisResult | null
}

const props = defineProps<Props>()
const appStore = useAppStore()

const showOriginalText = ref(false)
const copyStatus = ref<'idle' | 'copied'>('idle')

const wordCount = computed(() => {
  return props.result?.text.trim().split(/\s+/).length || 0
})

const compressionRatio = computed(() => {
  if (!props.result) return 0
  const originalLength = props.result.text.length
  const summaryLength = props.result.summary.length
  return Math.round((1 - summaryLength / originalLength) * 100)
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const copyToClipboard = async () => {
  if (!props.result) return
  
  const textToCopy = `SUMMARY:\n${props.result.summary}\n\nKEYWORDS:\n${props.result.keywords.join(', ')}`
  
  try {
    await navigator.clipboard.writeText(textToCopy)
    copyStatus.value = 'copied'
    setTimeout(() => {
      copyStatus.value = 'idle'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

const exportResults = () => {
  if (!props.result) return
  
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    
    // Title
    doc.setFontSize(20)
    doc.text('Text Analysis Results', margin, 30)
    
    // Timestamp
    doc.setFontSize(12)
    doc.text(`Generated: ${formatDate(props.result.timestamp)}`, margin, 45)
    
    // Summary
    doc.setFontSize(16)
    doc.text('Summary:', margin, 65)
    doc.setFontSize(12)
    const summaryLines = doc.splitTextToSize(props.result.summary, maxWidth)
    doc.text(summaryLines, margin, 80)
    
    // Keywords
    let yPosition = 80 + (summaryLines.length * 7) + 20
    doc.setFontSize(16)
    doc.text('Keywords:', margin, yPosition)
    doc.setFontSize(12)
    yPosition += 15
    const keywordText = props.result.keywords.join(', ')
    const keywordLines = doc.splitTextToSize(keywordText, maxWidth)
    doc.text(keywordLines, margin, yPosition)
    
    // Save
    doc.save(`text-analysis-${Date.now()}.pdf`)
  } catch (err) {
    console.error('Failed to export PDF:', err)
  }
}

const shareResults = async () => {
  if (!props.result) return
  
  const shareData = {
    title: 'Text Analysis Results',
    text: `Summary: ${props.result.summary}\n\nKeywords: ${props.result.keywords.join(', ')}`,
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.error('Error sharing:', err)
    }
  } else {
    // Fallback to clipboard
    copyToClipboard()
  }
}

const searchKeyword = (keyword: string) => {
  // This would typically open a search or highlight the keyword
  console.log('Searching for keyword:', keyword)
}
</script>
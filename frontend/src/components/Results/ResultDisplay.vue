<template>
  <div v-if="result" class="card p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ t('components.results.title') }}
      </h2>
      
      <div class="flex items-center space-x-2">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatDate(result.timestamp) }}
        </span>
        <div class="flex space-x-1">
          <button
            @click="copyToClipboard"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
:title="copyStatus === 'copied' ? t('components.results.toast.copied') : t('components.results.actions.copyText')"
          >
            <Check v-if="copyStatus === 'copied'" class="w-4 h-4 text-green-600" />
            <Copy v-else class="w-4 h-4" />
          </button>
          
          <button
            @click="exportResults"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
:title="t('components.results.actions.exportPdf')"
          >
            <Download class="w-4 h-4" />
          </button>
          
          <button
            @click="shareResults"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
:title="t('components.results.actions.shareResult')"
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
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('components.results.summary') }}</h3>
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
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('components.results.keywords') }}</h3>
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
        <span class="text-sm font-medium">{{ t('components.results.originalText') }}</span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ({{ languageStore.formatNumber(result.text.length) }} {{ t('common.common.characters') }})
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
          <div class="text-xs text-blue-600/70 dark:text-blue-400/70">{{ t('common.common.characters') }}</div>
        </div>
        
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <div class="text-lg font-semibold text-green-600 dark:text-green-400">
            {{ languageStore.formatNumber(wordCount) }}
          </div>
          <div class="text-xs text-green-600/70 dark:text-green-400/70">
            {{ /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(result?.text || '') ? t('common.common.sentences') : t('common.common.words') }}
          </div>
        </div>
        
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <div class="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {{ result.keywords.length }}
          </div>
          <div class="text-xs text-purple-600/70 dark:text-purple-400/70">{{ t('components.results.keywords') }}</div>
        </div>
        
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
          <div class="text-lg font-semibold text-orange-600 dark:text-orange-400">
            {{ compressionRatio }}%
          </div>
          <div class="text-xs text-orange-600/70 dark:text-orange-400/70">{{ t('components.results.compression') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  FileText, Tag, Copy, Check, Download, Share2, ChevronRight
} from 'lucide-vue-next'
import { type AnalysisResult } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/languageStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface Props {
  result?: AnalysisResult | null
}

const props = defineProps<Props>()
const { t } = useI18n()
const languageStore = useLanguageStore()

const showOriginalText = ref(false)
const copyStatus = ref<'idle' | 'copied'>('idle')

const wordCount = computed(() => {
  if (!props.result?.text) return 0
  const text = props.result.text.trim()
  if (!text) return 0
  
  // Detect if text contains Japanese characters
  const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(text)
  
  if (hasJapanese) {
    // For Japanese: count sentences by splitting on Japanese punctuation
    const sentences = text.split(/[\u3002\uff01\uff1f]/).filter(s => s.trim().length > 0)
    return sentences.length
  } else {
    // For English: count words by splitting on spaces
    return text.split(/\s+/).length
  }
})

const compressionRatio = computed(() => {
  if (!props.result) return 0
  const originalLength = props.result.text.length
  const summaryLength = props.result.summary.length
  return Math.round((1 - summaryLength / originalLength) * 100)
})

const formatDate = (date: Date) => {
  return languageStore.formatDate(date)
}

const copyToClipboard = async () => {
  if (!props.result) return
  
  const textToCopy = `${t('components.results.summary').toUpperCase()}:\n${props.result.summary}\n\n${t('components.results.keywords').toUpperCase()}:\n${props.result.keywords.join(', ')}`
  
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

const exportResults = async () => {
  if (!props.result) return
  
  try {
    // Use html2canvas for both Japanese and English for consistent quality
    await exportHTMLToPDF()
  } catch (err) {
    console.error('Failed to export PDF:', err)
  }
}

// Legacy function removed - now using unified HTML-to-PDF approach

const exportHTMLToPDF = async () => {
  if (!props.result) return
  
  // Create a temporary HTML element with proper styling for both languages
  const tempDiv = document.createElement('div')
  tempDiv.style.cssText = `
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: 800px;
    padding: 40px;
    font-family: 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    background: white;
  `
  
  // Detect language for word/sentence label
  const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(props.result.text)
  
  // Use current UI language for PDF labels (not content language)
  const labels = {
    title: t('components.results.title'),
    generated: languageStore.locale === 'ja' ? '生成日時' : 'Generated',
    summary: t('components.results.summary'),
    keywords: t('components.results.keywords'),
    statistics: t('components.results.statistics'),
    characters: t('common.common.characters'),
    words: hasJapanese ? t('common.common.sentenceCount') : t('common.common.words'),
    keywordCount: t('common.common.keywordsFound'),
    compression: t('components.results.compression')
  }
  
  tempDiv.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="font-size: 24px; margin-bottom: 10px; color: #2563eb;">${labels.title}</h1>
      <p style="font-size: 12px; color: #666; margin-bottom: 20px;">${labels.generated}: ${formatDate(props.result.timestamp)}</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; margin-bottom: 15px; color: #059669; border-left: 4px solid #059669; padding-left: 10px;">${labels.summary}</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; line-height: 1.8; word-wrap: break-word;">
        ${props.result.summary}
      </div>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; margin-bottom: 15px; color: #7c3aed; border-left: 4px solid #7c3aed; padding-left: 10px;">${labels.keywords}</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
        ${props.result.keywords.map(keyword => `<span style="background: #e0e7ff; padding: 8px 12px; border-radius: 6px; font-size: 13px; word-break: break-word;">${keyword}</span>`).join('')}
      </div>
    </div>
    
    <div>
      <h2 style="font-size: 18px; margin-bottom: 15px; color: #dc2626; border-left: 4px solid #dc2626; padding-left: 10px;">${labels.statistics}</h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
          <div style="font-size: 20px; font-weight: bold; color: #1f2937;">${props.result.text.length.toLocaleString()}</div>
          <div style="font-size: 12px; color: #6b7280;">${labels.characters}</div>
        </div>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
          <div style="font-size: 20px; font-weight: bold; color: #1f2937;">${wordCount.value.toLocaleString()}</div>
          <div style="font-size: 12px; color: #6b7280;">${labels.words}</div>
        </div>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
          <div style="font-size: 20px; font-weight: bold; color: #1f2937;">${props.result.keywords.length}</div>
          <div style="font-size: 12px; color: #6b7280;">${labels.keywordCount}</div>
        </div>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
          <div style="font-size: 20px; font-weight: bold; color: #1f2937;">${compressionRatio.value}%</div>
          <div style="font-size: 12px; color: #6b7280;">${labels.compression}</div>
        </div>
      </div>
    </div>
  `
  
  document.body.appendChild(tempDiv)
  
  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    
    // Calculate image dimensions to fit page
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    if (imgHeight <= pageHeight - 20) {
      // Single page
      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
    } else {
      // Multiple pages needed
      const pagesNeeded = Math.ceil(imgHeight / (pageHeight - 20))
      const pageImgHeight = pageHeight - 20
      
      for (let i = 0; i < pagesNeeded; i++) {
        if (i > 0) doc.addPage()
        
        const sourceY = i * (canvas.height / pagesNeeded)
        const sourceHeight = canvas.height / pagesNeeded
        
        // Create temporary canvas for this page section
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = sourceHeight
        const pageCtx = pageCanvas.getContext('2d')
        
        if (pageCtx) {
          pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight)
          const pageImgData = pageCanvas.toDataURL('image/png')
          doc.addImage(pageImgData, 'PNG', 10, 10, imgWidth, pageImgHeight)
        }
      }
    }
    
    doc.save(`text-analysis-${Date.now()}.pdf`)
  } finally {
    document.body.removeChild(tempDiv)
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
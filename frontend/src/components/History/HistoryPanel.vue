<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <Clock class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span>{{ t('components.history.title') }}</span>
      </h2>
      
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ history.length }} {{ history.length === 1 ? t('components.history.item') : t('components.history.items') }}
        </span>
        
        <button
          v-if="history.length > 0"
          @click="clearAllHistory"
          class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
        >
          {{ t('components.history.clearAll') }}
        </button>
      </div>
    </div>
    
    <!-- History Items -->
    <div v-if="history.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="item in history"
        :key="item.id"
        class="group relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
        @click="selectHistoryItem(item)"
        :class="{ 'ring-2 ring-blue-500': selectedItem?.id === item.id }"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-1">
              <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {{ item.summaryLength }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatRelativeTime(item.timestamp) }}
              </span>
            </div>
            
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ getPreviewTitle(item.text) }}
            </h3>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="loadHistoryItem(item)"
              class="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
:title="t('components.history.actions.load')"
            >
              <RotateCcw class="w-4 h-4" />
            </button>
            
            <button
              @click.stop="copyHistoryItem(item)"
              class="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
:title="copyStatus[item.id] === 'copied' ? t('components.results.toast.copied') : t('components.results.actions.copyText')"
            >
              <Check v-if="copyStatus[item.id] === 'copied'" class="w-4 h-4 text-green-600" />
              <Copy v-else class="w-4 h-4" />
            </button>
            
            <button
              @click.stop="deleteHistoryItem(item.id)"
              class="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
:title="t('components.history.actions.delete')"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <!-- Content Preview -->
        <div class="space-y-2">
          <!-- Summary Preview -->
          <div class="text-sm text-gray-600 dark:text-gray-300">
            <p class="line-clamp-2">
              {{ item.summary }}
            </p>
          </div>
          
          <!-- Keywords -->
          <div class="flex flex-wrap gap-1">
            <span
              v-for="keyword in item.keywords.slice(0, 5)"
              :key="keyword"
              class="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded"
            >
              {{ keyword }}
            </span>
            <span
              v-if="item.keywords.length > 5"
              class="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded"
            >
              +{{ item.keywords.length - 5 }} {{ t('components.history.more') }}
            </span>
          </div>
        </div>
        
        <!-- Stats -->
        <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div class="flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ languageStore.formatNumber(item.text.length) }} {{ t('components.history.chars') }}</span>
            <span>{{ languageStore.formatNumber(getWordCount(item.text)) }} {{ /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(item.text) ? t('components.history.sentences') : t('components.history.words') }}</span>
            <span>{{ item.keywords.length }} {{ t('components.history.keywords') }}</span>
          </div>
          
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(item.timestamp) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <Clock class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {{ t('components.history.empty') }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        {{ t('components.history.emptyHint') }}
      </p>
    </div>
    
    <!-- Pagination -->
    <div v-if="history.length > itemsPerPage" class="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="currentPage > 1 && currentPage--"
        :disabled="currentPage <= 1"
        class="btn-secondary text-sm"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
      >
        <ChevronLeft class="w-4 h-4 mr-1" />
        {{ t('components.history.pagination.previous') }}
      </button>
      
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ t('components.history.pagination.page', { current: currentPage, total: totalPages }) }}
      </span>
      
      <button
        @click="currentPage < totalPages && currentPage++"
        :disabled="currentPage >= totalPages"
        class="btn-secondary text-sm"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
      >
        {{ t('components.history.pagination.next') }}
        <ChevronRight class="w-4 h-4 ml-1" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Clock, RotateCcw, Copy, Check, Trash2, ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import { useAppStore, type AnalysisResult } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/languageStore'

const appStore = useAppStore()
const { t } = useI18n()
const languageStore = useLanguageStore()

const selectedItem = ref<AnalysisResult | null>(null)
const copyStatus = ref<Record<string, 'idle' | 'copied'>>({})
const currentPage = ref(1)
const itemsPerPage = 10

const emit = defineEmits<{
  itemSelected: [item: AnalysisResult]
}>()

const history = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return appStore.analysisHistory.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  return Math.ceil(appStore.analysisHistory.length / itemsPerPage)
})

const getPreviewTitle = (text: string) => {
  const firstLine = text.split('\n')[0]
  return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
}

const getWordCount = (text: string) => {
  if (!text.trim()) return 0
  
  // Detect if text contains Japanese characters
  const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(text)
  
  if (hasJapanese) {
    // For Japanese: count sentences by splitting on Japanese punctuation
    const sentences = text.split(/[\u3002\uff01\uff1f]/).filter(s => s.trim().length > 0)
    return sentences.length
  } else {
    // For English: count words by splitting on spaces
    return text.trim().split(/\s+/).length
  }
}

const formatDate = (date: Date) => {
  return languageStore.formatDate(date)
}

const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  
  if (diffMonths > 0) {
    return t('components.history.timeAgo.monthsAgo', { n: diffMonths })
  } else if (diffWeeks > 0) {
    return t('components.history.timeAgo.weeksAgo', { n: diffWeeks })
  } else if (diffDays > 0) {
    return t('components.history.timeAgo.daysAgo', { n: diffDays })
  } else if (diffHours > 0) {
    return t('components.history.timeAgo.hoursAgo', { n: diffHours })
  } else if (diffMinutes > 5) {
    return t('components.history.timeAgo.minutesAgo', { n: diffMinutes })
  } else {
    return t('components.history.timeAgo.justNow')
  }
}

const selectHistoryItem = (item: AnalysisResult) => {
  selectedItem.value = selectedItem.value?.id === item.id ? null : item
  if (selectedItem.value) {
    emit('itemSelected', item)
  }
}

const loadHistoryItem = (item: AnalysisResult) => {
  appStore.currentResult = item
  appStore.setText(item.text)
  appStore.setSummaryLength(item.summaryLength)
}

const copyHistoryItem = async (item: AnalysisResult) => {
  const textToCopy = `${t('components.results.summary').toUpperCase()}:\n${item.summary}\n\n${t('components.results.keywords').toUpperCase()}:\n${item.keywords.join(', ')}`
  
  try {
    await navigator.clipboard.writeText(textToCopy)
    copyStatus.value[item.id] = 'copied'
    setTimeout(() => {
      copyStatus.value[item.id] = 'idle'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

const deleteHistoryItem = (id: string) => {
  appStore.deleteHistoryItem(id)
  if (selectedItem.value?.id === id) {
    selectedItem.value = null
  }
}

const clearAllHistory = () => {
  if (confirm(t('components.history.confirmClear'))) {
    appStore.clearHistory()
    selectedItem.value = null
    currentPage.value = 1
  }
}

onMounted(() => {
  appStore.loadHistoryFromStorage()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
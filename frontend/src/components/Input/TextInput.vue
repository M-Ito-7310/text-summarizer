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
          :title="t(`home.input.lengthTooltip.${appStore.summaryLength}`)"
        >
          <option value="short" :title="t('home.input.lengthTooltip.short')">
            {{ t('home.input.lengthOptions.short') }} ({{ t('home.input.lengthOptions.shortDesc') }})
          </option>
          <option value="medium" :title="t('home.input.lengthTooltip.medium')">
            {{ t('home.input.lengthOptions.medium') }} ({{ t('home.input.lengthOptions.mediumDesc') }})
          </option>
          <option value="long" :title="t('home.input.lengthTooltip.long')">
            {{ t('home.input.lengthOptions.long') }} ({{ t('home.input.lengthOptions.longDesc') }})
          </option>
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

const sampleText = `人工知能（AI）技術の急速な発展により、我々の日常生活は大きく変わりつつあります。機械学習アルゴリズムは、データから自動的にパターンを学習し、人間の判断を補完する役割を果たしています。

自然言語処理技術の進歩により、コンピューターは人間の言葉を理解し、適切な応答を生成できるようになりました。これにより、チャットボットや音声アシスタントなどのアプリケーションが実用化されています。

画像認識技術も飛躍的に向上し、医療診断、自動運転、セキュリティシステムなど、様々な分野で活用されています。深層学習の発達により、従来では不可能だった複雑な問題の解決が可能になっています。

しかし、AI技術の発展には倫理的な課題も伴います。プライバシーの保護、偏見の排除、雇用への影響など、社会全体で考慮すべき問題が数多く存在します。技術の進歩と社会的責任のバランスを取ることが、持続可能なAI社会を実現するための重要な鍵となるでしょう。

今後、AI技術はさらに高度化し、人間とAIが協働する新しい社会モデルが構築されることが期待されています。教育、ヘルスケア、エンターテインメントなど、あらゆる分野でAIの活用が進み、より豊かで便利な生活が実現されるでしょう。`

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
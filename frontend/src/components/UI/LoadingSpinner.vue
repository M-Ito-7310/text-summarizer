<template>
  <div v-if="show" class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- Main Spinner -->
      <div 
        :class="[
          'animate-spin rounded-full border-4 border-solid',
          sizeClasses[size],
          colorClasses[variant]
        ]"
      />
      
      <!-- Inner Pulse (for certain variants) -->
      <div
        v-if="variant === 'pulse'"
        :class="[
          'absolute inset-2 rounded-full animate-pulse',
          innerColorClasses[variant]
        ]"
      />
      
      <!-- Dots Animation (alternative style) -->
      <div v-if="variant === 'dots'" class="flex space-x-1">
        <div
          v-for="i in 3"
          :key="i"
          :class="[
            'rounded-full animate-bounce',
            dotSizeClasses[size],
            dotColorClasses[variant]
          ]"
          :style="{ animationDelay: `${i * 0.15}s` }"
        />
      </div>
      
      <!-- Gradient Ring -->
      <div
        v-if="variant === 'gradient'"
        :class="[
          'absolute inset-0 rounded-full animate-spin',
          sizeClasses[size]
        ]"
        style="background: conic-gradient(from 0deg, transparent, #3b82f6, transparent)"
        :style="{ maskImage: 'radial-gradient(circle, transparent 50%, black 50%)' }"
      />
    </div>
    
    <!-- Loading Text -->
    <div v-if="displayText" class="ml-3 space-y-1">
      <p :class="textSizeClasses[size]" class="font-medium text-gray-900 dark:text-gray-100">
        {{ displayText }}
      </p>
      <p v-if="displaySubtext" :class="subtextSizeClasses[size]" class="text-gray-600 dark:text-gray-400">
        {{ displaySubtext }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface Props {
  show?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'pulse' | 'dots' | 'gradient'
  text?: string
  subtext?: string
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  size: 'md',
  variant: 'default'
})

const containerClass = computed(() => {
  if (props.fullscreen) {
    return 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50'
  }
  return 'p-4'
})

// Computed display text with fallback to translations
const displayText = computed(() => {
  if (props.text) return props.text
  // Default loading text based on context
  return t('components.ui.loadingSpinner.loading')
})

const displaySubtext = computed(() => {
  if (props.subtext) return props.subtext
  return undefined
})

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const colorClasses = {
  default: 'border-blue-600 border-t-transparent',
  pulse: 'border-blue-600 border-t-transparent',
  dots: 'border-transparent',
  gradient: 'border-transparent'
}

const innerColorClasses = {
  pulse: 'bg-blue-100 dark:bg-blue-900'
}

const dotSizeClasses = {
  xs: 'w-1 h-1',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4'
}

const dotColorClasses = {
  dots: 'bg-blue-600'
}

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

const subtextSizeClasses = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
}
</script>

<style scoped>
/* Custom gradient animation for the gradient variant */
.animate-spin-gradient {
  animation: spin-gradient 2s linear infinite;
}

@keyframes spin-gradient {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Staggered bounce animation for dots */
@keyframes bounce-staggered {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-staggered {
  animation: bounce-staggered 1.4s infinite ease-in-out both;
}
</style>
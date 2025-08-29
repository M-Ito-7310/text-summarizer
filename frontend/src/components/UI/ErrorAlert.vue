<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 transform -translate-y-2"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform -translate-y-2"
  >
    <div
      v-if="show && message"
      :class="[
        'rounded-lg p-4 mb-6 border shadow-sm',
        typeClasses[type]
      ]"
      role="alert"
    >
      <div class="flex items-start space-x-3">
        <!-- Icon -->
        <div class="flex-shrink-0 pt-0.5">
          <XCircle v-if="type === 'error'" class="w-5 h-5" />
          <AlertTriangle v-else-if="type === 'warning'" class="w-5 h-5" />
          <CheckCircle v-else-if="type === 'success'" class="w-5 h-5" />
          <Info v-else class="w-5 h-5" />
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 v-if="title" :class="titleClasses[type]" class="text-sm font-medium mb-1">
            {{ title }}
          </h4>
          <p :class="messageClasses[type]" class="text-sm">
            {{ message }}
          </p>
          
          <!-- Action Button -->
          <div v-if="actionText && actionHandler" class="mt-3">
            <button
              @click="actionHandler"
              :class="actionClasses[type]"
              class="text-sm font-medium hover:underline focus:outline-none focus:underline transition-all duration-200"
            >
              {{ actionText }}
            </button>
          </div>
        </div>
        
        <!-- Close Button -->
        <div v-if="dismissible" class="flex-shrink-0">
          <button
            @click="handleClose"
            :class="closeButtonClasses[type]"
            class="inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          >
            <span class="sr-only">{{ t('components.ui.accessibility.closeButton') }}</span>
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- Progress Bar (for auto-dismiss) -->
      <div
        v-if="autoDismiss && autoDismissTimeout > 0"
        class="mt-3 bg-black bg-opacity-10 rounded-full h-1 overflow-hidden"
      >
        <div
          class="h-full bg-current transition-all ease-linear"
          :style="{ 
            width: `${(1 - remainingTime / autoDismissTimeout) * 100}%`,
            transitionDuration: '100ms'
          }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { XCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface Props {
  show?: boolean
  type?: 'error' | 'warning' | 'success' | 'info'
  title?: string
  message: string
  dismissible?: boolean
  autoDismiss?: boolean
  autoDismissTimeout?: number
  actionText?: string
  actionHandler?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  type: 'error',
  dismissible: true,
  autoDismiss: true,
  autoDismissTimeout: 5000
})

const emit = defineEmits<{
  close: []
  action: []
}>()

const remainingTime = ref(props.autoDismissTimeout)
let dismissTimer: number | null = null
let countdownTimer: number | null = null

const typeClasses = {
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
}

const titleClasses = {
  error: 'text-red-800 dark:text-red-200',
  warning: 'text-amber-800 dark:text-amber-200',
  success: 'text-green-800 dark:text-green-200',
  info: 'text-blue-800 dark:text-blue-200'
}

const messageClasses = {
  error: 'text-red-700 dark:text-red-300',
  warning: 'text-amber-700 dark:text-amber-300',
  success: 'text-green-700 dark:text-green-300',
  info: 'text-blue-700 dark:text-blue-300'
}

const actionClasses = {
  error: 'text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100',
  warning: 'text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100',
  success: 'text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100',
  info: 'text-blue-800 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100'
}

const closeButtonClasses = {
  error: 'text-red-400 dark:text-red-300 hover:bg-red-500 focus:ring-red-600 focus:ring-offset-red-50',
  warning: 'text-amber-400 dark:text-amber-300 hover:bg-amber-500 focus:ring-amber-600 focus:ring-offset-amber-50',
  success: 'text-green-400 dark:text-green-300 hover:bg-green-500 focus:ring-green-600 focus:ring-offset-green-50',
  info: 'text-blue-400 dark:text-blue-300 hover:bg-blue-500 focus:ring-blue-600 focus:ring-offset-blue-50'
}

const startAutoDismiss = () => {
  if (!props.autoDismiss || !props.show) return
  
  remainingTime.value = props.autoDismissTimeout
  
  // Countdown timer for progress bar
  countdownTimer = window.setInterval(() => {
    remainingTime.value -= 100
    if (remainingTime.value <= 0) {
      clearInterval(countdownTimer!)
    }
  }, 100)
  
  // Auto dismiss timer
  dismissTimer = window.setTimeout(() => {
    handleClose()
  }, props.autoDismissTimeout)
}

const clearTimers = () => {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

const handleClose = () => {
  clearTimers()
  emit('close')
}


// Watch for show prop changes to handle auto-dismiss
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      startAutoDismiss()
    } else {
      clearTimers()
    }
  },
  { immediate: true }
)

// Watch for message changes to restart timer
watch(
  () => props.message,
  () => {
    if (props.show) {
      clearTimers()
      startAutoDismiss()
    }
  }
)

onUnmounted(() => {
  clearTimers()
})
</script>
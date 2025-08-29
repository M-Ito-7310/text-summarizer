import { App } from 'vue'
import i18n from '@/locales'

export default {
  install(app: App) {
    app.use(i18n)
  }
}
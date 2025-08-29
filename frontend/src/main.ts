import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './locales'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')

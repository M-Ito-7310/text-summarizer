import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'AI Text Analysis - TextSummarizer',
      description: 'Powerful AI-driven text summarization and keyword extraction tool'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'About - TextSummarizer',
      description: 'Learn about our AI-powered text analysis technology and features'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guards for meta tags
router.beforeEach((to, _from, next) => {
  // Update document title
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && to.meta?.description) {
    metaDescription.setAttribute('content', to.meta.description as string)
  }
  
  next()
})

export default router
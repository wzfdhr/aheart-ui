import { createSSRApp } from 'vue'
import '@aheart-ui/ai/style.css'
import { makeConsumerApp } from './app.js'

createSSRApp(makeConsumerApp()).mount('#app')
window.__d8Ready = true

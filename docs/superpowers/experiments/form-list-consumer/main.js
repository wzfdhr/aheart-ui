import { createSSRApp } from 'vue'
import 'aheart-ui/style.css'
import { makeConsumerApp } from './app.js'

createSSRApp(makeConsumerApp()).mount('#app')
window.__formListConsumerReady = true

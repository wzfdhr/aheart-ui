import { createSSRApp } from 'vue'
import '@aheart-ui/dnd/style.css'
import { createIframeCleanupProbe, makeConsumerApp } from './app.js'

const app = createSSRApp(makeConsumerApp())
app.mount('#app')
window.__d7Ready = true
window.__d7CreateIframeCleanupProbe = createIframeCleanupProbe

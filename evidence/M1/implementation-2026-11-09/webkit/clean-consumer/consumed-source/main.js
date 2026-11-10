import { createApp, createSSRApp, nextTick } from 'vue'
import { createPilotApp } from './app.js'
import 'aheart-ui/theme.css'
import 'aheart-ui/button/style.css'
import 'aheart-ui/modal/style.css'
import 'aheart-ui/select/style.css'

import './style.css'
const started = performance.now()
const factory = document.documentElement.hasAttribute('data-ssr') ? createSSRApp : createApp
factory(createPilotApp()).mount('#app')
nextTick(() => { window.__pilotReady = { hydration: document.documentElement.hasAttribute('data-ssr'), mountMilliseconds: performance.now() - started } })

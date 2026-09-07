import { makeApp } from './App.js'
import 'aheart-ui/style.css'
const dynamic = new URLSearchParams(location.search).get('dynamic') === '1'
makeApp(dynamic).mount('#app')
window.__fixtureReady = true

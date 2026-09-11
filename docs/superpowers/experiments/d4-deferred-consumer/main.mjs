import { createApp } from 'vue'
import { createConsumerApp } from './shared-app.mjs'
import 'aheart-ui/style.css'

const query = new URLSearchParams(location.search)
const settings = window.__D4_CASE__ ?? {
  component: query.get('component') || 'Tree',
  count: Number(query.get('count') || 1000),
  rowMode: query.get('rowMode') || 'fixed',
  virtual: query.get('virtual') === 'true'
}
createApp(createConsumerApp(settings)).mount('#app')
window.__d4Ready = true

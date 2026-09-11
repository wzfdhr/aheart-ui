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
document.documentElement.dataset.d4RowMode = settings.rowMode
const style = document.createElement('style')
style.textContent = `[data-d4-row-mode="coarse"] .aheart-tree__node,[data-d4-row-mode="coarse"] .aheart-cascader__option{min-block-size:44px;}[data-d4-row-mode="dynamic"] .aheart-tree__node,[data-d4-row-mode="dynamic"] .aheart-cascader__option{white-space:normal;}`
document.head.append(style)
window.__d4MountStart = performance.now()
const app = createApp(createConsumerApp(settings))
app.mount('#app')
window.__d4Unmount = () => app.unmount()
window.__d4Ready = true

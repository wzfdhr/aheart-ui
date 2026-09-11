import { createApp, nextTick } from 'vue'
import { createConsumerApp, fixtureEvidence } from './shared-app.mjs'
import 'aheart-ui/style.css'

const query = new URLSearchParams(location.search)
const settings = window.__D4_CASE__ ?? {
  component: query.get('component') || 'Tree',
  count: Number(query.get('count') || 1000),
  rowMode: query.get('rowMode') || 'fixed',
  virtual: query.get('virtual') === 'true',
  treeScenario: query.get('treeScenario') || 'flat10000',
  treeSelectScenario: query.get('treeSelectScenario') || ''
}
document.documentElement.dataset.d4RowMode = settings.rowMode
const style = document.createElement('style')
style.textContent = `[data-d4-row-mode="coarse"] .aheart-tree__node,[data-d4-row-mode="coarse"] .aheart-cascader__option{min-block-size:44px;}[data-d4-row-mode="dynamic"] .aheart-tree__node,[data-d4-row-mode="dynamic"] .aheart-cascader__option{white-space:normal;}[data-d4-row-mode="dynamic"] .aheart-tree__title{white-space:normal;}[data-d4-row-mode="dynamic"] .aheart-tree__treeitem:nth-child(10n+1) .aheart-tree__node,[data-d4-row-mode="dynamic"] .aheart-cascader__option:nth-child(10n+1){min-block-size:56px !important;}`
document.head.append(style)
window.__d4MountStart = performance.now()
window.__d4NextTick = nextTick
window.__d4EventLog = []
window.__d4FixtureEvidence = fixtureEvidence(settings.count, settings.rowMode, settings.treeScenario)
document.addEventListener('keydown', event => window.__d4EventLog.push({ name: 'keyboard', key: event.key, timestamp: performance.now() }), { capture: true })
const app = createApp(createConsumerApp(settings))
window.__d4RunLazyScenario = async () => {
  const beforeLazyEvents = window.__d4EventLog ?? []
  window.__d4EventLog = []
  window.__d4LazyAttempts = {}
  const loader = window.__d4LoadData
  if (!loader) return
  const option = { value: 'lazy-root', label: 'Lazy root', isLeaf: false }
  try { await loader(option, { signal: new AbortController().signal }) } catch {}
  try { await loader(option, { signal: new AbortController().signal }) } catch {}
  const controller = new AbortController()
  const pending = loader({ value: 'lazy-cancel', label: 'Lazy cancel', isLeaf: false }, { signal: controller.signal })
  setTimeout(() => controller.abort(), 10)
  await pending.catch(() => {})
  window.__d4EventLog = [...beforeLazyEvents, ...(window.__d4EventLog ?? [])]
}
app.mount('#app')
window.__d4Unmount = () => app.unmount()
window.__d4Ready = true

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
  treeSelectScenario: query.get('treeSelectScenario') || '',
  cascaderScenario: query.get('cascaderScenario') || ''
}
document.documentElement.dataset.d4RowMode = settings.rowMode
const style = document.createElement('style')
style.textContent = `[data-d4-row-mode="coarse"] .aheart-tree__node,[data-d4-row-mode="coarse"] .aheart-cascader__option{min-block-size:44px;}[data-d4-row-mode="dynamic"] .aheart-tree__node,[data-d4-row-mode="dynamic"] .aheart-cascader__option{white-space:normal;}[data-d4-row-mode="dynamic"] .aheart-tree__title,[data-d4-row-mode="dynamic"] .aheart-cascader__option > span{white-space:normal;line-height:1.5;inline-size:160px;max-inline-size:160px;flex:0 1 160px;overflow-wrap:anywhere;}[data-d4-row-mode="dynamic"] .aheart-tree__treeitem:nth-child(10n+1) .aheart-tree__node,[data-d4-row-mode="dynamic"] .aheart-cascader__option:nth-child(10n+1),[data-d4-row-mode="dynamic"] [data-tree-key$="-0"],[data-d4-row-mode="dynamic"] [data-tree-key$="-10"],[data-d4-row-mode="dynamic"] [data-tree-key$="-20"],[data-d4-row-mode="dynamic"] [data-cascader-value$="-0"],[data-d4-row-mode="dynamic"] [data-cascader-value$="-10"],[data-d4-row-mode="dynamic"] [data-cascader-value$="-20"]{min-block-size:56px !important;}`
document.head.append(style)
window.__d4MountStart = performance.now()
window.__d4NextTick = nextTick
window.__d4EventLog = []
window.__d4FixtureEvidence = fixtureEvidence(settings.count, settings.rowMode, settings.treeScenario)
document.addEventListener('keydown', event => window.__d4EventLog.push({ name: 'keyboard', key: event.key, timestamp: Date.now(), clockDomain: 'epoch-ms' }), { capture: true })
const app = createApp(createConsumerApp(settings))
app.mount('#app')
window.__d4Unmount = () => app.unmount()
window.__d4Ready = true

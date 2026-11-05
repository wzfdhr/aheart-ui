import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import AheartUI from 'aheart-ui'
import AheartDnd, { SortableList, Draggable, useSortable } from '@aheart-ui/dnd'
import AheartAI, { AIChatPanel, AIBubble, AIAgentWorkbench } from '@aheart-ui/ai'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const ver = (n) => JSON.parse(readFileSync(require.resolve(n + '/package.json'), 'utf8')).version
const v = { core: ver('aheart-ui'), dnd: ver('@aheart-ui/dnd'), ai: ver('@aheart-ui/ai') }
if (v.core !== '1.1.0' || v.dnd !== '1.0.0' || v.ai !== '1.0.0') throw new Error('versions ' + JSON.stringify(v))
for (const [n, c] of Object.entries({ SortableList, Draggable, useSortable, AIChatPanel, AIBubble, AIAgentWorkbench })) if (!c) throw new Error('missing ' + n)
for (const p of [AheartUI, AheartDnd, AheartAI]) if (typeof p.install !== 'function') throw new Error('plugin without install')
const app = createSSRApp({ render: () => h('div', [h(AIBubble, { message: { id: 'm1', role: 'assistant', content: 'hi-from-ai', status: 'complete' } })]) })
app.use(AheartUI).use(AheartDnd).use(AheartAI)
const html = await renderToString(app)
if (!html.includes('hi-from-ai')) throw new Error('AI SSR missing content: ' + html.slice(0, 300))
for (const n of ['aheart-ui', '@aheart-ui/dnd', '@aheart-ui/ai']) { const css = readFileSync(require.resolve(n + '/style.css'), 'utf8'); if (css.length < 1000) throw new Error(n + ' css too small') }
console.log('ESM+SSR ok', JSON.stringify(v), html.length, 'bytes html')

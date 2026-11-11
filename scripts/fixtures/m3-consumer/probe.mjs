import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { build } from 'vite'
import { createApp, createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AheartUIResolver } from 'aheart-ui/resolver'
import { aheartComponentEntries } from 'aheart-ui/constant'
import { verifyBrowser } from './browser.mjs'

const require = createRequire(import.meta.url)
const cssResolver = AheartUIResolver({ domains: ['base', 'ai', 'dnd'], importStyle: 'css' })
const jsResolver = AheartUIResolver()
assert.deepEqual(jsResolver('ACombobox'), { name: 'Combobox', from: 'aheart-ui/combobox' })
assert.deepEqual(require('aheart-ui/resolver').AheartUIResolver()('AButton'), jsResolver('AButton'))
assert.equal(jsResolver('AAISender'), undefined)
assert.equal(AheartUIResolver({ domains: ['dnd'] })('AButton'), undefined)
assert.deepEqual(cssResolver('AAIAgentWorkbench'), {
  name: 'AIAgentWorkbench',
  from: '@aheart-ui/ai/agent-workbench',
  sideEffects: ['@aheart-ui/ai/agent-workbench/style.css', '@aheart-ui/dnd/sortable/style.css']
})
for (const name of ['ATable', 'AMotionFade', 'AUnknown', 'toString']) assert.equal(cssResolver(name), undefined)

for (const entry of aheartComponentEntries) {
  const esm = await import(entry.from)
  const cjs = require(entry.from)
  const packageName = entry.from.slice(0, entry.from.lastIndexOf('/'))
  const root = await import(packageName)
  assert.ok(esm[entry.name], `${entry.from} must export ${entry.name}`)
  assert.ok(cjs[entry.name], `${entry.from} must require ${entry.name}`)
  assert.equal(esm[entry.name], root[entry.name], entry.from)
  assert.equal(cjs[entry.name], require(packageName)[entry.name], entry.from)
  const component = cssResolver(`A${entry.name}`)
  assert.deepEqual(component, { name: entry.name, from: entry.from, sideEffects: entry.styles })
  for (const style of component.sideEffects) {
    assert.ok((await readFile(require.resolve(style), 'utf8')).trim().length)
  }
}
for (const [packageName, domain] of [['@aheart-ui/ai', 'ai'], ['@aheart-ui/dnd', 'dnd']]) {
  const root = await import(packageName)
  const cjs = require(packageName)
  const legacyApp = createApp({}).use(root.default)
  const legacyCjsApp = createApp({}).use(cjs.default)
  for (const { name } of aheartComponentEntries.filter(entry => entry.domain === domain)) {
    assert.equal(legacyApp.component(`A${name}`), root[name])
    assert.equal(legacyCjsApp.component(`A${name}`), cjs[name])
  }
  assert.equal((await import(`${packageName}/full`)).default, root.default)
  assert.equal(require(`${packageName}/full`).default, cjs.default)
  assert.equal(require.resolve(`${packageName}/full.css`), require.resolve(`${packageName}/style.css`))
  assert.equal(await readFile(require.resolve(`${packageName}/style.css`), 'utf8'),
    await readFile(require.resolve(`${packageName}/lib/style.css`), 'utf8'))
}

for (const [packageName, subpath, names] of [
  ['@aheart-ui/ai', 'chat', ['AIChatPanel', 'createAIStreamReducer', 'reduceAIStreamEvent']],
  ['@aheart-ui/ai', 'agent', ['AIForm', 'AIProcess', 'AIThoughtChain', 'AI_FORM_FIELD_TYPES', 'AI_FORM_CONDITION_OPERATORS', 'validateAIFormSchema']],
  ['@aheart-ui/ai', 'workbench', ['AIAgentWorkbench']],
  ['@aheart-ui/dnd', 'sortable', ['SortableList', 'SortableItem', 'useSortable']],
  ['@aheart-ui/dnd', 'draggable', ['Draggable', 'useDraggable']],
  ['@aheart-ui/dnd', 'droppable', ['DropZone', 'useDroppable']]
]) {
  const request = `${packageName}/${subpath}`
  const scoped = await import(request)
  const root = await import(packageName)
  for (const name of names) {
    assert.ok(scoped[name], `${request} must export ${name}`)
    assert.equal(scoped[name], root[name])
    assert.ok(require(request)[name], `${request} must require ${name}`)
    assert.equal(require(request)[name], require(packageName)[name])
  }
}

const ssr = []
for (const [subpath, name, props, className] of [
  ['chat', 'AIChatPanel', { transport: { async *send() {} } }, 'aheart-ai-chat-panel'],
  ['agent', 'AIForm', { schema: { version: '1', fields: [] } }, 'aheart-ai-form'],
  ['workbench', 'AIAgentWorkbench', {}, 'aheart-ai-workbench']
]) {
  const { [name]: component } = await import(`@aheart-ui/ai/${subpath}`)
  const render = () => renderToString(createSSRApp({ render: () => h(component, props) }))
  const html = await render()
  assert.ok(html.includes(className), subpath)
  assert.equal(await render(), html, `${subpath} SSR output is not deterministic`)
  ssr.push(subpath)
}

const results = {}
const moduleId = id => id.replace(process.cwd() + path.sep, '').replaceAll(path.sep, '/')
async function bundle(name, source, plugins = []) {
  await writeFile('entry.js', source)
  const parsed = new Set()
  const rendered = new Set()
  const output = await build({
    configFile: false,
    logLevel: 'error',
    plugins: [...plugins, {
      name: 'collect-entry-boundary',
      moduleParsed(info) { parsed.add(moduleId(info.id)) },
      generateBundle(_options, assets) {
        for (const asset of Object.values(assets)) {
          if (asset.type === 'chunk') Object.keys(asset.modules).forEach(id => rendered.add(moduleId(id)))
        }
      }
    }],
    build: { write: false, rollupOptions: { input: 'entry.js' } }
  })
  const styles = (Array.isArray(output) ? output : [output]).flatMap(result => result.output)
    .filter(asset => asset.type === 'asset' && asset.fileName.endsWith('.css'))
    .map(asset => asset.source.toString()).join('\n')
  results[name] = { parsed: [...parsed].sort(), rendered: [...rendered].sort(), cssBytes: Buffer.byteLength(styles) }
  return { modules: results[name].parsed.join('\n'), styles }
}

const isolated = await bundle('resolver', "import { AheartUIResolver } from 'aheart-ui/resolver'; console.log(AheartUIResolver()('ACombobox'))")
assert.doesNotMatch(isolated.modules, /node_modules\/(vue|@vue|@aheart-ui\/)|\.vue\.js/)
assert.equal(isolated.styles, '')

for (const [subpath, component, selector] of [
  ['chat', 'AIChatPanel', 'chat-panel'],
  ['agent', 'AIForm', 'form'],
  ['sender', 'AISender', 'sender'],
  ['bubble', 'AIBubble', 'bubble']
]) {
  const result = await bundle(subpath, `import { ${component} } from '@aheart-ui/ai/${subpath}'; import '@aheart-ui/ai/${subpath}/style.css'; console.log(${component})`)
  assert.doesNotMatch(result.modules, /@aheart-ui\/dnd|agent-workbench|agent-execution/)
  assert.match(result.styles, new RegExp(`\\.aheart-ai-${selector}`))
  assert.doesNotMatch(result.styles, /aheart-ai-workbench|d8-fixture/)
}

const workbench = await bundle('workbench', "import { AIAgentWorkbench } from '@aheart-ui/ai/workbench'; import '@aheart-ui/ai/workbench/style.css'; import '@aheart-ui/dnd/sortable/style.css'; console.log(AIAgentWorkbench)")
assert.match(workbench.modules, /@aheart-ui\/dnd\/es\/sortable\/index\.js/)
assert.doesNotMatch(workbench.modules, /@aheart-ui\/dnd\/es\/(index|draggable\.vue|drop-zone\.vue)\.js/)
assert.match(workbench.styles, /aheart-ai-workbench/)
assert.match(workbench.styles, /aheart-dnd-sortable-item/)

const sortable = await bundle('sortable', "import { SortableList } from '@aheart-ui/dnd/sortable'; import '@aheart-ui/dnd/sortable/style.css'; console.log(SortableList)")
assert.doesNotMatch(sortable.modules, /@aheart-ui\/ai|@aheart-ui\/dnd\/es\/index\.js/)
assert.match(sortable.styles, /aheart-dnd-live-region/)
assert.doesNotMatch(sortable.styles, /aheart-dnd-draggable|aheart-dnd-overlay/)

for (const [subpath, component, selector] of [
  ['draggable', 'Draggable', 'draggable'],
  ['droppable', 'DropZone', 'drop-zone'],
  ['drag-overlay', 'DragOverlay', 'overlay']
]) {
  const request = `@aheart-ui/dnd/${subpath}`
  const result = await bundle(subpath, `import { ${component} } from '${request}'; import '${request}/style.css'; console.log(${component})`)
  assert.doesNotMatch(result.modules, /@aheart-ui\/ai|@aheart-ui\/dnd\/es\/(index\.js|sortable)/)
  assert.match(result.styles, new RegExp(`\\.aheart-dnd-${selector}\\b`))
  assert.doesNotMatch(result.styles, /aheart-dnd-sortable-/)
}

const jsOnly = await bundle('js-only', "import { AISender } from '@aheart-ui/ai/sender'; import { SortableList } from '@aheart-ui/dnd/sortable'; console.log(AISender, SortableList)")
assert.equal(jsOnly.styles, '')

await writeFile('Example.vue', '<template><AButton>Send</AButton><AAISender /></template>')
const automatic = await bundle('vite-resolver', "import { createApp } from 'vue'; import Example from './Example.vue'; import 'aheart-ui/theme.css'; createApp(Example).mount('#app')", [
  vue(),
  Components({ dts: false, resolvers: [cssResolver] })
])
assert.match(automatic.modules, /aheart-ui\/es\/button\/index\.js/)
assert.match(automatic.modules, /@aheart-ui\/ai\/es\/sender\/index\.js/)
assert.doesNotMatch(automatic.modules, /@aheart-ui\/dnd|agent-workbench|aheart-ui\/es\/table/)
assert.match(automatic.styles, /aheart-button/)
assert.match(automatic.styles, /aheart-ai-sender/)

await writeFile('Workbench.vue', '<template><AAIAgentWorkbench /></template>')
const automaticWorkbench = await bundle('vite-resolver-workbench', "import { createApp } from 'vue'; import Workbench from './Workbench.vue'; createApp(Workbench).mount('#app')", [
  vue(),
  Components({ dts: false, resolvers: [cssResolver] })
])
assert.match(automaticWorkbench.modules, /@aheart-ui\/dnd\/es\/sortable\/index\.js/)
assert.match(automaticWorkbench.styles, /aheart-ai-workbench/)
assert.match(automaticWorkbench.styles, /aheart-dnd-sortable-item/)
assert.doesNotMatch(automaticWorkbench.styles, /aheart-dnd-overlay|aheart-dnd-draggable/)

const browser = await verifyBrowser()
await writeFile('results.json', JSON.stringify({ status: 'passed', entries: aheartComponentEntries.length, ssr, browser, builds: results }, null, 2))

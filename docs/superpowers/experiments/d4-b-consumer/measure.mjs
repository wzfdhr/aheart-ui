import { build, preview } from 'vite'
import { renderToString } from '@vue/server-renderer'
import { makeApp } from './App.js'
import { chromium } from '@playwright/test'
import { createRequire } from 'node:module'
import { readFile, writeFile, readdir, lstat } from 'node:fs/promises'
import { gzipSync, brotliCompressSync } from 'node:zlib'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
const commonjs = require('@tanstack/vue-virtual')
assert.equal(typeof commonjs.useVirtualizer, 'function')
assert.ok(require.resolve('@tanstack/vue-virtual').includes('/dist/cjs/'))
assert.equal(typeof require('aheart-ui').Tree, 'object')
assert.equal((await lstat('node_modules/aheart-ui')).isSymbolicLink(), false)
const ssr = await renderToString(makeApp(false))
const ssrDynamic = await renderToString(makeApp(true))
assert.ok((ssr.match(/role="option"/g)||[]).length > 0)
assert.ok((ssrDynamic.match(/role="option"/g)||[]).length > 0)
const cjsVue = require('vue')
const cjsHTML = await require('@vue/server-renderer').renderToString(cjsVue.createSSRApp({setup(){
  const v = commonjs.useVirtualizer({count:10000,getScrollElement:()=>null,initialRect:{width:600,height:288},estimateSize:()=>32})
  return () => cjsVue.h('div', v.value.getVirtualItems().map(item=>cjsVue.h('span',String(item.index))))
}}))
assert.ok(cjsHTML.includes('<span>0</span>'))
const results = { environment: { node:process.version, mode:'production Vite 5.0.12', packages:{ vue:'3.5.38', tanstackVue:'3.13.36', virtualCore:'3.17.8', aheart:'packed local 1.0.0' } }, commonjs:true, cjsSSR:true, requireEntry:require.resolve('@tanstack/vue-virtual'), symlink:false, ssrRows:(ssr.match(/role="option"/g)||[]).length, ssrDynamicRows:(ssrDynamic.match(/role="option"/g)||[]).length, sizes:{}, engineModules:{}, scenarios:[] }
for (const [name,entry] of [['baseline','baseline.js'],['unused','unused.js'],['disabled','disabled.js'],['virtual','main.js']]) {
  await writeFile('index.html', '<!doctype html><html><body><div id="app">' + (name === 'virtual' ? ssr : '') + '</div><script type="module" src="/' + entry + '"></script></body></html>')
  await build({ root:process.cwd(), logLevel:'error', plugins:[{name:'record-engine-modules',generateBundle(_opts,bundle){results.engineModules[name]=Object.values(bundle).filter(item=>item.type==='chunk').flatMap(item=>Object.keys(item.modules)).filter(id=>id.includes('@tanstack')).map(id=>id.slice(id.indexOf('@tanstack')))}}], build:{outDir:'dist-'+name, emptyOutDir:true,minify:'esbuild', sourcemap:false} })
  const assets = await readdir('dist-'+name+'/assets')
  results.sizes[name]={js:{raw:0,gzip:0,brotli:0},css:{raw:0,gzip:0,brotli:0}}
  for(const asset of assets) {
    const type = asset.endsWith('.css') ? 'css' : 'js'
    const bytes=await readFile('dist-'+name+'/assets/'+asset)
    results.sizes[name][type].raw+=bytes.length
    results.sizes[name][type].gzip+=gzipSync(bytes).length
    results.sizes[name][type].brotli+=brotliCompressSync(bytes).length
  }
}
assert.deepEqual(results.sizes.baseline, results.sizes.unused)
assert.equal(results.engineModules.unused.length,0)
assert.ok(results.engineModules.virtual.length > 0)
assert.ok(results.engineModules.disabled.length > 0)
results.unusedImportTreeShaken=true
const html=await readFile('dist-virtual/index.html','utf8')
await writeFile('dist-virtual/dynamic.html',html.replace(ssr,ssrDynamic))
const server=await preview({root:process.cwd(),build:{outDir:'dist-virtual'},preview:{host:'127.0.0.1',port:0}})
const address=server.httpServer.address()
const url='http://127.0.0.1:'+address.port
const browser=await chromium.launch()
results.environment.browser=browser.version()
try {
  for(const dynamic of [false,true]) {
    const page=await browser.newPage({viewport:{width:1000,height:800}})
    const errors=[]
    page.on('pageerror',error=>errors.push(error.message))
    page.on('console',message=>{if(/hydration|mismatch|warn/i.test(message.text()))errors.push(message.text())})
    await page.goto(url+(dynamic?'/dynamic.html?dynamic=1':'/'))
    await page.waitForFunction(()=>window.__fixtureReady)
    const cdp=await page.context().newCDPSession(page)
    const heapBefore=await cdp.send('Runtime.getHeapUsage')
    const navigation=await page.evaluate(()=>({domContentLoaded:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,load:performance.getEntriesByType('navigation')[0].loadEventEnd}))
    const input=page.getByRole('combobox',{name:'Virtual items'})
    await input.focus()
    const keyStart=performance.now()
    for(let i=0;i<20;i++){
      await input.press('ArrowDown')
      await page.waitForFunction(()=>{const input=document.querySelector('[aria-label="Virtual items"]'),node=document.getElementById(input.getAttribute('aria-activedescendant'));return node&&node.getAttribute('aria-disabled')!=='true'})
    }
    const twentyArrowDownMs=performance.now()-keyStart
    assert.equal(await input.getAttribute('aria-activedescendant'),'virtual-row-21')
    await input.press('End')
    await page.waitForFunction(()=>{ const node=document.querySelector('#virtual-row-9999');if(!node)return false; const r=node.getBoundingClientRect(),v=document.querySelector('#virtual-list').getBoundingClientRect(); return r.top>=v.top-1 && r.bottom<=v.bottom+1 })
    const end=await input.getAttribute('aria-activedescendant')
    assert.equal(end,'virtual-row-9999')
    await input.press('Home')
    await page.waitForFunction(()=>document.querySelector('#virtual-list').scrollTop<2)
    const snapshot=await page.evaluate(()=>({rows:document.querySelectorAll('#virtual-list [role="option"]').length, heights:[...new Set(Array.from(document.querySelectorAll('#virtual-list [role="option"]'),n=>n.getBoundingClientRect().height))], active:document.querySelector('[aria-label="Virtual items"]').getAttribute('aria-activedescendant')}))
    assert.equal(snapshot.active,'virtual-row-0')
    assert.ok(snapshot.rows<40)
    if(dynamic)assert.ok(snapshot.heights.length>=2)
    let resizedHeights=null
    if(dynamic){
      await page.getByRole('button',{name:'Change row height'}).click()
      await page.waitForFunction(()=>document.querySelector('#virtual-row-0').getBoundingClientRect().height===80)
      await input.press('End')
      await page.waitForFunction(()=>{const r=document.querySelector('#virtual-row-9999')?.getBoundingClientRect(),v=document.querySelector('#virtual-list').getBoundingClientRect();return r&&r.top>=v.top-1&&r.bottom<=v.bottom+1})
      await input.press('Home')
      await page.waitForFunction(()=>document.querySelector('#virtual-list').scrollTop<2)
      resizedHeights=await page.locator('#virtual-list [role="option"]').evaluateAll(nodes=>[...new Set(nodes.map(node=>node.getBoundingClientRect().height))])
      assert.ok(resizedHeights.includes(80))
    }
    assert.deepEqual(errors,[])
    await page.screenshot({path:'production-'+(dynamic?'dynamic':'fixed')+'.png'})
    const heapAfter=await cdp.send('Runtime.getHeapUsage')
    results.scenarios.push({dynamic,...snapshot,resizedHeights,end,hydrationErrors:errors,navigation,twentyArrowDownMs,heapBefore,heapAfter})
    await page.close()
  }
}finally{await browser.close();await new Promise(resolve=>server.httpServer.close(resolve))}
await writeFile('results.json',JSON.stringify(results,null,2)+'\n')
console.log(JSON.stringify(results,null,2))

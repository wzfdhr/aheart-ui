import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { createPilotApp } from './app.js'
const html = await renderToString(createSSRApp(createPilotApp()))
assert.match(html, /data-pilot/)
const template = await readFile(new URL('./index.html', import.meta.url), 'utf8')
await writeFile(new URL('./ssr.html', import.meta.url), template.replace('<html lang="zh-CN">', '<html lang="zh-CN" data-ssr>').replace('<!--ssr-->', html))
console.log(JSON.stringify({ ssr: 'passed', htmlBytes: Buffer.byteLength(html) }))

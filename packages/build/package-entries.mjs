import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync(new URL('../components/src/constant/entries.json', import.meta.url), 'utf8'))

export const getComponentEntries = (domain) => manifest[domain]

export const entryInput = (entries) => Object.fromEntries([
  ['index', 'src/index.ts'],
  ...entries.filter(({ sourceEntry }) => sourceEntry)
    .map(({ subpath, sourceEntry }) => [`${subpath}/index`, sourceEntry])
])

export const runtimeExport = (output) => ({
  types: `./es/${output}.d.ts`, import: `./es/${output}.js`, require: `./lib/${output}.js`
})

export function optionalPackageExports(entries) {
  return {
    './full': runtimeExport('index'),
    './full.css': './es/style.css',
    ...Object.fromEntries(entries.flatMap(({ subpath, output, styleOutput }) => [
      [`./${subpath}`, runtimeExport(output ?? `${subpath}/index`)],
      [`./${subpath}/style.css`, `./es/${styleOutput ?? `${subpath}/style.css`}`]
    ]))
  }
}

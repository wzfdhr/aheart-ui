import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import postcss from 'postcss'

export function selectComponentStyles(css, prefix, scopes) {
  const root = postcss.parse(css)
  const isIncluded = (className) => scopes.some((scope) =>
    className === scope || className.startsWith(`${scope}__`) || className.startsWith(`${scope}--`)
  )
  root.walkRules((rule) => {
    const included = rule.selectors.filter(selector => {
      if (selector === ':root') return true
      const classes = Array.from(selector.matchAll(/\.([\w-]+)/g), ([, value]) => value)
      return classes[0]?.startsWith(prefix) && classes
        .filter(value => value.startsWith(prefix))
        .every(value => isIncluded(value.slice(prefix.length)))
    })
    if (included.length === 0) rule.remove()
    else if (included.length !== rule.selectors.length) rule.selectors = included
  })
  root.walkAtRules((rule) => {
    if (rule.nodes?.length === 0) rule.remove()
  })
  return `${root.toString().trim()}\n`
}

export function splitPackageStyles(directory, domain, entries) {
  return {
    name: `aheart-${domain}-split-styles`,
    closeBundle() {
      const css = `${readFileSync(new URL('src/style.css', directory), 'utf8').trimEnd()}\n`
      const parts = entries.filter(({ scopes }) => scopes).map(({ subpath, scopes }) =>
        [`${subpath}/style.css`, selectComponentStyles(css, `aheart-${domain}-`, scopes)]
      )

      for (const [folder, type] of [['es', 'module'], ['lib', 'commonjs']]) {
        const emit = (file, contents) => {
          const target = new URL(`${folder}/${file}`, directory)
          mkdirSync(new URL('.', target), { recursive: true })
          writeFileSync(target, contents)
        }
        emit('style.css', css)
        emit('package.json', `{\n  "type": "${type}"\n}\n`)
        for (const [file, contents] of parts) emit(file, contents)
      }
    }
  }
}

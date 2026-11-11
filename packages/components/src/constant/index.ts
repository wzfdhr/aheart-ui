import entries from './entries.json'

export type AheartDomain = 'base' | 'ai' | 'dnd'

export interface AheartComponentEntry {
  readonly domain: AheartDomain
  readonly name: string
  readonly from: string
  readonly styles: readonly string[]
}

interface ManifestEntry {
  subpath: string
  name?: string
  names?: readonly string[]
  sideEffects?: readonly string[]
}

const manifest: Record<AheartDomain, readonly ManifestEntry[]> = entries
const packageNames: Record<AheartDomain, string> = {
  base: 'aheart-ui',
  ai: '@aheart-ui/ai',
  dnd: '@aheart-ui/dnd'
}

/** Static public entries used by the resolver, without loading any Vue components. */
export const aheartComponentEntries: readonly AheartComponentEntry[] = (Object.keys(packageNames) as AheartDomain[])
  .flatMap(domain => manifest[domain].flatMap(({ subpath, name, names = [], sideEffects = [] }) => {
    const from = `${packageNames[domain]}/${subpath}`
    return (name ? [name] : names).map(name => ({
      domain,
      name,
      from,
      styles: [`${from}/style.css`, ...sideEffects]
    }))
  }))

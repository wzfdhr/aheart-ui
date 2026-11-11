import { aheartComponentEntries, type AheartDomain } from '../constant'

export interface AheartUIResolverOptions {
  domains?: readonly AheartDomain[]
  importStyle?: 'css' | false
}

export interface AheartResolvedComponent {
  name: string
  from: string
  sideEffects?: string[]
}

export function AheartUIResolver({ domains = ['base'], importStyle = false }: AheartUIResolverOptions = {}) {
  const enabled = new Set(domains)
  const entries = new Map(aheartComponentEntries
    .filter(({ domain }) => enabled.has(domain))
    .map(entry => [`A${entry.name}`, entry]))

  return (componentName: string): AheartResolvedComponent | undefined => {
    const entry = entries.get(componentName)
    if (!entry) return undefined
    return {
      name: entry.name,
      from: entry.from,
      ...(importStyle === 'css' ? { sideEffects: [...entry.styles] } : {})
    }
  }
}

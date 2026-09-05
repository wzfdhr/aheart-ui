import { nextTick, onScopeDispose, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

type TriggerAriaValue = string | undefined
type TriggerAriaAttributes = Record<`aria-${string}`, TriggerAriaValue>

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const TOKEN_ATTRIBUTES = new Set(['aria-describedby', 'aria-labelledby'])

/** Mirrors wrapper-owned popup relationships onto the actual slotted focus target. */
export const useTriggerAria = (
  rootSource: MaybeRefOrGetter<HTMLElement | null | undefined>,
  getAttributes: () => TriggerAriaAttributes
) => {
  let sequence = 0
  let target: HTMLElement | null = null
  let originals = new Map<string, string | null>()

  const restore = () => {
    if (!target) return
    for (const [name, value] of originals) {
      if (value === null) target.removeAttribute(name)
      else target.setAttribute(name, value)
    }
    target = null
    originals = new Map()
  }

  watchEffect(() => {
    const root = toValue(rootSource)
    const attributes = getAttributes()
    const currentSequence = ++sequence

    void nextTick(() => {
      if (currentSequence !== sequence) return
      const nextTarget = root?.matches(FOCUSABLE_SELECTOR)
        ? root
        : root?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? null

      if (nextTarget !== target) {
        restore()
        target = nextTarget
      }
      if (!target) return

      for (const [name, value] of Object.entries(attributes)) {
        if (!originals.has(name)) originals.set(name, target.getAttribute(name))
        const original = originals.get(name)

        if (value === undefined) {
          if (original === null) target.removeAttribute(name)
          else if (original !== undefined) target.setAttribute(name, original)
          continue
        }

        const resolvedValue = TOKEN_ATTRIBUTES.has(name) && original
          ? Array.from(new Set([...original.split(/\s+/), value])).join(' ')
          : value
        target.setAttribute(name, resolvedValue)
      }
    })
  })

  onScopeDispose(() => {
    sequence += 1
    restore()
  })
}

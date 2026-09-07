import { effectScope, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useTriggerAria } from '../use-trigger-aria'

describe('useTriggerAria', () => {
  it('mirrors relationships to the focus target and restores its original attributes', async () => {
    const root = document.createElement('span')
    const button = document.createElement('button')
    button.setAttribute('aria-describedby', 'existing-help')
    root.appendChild(button)
    const expanded = ref(false)
    const scope = effectScope()
    scope.run(() => useTriggerAria(ref(root), () => ({
      'aria-describedby': 'popup-help',
      'aria-expanded': expanded.value ? 'true' : 'false'
    })))

    await nextTick()
    expect(button.getAttribute('aria-describedby')).toBe('existing-help popup-help')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expanded.value = true
    await nextTick()
    await nextTick()
    expect(button.getAttribute('aria-expanded')).toBe('true')

    scope.stop()
    expect(button.getAttribute('aria-describedby')).toBe('existing-help')
    expect(button.hasAttribute('aria-expanded')).toBe(false)
  })

  it('does not assign focus semantics to a non-focusable wrapper', async () => {
    const root = document.createElement('span')
    root.textContent = 'Plain text'
    const scope = effectScope()
    scope.run(() => useTriggerAria(ref(root), () => ({ 'aria-controls': 'popup' })))

    await nextTick()
    expect(root.hasAttribute('aria-controls')).toBe(false)
    scope.stop()
  })
})

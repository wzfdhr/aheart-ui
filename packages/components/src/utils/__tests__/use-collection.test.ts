import { effectScope } from 'vue'
import { describe, expect, it } from 'vitest'
import { useCollection } from '../use-collection'

describe('useCollection', () => {
  it('keeps registration order and stable generated keys', () => {
    const scope = effectScope()
    const result = scope.run(() => useCollection())!
    const first = result.register({ element: document.createElement('button') })
    const second = result.register({ key: 'second', element: document.createElement('button') })

    expect(first.key).toBeTruthy()
    expect(result.items.value.map((item) => item.key)).toEqual([first.key, 'second'])
    const replacement = document.createElement('button')
    result.register({ key: 'second', element: replacement })
    expect(result.items.value.map((item) => item.key)).toEqual([first.key, 'second'])
    expect(result.getItem('second')?.element).toBe(replacement)
    result.unregister(first.key)
    expect(result.items.value.map((item) => item.key)).toEqual(['second'])
    second.unregister()
    expect(result.items.value).toHaveLength(0)
    scope.stop()
  })

  it('updates metadata and filters visible and enabled items', () => {
    const result = useCollection()
    result.register({ key: 'a', element: document.createElement('button'), visible: false })
    result.register({ key: 'b', element: document.createElement('button'), disabled: true })
    result.register({ key: 'c', element: document.createElement('button') })

    result.update('a', { visible: true })
    expect(result.isVisible('a')).toBe(true)
    expect(result.isDisabled('b')).toBe(true)
    expect(result.getVisibleItems().map((item) => item.key)).toEqual(['a', 'b', 'c'])
    expect(result.getEnabledItems().map((item) => item.key)).toEqual(['a', 'c'])
  })
})

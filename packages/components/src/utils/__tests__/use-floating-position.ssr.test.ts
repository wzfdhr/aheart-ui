// @vitest-environment node

import { effectScope, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useFloatingPosition } from '../use-floating-position'

describe('useFloatingPosition SSR', () => {
  it('stays inert when DOM globals and mounted refs are unavailable', async () => {
    expect(typeof window).toBe('undefined')

    const scope = effectScope()
    const result = scope.run(() =>
      useFloatingPosition({
        reference: ref(null),
        floating: ref(null),
        open: ref(true)
      })
    )!

    await expect(result.update()).resolves.toBeUndefined()
    expect(result.popupStyle.value).toMatchObject({ position: 'absolute', left: '0px', top: '0px' })
    scope.stop()
  })
})

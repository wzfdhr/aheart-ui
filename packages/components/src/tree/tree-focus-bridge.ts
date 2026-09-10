import type { InjectionKey, Ref } from 'vue'
import type { TreeKey } from './types'

export interface TreeFocusBridge {
  register(request: (key: TreeKey, allowExternalSource?: boolean) => void, cancel: () => void, endpoints?: (last: boolean) => TreeKey | undefined): () => void
  request(key: TreeKey, options?: { allowExternalSource?: boolean }): void
  requestEndpoint(last: boolean, options?: { allowExternalSource?: boolean }): void
  cancel(): void
}

export const treeFocusBridgeKey: InjectionKey<TreeFocusBridge> = Symbol('aheart-tree-focus-bridge')
export const treeVirtualViewportHeightKey: InjectionKey<Ref<number | undefined>> = Symbol('aheart-tree-virtual-viewport-height')

export const createTreeFocusBridge = (): TreeFocusBridge => {
  let requestImpl: ((key: TreeKey, allowExternalSource?: boolean) => void) | undefined
  let cancelImpl: (() => void) | undefined
  let endpointsImpl: ((last: boolean) => TreeKey | undefined) | undefined
  let pendingRequest: { key: TreeKey; allowExternalSource?: boolean } | undefined
  const dispatch = (key: TreeKey, options?: { allowExternalSource?: boolean }) => {
    if (requestImpl) requestImpl(key, options?.allowExternalSource)
    else pendingRequest = { key, allowExternalSource: options?.allowExternalSource }
  }
  return {
    register(request, cancel, endpoints) {
      requestImpl = request
      cancelImpl = cancel
      endpointsImpl = endpoints
      if (pendingRequest) {
        const requestValue = pendingRequest
        pendingRequest = undefined
        request(requestValue.key, requestValue.allowExternalSource)
      }
      return () => {
        if (requestImpl === request) {
          requestImpl = undefined
          cancelImpl = undefined
          endpointsImpl = undefined
        }
      }
    },
    request(key, options) {
      dispatch(key, options)
    },
    requestEndpoint(last, options) {
      const key = endpointsImpl?.(last)
      if (key !== undefined) dispatch(key, options)
    },
    cancel() {
      pendingRequest = undefined
      cancelImpl?.()
    }
  }
}

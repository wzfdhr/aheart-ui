import { computed, onBeforeUnmount, readonly, shallowRef } from 'vue'

export type AsyncTaskStatus = 'idle' | 'pending' | 'success' | 'error'

export interface AsyncTaskContext {
  signal: AbortSignal
  requestId: number
}

export interface AsyncTaskOptions<TResult> {
  onSuccess?: (result: TResult) => void
  onError?: (error: unknown) => void
}

export const useAsyncTask = <TArgs extends unknown[], TResult>(
  task: (context: AsyncTaskContext, ...args: TArgs) => Promise<TResult>,
  options: AsyncTaskOptions<TResult> = {}
) => {
  const status = shallowRef<AsyncTaskStatus>('idle')
  const data = shallowRef<TResult>()
  const error = shallowRef<unknown>()
  let requestId = 0
  let controller: AbortController | undefined

  const abort = () => {
    requestId += 1
    controller?.abort()
    controller = undefined
    if (status.value === 'pending') status.value = 'idle'
  }

  const reset = () => {
    abort()
    status.value = 'idle'
    data.value = undefined
    error.value = undefined
  }

  const run = async (...args: TArgs): Promise<TResult | undefined> => {
    controller?.abort()
    const currentController = new AbortController()
    const currentRequestId = ++requestId
    controller = currentController
    status.value = 'pending'
    error.value = undefined

    try {
      const result = await task({ signal: currentController.signal, requestId: currentRequestId }, ...args)
      if (currentController.signal.aborted || currentRequestId !== requestId) return undefined

      controller = undefined
      data.value = result
      status.value = 'success'
      options.onSuccess?.(result)
      return result
    } catch (reason) {
      if (currentController.signal.aborted || currentRequestId !== requestId) return undefined

      controller = undefined
      error.value = reason
      status.value = 'error'
      options.onError?.(reason)
      return undefined
    }
  }

  onBeforeUnmount(abort)

  return {
    status: readonly(status),
    data: readonly(data),
    error: readonly(error),
    isPending: computed(() => status.value === 'pending'),
    run,
    abort,
    reset
  }
}

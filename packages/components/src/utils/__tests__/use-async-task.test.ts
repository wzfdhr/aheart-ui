import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useAsyncTask } from '../use-async-task'

const deferred = <T,>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

const mountTask = <TArgs extends unknown[], TResult>(
  task: (context: { signal: AbortSignal; requestId: number }, ...args: TArgs) => Promise<TResult>,
  options = {}
) => {
  let api!: ReturnType<typeof useAsyncTask<TArgs, TResult>>
  const wrapper = mount(defineComponent({
    setup() {
      api = useAsyncTask(task, options)
      return () => h('div')
    }
  }))
  return { api, wrapper }
}

describe('useAsyncTask', () => {
  it('aborts the previous request and only commits the latest result', async () => {
    const first = deferred<string>()
    const second = deferred<string>()
    const signals: AbortSignal[] = []
    const { api, wrapper } = mountTask(async ({ signal }, value: string) => {
      signals.push(signal)
      return value === 'first' ? first.promise : second.promise
    })

    const firstRun = api.run('first')
    const secondRun = api.run('second')
    expect(signals[0].aborted).toBe(true)
    second.resolve('latest')
    expect(await secondRun).toBe('latest')
    first.resolve('stale')
    expect(await firstRun).toBeUndefined()
    expect(api.data.value).toBe('latest')
    expect(api.status.value).toBe('success')
    wrapper.unmount()
  })

  it('recovers from an error and clears it on the next run', async () => {
    const onError = vi.fn()
    let attempt = 0
    const { api, wrapper } = mountTask(async () => {
      attempt += 1
      if (attempt === 1) throw new Error('failed')
      return 'recovered'
    }, { onError })

    await expect(api.run()).resolves.toBeUndefined()
    expect(api.status.value).toBe('error')
    expect(api.error.value).toEqual(new Error('failed'))
    expect(onError).toHaveBeenCalledTimes(1)

    await expect(api.run()).resolves.toBe('recovered')
    expect(api.status.value).toBe('success')
    expect(api.error.value).toBeUndefined()
    wrapper.unmount()
  })

  it('ignores a late result after an explicit abort', async () => {
    const request = deferred<string>()
    const { api, wrapper } = mountTask(async () => request.promise)
    const running = api.run()
    expect(api.isPending.value).toBe(true)

    api.abort()
    request.resolve('late')
    expect(await running).toBeUndefined()
    expect(api.status.value).toBe('idle')
    expect(api.data.value).toBeUndefined()
    wrapper.unmount()
  })

  it('aborts the active task when its owner unmounts', async () => {
    const request = deferred<string>()
    let signal!: AbortSignal
    const { api, wrapper } = mountTask(async (context) => {
      signal = context.signal
      return request.promise
    })
    void api.run()
    await nextTick()

    wrapper.unmount()
    expect(signal.aborted).toBe(true)
    request.resolve('ignored')
  })

  it('reset clears committed data and invalidates pending work', async () => {
    const { api, wrapper } = mountTask(async (_context, value: string) => value)
    await api.run('ready')
    expect(api.data.value).toBe('ready')

    api.reset()
    expect(api.status.value).toBe('idle')
    expect(api.data.value).toBeUndefined()
    expect(api.error.value).toBeUndefined()
    wrapper.unmount()
  })
})

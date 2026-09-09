import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { enUS } from '../../config'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Upload from '../upload.vue'
import type { UploadFile, UploadRequestOption } from '../types'

const createFile = (name = 'report.txt') => new File(['report'], name, { type: 'text/plain' })
const selectFiles = async (input: ReturnType<ReturnType<typeof mount>['find']>, files: File[]) => {
  Object.defineProperty(input.element, 'files', { configurable: true, value: files })
  await input.trigger('change')
}

describe('Upload', () => {
  it('uses Chinese defaults and follows the runtime English locale', () => {
    const chinese = mount(Upload, {
      props: { defaultFileList: [{ uid: 'ready', name: '报告.txt', status: 'ready' }] }
    })
    expect(chinese.find('.aheart-upload__trigger').text()).toBe('选择文件')
    expect(chinese.find('.aheart-upload__start').text()).toBe('上传')

    const english = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(Upload, {
          defaultFileList: [
            { uid: 'done', name: 'report.txt', status: 'done' },
            { uid: 'error', name: 'failed.txt', status: 'error' }
          ]
        })
      }
    })
    expect(english.find('.aheart-upload__trigger').text()).toBe('Select file')
    expect(english.find('.aheart-upload__item.is-done').text()).toContain('Done')
    expect(english.find('.aheart-upload__item.is-error').text()).toContain('Failed')
    expect(english.find('.aheart-upload__remove').attributes('aria-label')).toBe('Remove report.txt')
  })

  it('owns an independent locale group instead of inferring copy from DatePicker', () => {
    const dateOnlyEnglish = mount(ConfigProvider, {
      props: { locale: { datePicker: { locale: 'en-US' } } },
      slots: { default: () => h(Upload) }
    })
    expect(dateOnlyEnglish.find('.aheart-upload__trigger').text()).toBe('选择文件')

    const uploadOverride = mount(ConfigProvider, {
      props: { locale: { upload: { selectFile: '选择附件', upload: '开始传输' } } },
      slots: {
        default: () => h(Upload, {
          defaultFileList: [{ uid: 'ready', name: '合同.pdf', status: 'ready' }]
        })
      }
    })
    expect(uploadOverride.find('.aheart-upload__trigger').text()).toBe('选择附件')
    expect(uploadOverride.find('.aheart-upload__start').text()).toBe('开始传输')
  })

  it('adds a selected file and reports a successful custom upload', async () => {
    const customRequest = vi.fn(async ({ onSuccess }: { onSuccess: (response?: unknown) => void }) => onSuccess({ ok: true }))
    const wrapper = mount(Upload, { props: { customRequest } })
    const input = wrapper.find('input[type="file"]')

    await selectFiles(input, [createFile()])

    expect(customRequest).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toMatchObject([{ name: 'report.txt', status: 'done' }])
  })

  it('emits the completed upload state for a controlled file list', async () => {
    const wrapper = mount(Upload, {
      props: {
        fileList: [],
        customRequest: async ({ onSuccess }: { onSuccess: (response?: unknown) => void }) => onSuccess({ ok: true })
      }
    })

    await selectFiles(wrapper.find('input[type="file"]'), [createFile('controlled.txt')])

    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toMatchObject([{ name: 'controlled.txt', status: 'done' }])
    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(0)
  })

  it('treats an explicitly undefined fileList as controlled', async () => {
    const wrapper = mount(Upload, { props: { fileList: undefined, defaultFileList: [{ uid: 'default', name: 'default.txt' }] } })
    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(0)

    await selectFiles(wrapper.find('input[type="file"]'), [createFile('requested.txt')])
    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toMatchObject([{ name: 'requested.txt' }])
    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(0)
  })

  it('uses defaultFileList only for initialization', async () => {
    const wrapper = mount(Upload, { props: { defaultFileList: [{ uid: 'first', name: 'first.txt' }] } })
    await wrapper.find('.aheart-upload__remove').trigger('click')
    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(0)

    await wrapper.setProps({ defaultFileList: [{ uid: 'second', name: 'second.txt' }] })
    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(0)
  })

  it('rebases an async beforeUpload result onto the latest controlled fileList', async () => {
    let allowUpload: (() => void) | undefined
    const beforeUpload = () => new Promise<boolean>((resolve) => {
      allowUpload = () => resolve(false)
    })
    const wrapper = mount(Upload, {
      props: {
        fileList: [{ uid: 'owner-a', name: 'owner-a.txt' }],
        beforeUpload
      }
    })

    const change = selectFiles(wrapper.find('input[type="file"]'), [createFile('new.txt')])
    await vi.waitFor(() => expect(allowUpload).toBeTypeOf('function'))
    await wrapper.setProps({ fileList: [{ uid: 'owner-b', name: 'owner-b.txt' }] })
    allowUpload?.()
    await change

    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0].map((file: { name: string }) => file.name))
      .toEqual(['owner-b.txt', 'new.txt'])
  })

  it('allows manual upload after beforeUpload returns false', async () => {
    const customRequest = vi.fn(async ({ onSuccess }: { onSuccess: (response?: unknown) => void }) => onSuccess())
    const wrapper = mount(Upload, { props: { beforeUpload: () => false, customRequest } })

    await selectFiles(wrapper.find('input[type="file"]'), [createFile()])
    expect(customRequest).not.toHaveBeenCalled()

    await wrapper.find('.aheart-upload__start').trigger('click')
    expect(customRequest).toHaveBeenCalledOnce()
  })

  it('starts one request when manual upload is activated repeatedly', async () => {
    const customRequest = vi.fn(() => undefined)
    const wrapper = mount(Upload, { props: { beforeUpload: () => false, customRequest } })
    await selectFiles(wrapper.find('input[type="file"]'), [createFile()])

    const start = wrapper.find('.aheart-upload__start')
    await start.trigger('click')
    await start.trigger('click')

    expect(customRequest).toHaveBeenCalledOnce()
  })

  it('preserves every file state when callback uploads finish independently', async () => {
    const completeUploads: Array<() => void> = []
    const wrapper = mount(Upload, {
      props: {
        multiple: true,
        customRequest: ({ onSuccess }: { onSuccess: () => void }) => {
          completeUploads.push(onSuccess)
        }
      }
    })

    await selectFiles(wrapper.find('input[type="file"]'), [createFile('first.txt'), createFile('second.txt')])
    completeUploads[0]()
    completeUploads[1]()

    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toMatchObject([
      { name: 'first.txt', status: 'done' },
      { name: 'second.txt', status: 'done' }
    ])
  })

  it('clears the file input while a custom upload is still pending', async () => {
    let completeUpload: (() => void) | undefined
    const wrapper = mount(Upload, {
      props: {
        customRequest: ({ onSuccess }: { onSuccess: () => void }) => new Promise<void>((resolve) => {
          completeUpload = () => {
            onSuccess()
            resolve()
          }
        })
      }
    })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { configurable: true, value: [createFile('pending.txt')] })
    Object.defineProperty(input.element, 'value', { configurable: true, writable: true, value: 'C:\\fakepath\\pending.txt' })

    const change = input.trigger('change')
    await vi.waitFor(() => expect(wrapper.emitted('update:fileList')).toBeTruthy())

    expect(input.element.value).toBe('')
    completeUpload?.()
    await change
  })

  it('emits a second same-name selection while the first custom upload is pending', async () => {
    const pendingRequests: Array<{
      file: { name: string; uid: string }
      onSuccess: () => void
      resolve: () => void
    }> = []
    const customRequest = vi.fn(({ file, onSuccess }: {
      file: { name: string; uid: string }
      onSuccess: () => void
    }) => new Promise<void>((resolve) => {
      pendingRequests.push({ file, onSuccess, resolve })
    }))
    const wrapper = mount(Upload, { props: { customRequest } })
    const input = wrapper.find('input[type="file"]')

    const firstChange = selectFiles(input, [createFile('same-name.txt')])
    await vi.waitFor(() => expect(customRequest).toHaveBeenCalledOnce())

    const secondChange = selectFiles(input, [createFile('same-name.txt')])
    await vi.waitFor(() => expect(customRequest).toHaveBeenCalledTimes(2))

    expect(pendingRequests[0].file.uid).not.toBe(pendingRequests[1].file.uid)
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject([
      { name: 'same-name.txt', status: 'uploading' },
      { name: 'same-name.txt', status: 'uploading' }
    ])

    pendingRequests.forEach(({ onSuccess, resolve }) => {
      onSuccess()
      resolve()
    })
    await Promise.all([firstChange, secondChange])
  })

  it('enforces maxCount and supports removal', async () => {
    const wrapper = mount(Upload, { props: { maxCount: 1 } })
    await selectFiles(wrapper.find('input[type="file"]'), [createFile('one.txt'), createFile('two.txt')])

    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(1)
    await wrapper.find('.aheart-upload__remove').trigger('click')
    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toEqual([])
  })

  it('does not let a rejected controlled update consume maxCount capacity', async () => {
    const parentUpdates: string[][] = []
    const wrapper = mount(Upload, {
      props: {
        fileList: [],
        maxCount: 1,
        'onUpdate:fileList': async (files) => {
          parentUpdates.push(files.map((file) => file.name))
          if (files[0]?.name === 'accepted.txt') {
            await wrapper.setProps({ fileList: files })
          }
        }
      }
    })

    const input = wrapper.find('input[type="file"]')
    await selectFiles(input, [createFile('rejected.txt')])

    expect(parentUpdates).toContainEqual(['rejected.txt'])
    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(0)

    await selectFiles(input, [createFile('accepted.txt')])

    expect(parentUpdates).toContainEqual(['accepted.txt'])
    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(1)
    expect(wrapper.find('.aheart-upload__item').text()).toContain('accepted.txt')
  })

  it('does not restore a removed file when a pending request resolves', async () => {
    let completeUpload: (() => void) | undefined
    const wrapper = mount(Upload, {
      props: {
        customRequest: ({ onSuccess }: { onSuccess: () => void }) => {
          completeUpload = onSuccess
        }
      }
    })

    await selectFiles(wrapper.find('input[type="file"]'), [createFile('pending.txt')])
    await wrapper.find('.aheart-upload__remove').trigger('click')
    completeUpload?.()

    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toEqual([])
  })

  it('aborts the transport on remove and ignores every late callback', async () => {
    let request: UploadRequestOption | undefined
    const abort = vi.fn()
    const wrapper = mount(Upload, {
      props: {
        customRequest: (options) => {
          request = options
          return { abort }
        }
      }
    })

    await selectFiles(wrapper.find('input[type="file"]'), [createFile('abort.txt')])
    expect(request?.signal.aborted).toBe(false)
    expect(request?.taskId).toMatch(/abort\.txt/)
    await wrapper.find('.aheart-upload__remove').trigger('click')
    expect(request?.signal.aborted).toBe(true)
    expect(abort).toHaveBeenCalledOnce()

    request?.onProgress(88)
    request?.onSuccess({ late: true })
    request?.onError(new Error('late'))
    request?.onCancel()
    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toEqual([])
  })

  it('cancels an active task visibly and retries with a fresh task id', async () => {
    const requests: UploadRequestOption[] = []
    const wrapper = mount(Upload, {
      props: { customRequest: (options) => { requests.push(options) } }
    })

    await selectFiles(wrapper.find('input[type="file"]'), [createFile('retry.txt')])
    expect(requests).toHaveLength(1)
    await wrapper.get('[data-upload-cancel]').trigger('click')
    expect(requests[0].signal.aborted).toBe(true)
    expect(wrapper.find('.aheart-upload__item').classes()).toContain('is-cancelled')
    expect(wrapper.emitted('cancel')).toHaveLength(1)

    await wrapper.get('[data-upload-retry]').trigger('click')
    expect(requests).toHaveLength(2)
    expect(requests[1].taskId).not.toBe(requests[0].taskId)
    requests[0].onSuccess({ stale: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.aheart-upload__item').classes()).toContain('is-uploading')
    requests[1].onProgress(42)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.aheart-upload__item').text()).toContain('42%')
    requests[1].onSuccess({ ok: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.aheart-upload__item').classes()).toContain('is-done')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('turns timeout into a retryable error and aborts the current signal', async () => {
    vi.useFakeTimers()
    try {
      let request: UploadRequestOption | undefined
      const wrapper = mount(Upload, {
        props: { timeout: 25, customRequest: (options) => { request = options } }
      })
      await selectFiles(wrapper.find('input[type="file"]'), [createFile('timeout.txt')])
      await vi.advanceTimersByTimeAsync(26)
      expect(request?.signal.aborted).toBe(true)
      expect(wrapper.find('.aheart-upload__item').classes()).toContain('is-error')
      expect(wrapper.find('.aheart-upload__item').text()).toContain('上传超时')
      expect(wrapper.find('[data-upload-retry]').exists()).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps a rejected beforeUpload validation visible without starting transport', async () => {
    const customRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: {
        beforeUpload: async () => { throw new Error('文件内容不合法') },
        customRequest
      }
    })

    await expect(selectFiles(wrapper.find('input[type="file"]'), [createFile('invalid.txt')])).resolves.toBeUndefined()
    expect(customRequest).not.toHaveBeenCalled()
    expect(wrapper.find('.aheart-upload__item').classes()).toContain('is-error')
    expect(wrapper.find('.aheart-upload__item').text()).toContain('校验失败')
    expect(wrapper.find('[data-upload-retry]').exists()).toBe(true)
  })

  it('revalidates a validation failure before retrying the transport', async () => {
    let attempts = 0
    const customRequest = vi.fn(({ onSuccess }: UploadRequestOption) => onSuccess({ ok: true }))
    const wrapper = mount(Upload, {
      props: {
        beforeUpload: async () => {
          attempts += 1
          if (attempts === 1) throw new Error('first validation failure')
          return true
        },
        customRequest
      }
    })

    await selectFiles(wrapper.find('input[type="file"]'), [createFile('revalidate.txt')])
    expect(wrapper.find('.aheart-upload__item').classes()).toContain('is-error')
    await wrapper.get('[data-upload-retry]').trigger('click')
    await vi.waitFor(() => expect(customRequest).toHaveBeenCalledOnce())
    expect(attempts).toBe(2)
    expect(wrapper.find('.aheart-upload__item').classes()).toContain('is-done')
  })

  it('invalidates a controlled task when the parent replaces the same uid', async () => {
    const requests: UploadRequestOption[] = []
    const first: UploadFile = { uid: 'same', name: 'first.txt', status: 'ready', originFile: createFile('first.txt') }
    const second: UploadFile = { uid: 'same', name: 'second.txt', status: 'ready', originFile: createFile('second.txt') }
    const wrapper = mount(Upload, {
      props: {
        fileList: [first],
        customRequest: (options) => { requests.push(options) }
      }
    })

    await wrapper.get('.aheart-upload__start').trigger('click')
    expect(requests).toHaveLength(1)
    await wrapper.setProps({ fileList: [second] })
    expect(requests[0].signal.aborted).toBe(true)
    await wrapper.get('.aheart-upload__start').trigger('click')
    expect(requests).toHaveLength(2)
    requests[0].onSuccess({ stale: true })
    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).not.toMatchObject([{ name: 'first.txt', status: 'done' }])
    requests[1].onSuccess({ ok: true })
    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toMatchObject([{ name: 'second.txt', status: 'done' }])
  })

  it('aborts all active tasks on unmount', async () => {
    let request: UploadRequestOption | undefined
    const wrapper = mount(Upload, { props: { customRequest: (options) => { request = options } } })
    await selectFiles(wrapper.find('input[type="file"]'), [createFile('unmount.txt')])
    wrapper.unmount()
    expect(request?.signal.aborted).toBe(true)
  })

  it('preserves the latest controlled metadata during progress callbacks', async () => {
    let request: UploadRequestOption | undefined
    const raw = createFile('original.txt')
    const wrapper = mount(Upload, {
      props: {
        fileList: [{ uid: 'metadata', name: 'original.txt', status: 'ready', originFile: raw }],
        customRequest: (options) => { request = options }
      }
    })
    await wrapper.get('.aheart-upload__start').trigger('click')
    const uploading = wrapper.emitted('update:fileList')?.at(-1)?.[0] as UploadFile[]
    await wrapper.setProps({ fileList: [{ ...uploading[0], name: 'renamed.txt' }] })
    request?.onProgress(55)
    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toMatchObject([{ name: 'renamed.txt', percent: 55 }])
  })

  it('still removes and invalidates a task when a transport abort handle throws', async () => {
    let request: UploadRequestOption | undefined
    const wrapper = mount(Upload, {
      props: {
        customRequest: (options) => {
          request = options
          return { abort: () => { throw new Error('transport cleanup failed') } }
        }
      }
    })
    await selectFiles(wrapper.find('input[type="file"]'), [createFile('throwing-abort.txt')])
    await expect(wrapper.get('.aheart-upload__remove').trigger('click')).resolves.toBeUndefined()
    expect(request?.signal.aborted).toBe(true)
    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(0)
  })
})

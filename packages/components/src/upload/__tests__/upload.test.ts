import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { enUS } from '../../config'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Upload from '../upload.vue'

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
})

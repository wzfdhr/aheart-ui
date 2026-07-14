import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Upload from '../upload.vue'

const createFile = (name = 'report.txt') => new File(['report'], name, { type: 'text/plain' })
const selectFiles = async (input: ReturnType<ReturnType<typeof mount>['find']>, files: File[]) => {
  Object.defineProperty(input.element, 'files', { configurable: true, value: files })
  await input.trigger('change')
}

describe('Upload', () => {
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

  it('enforces maxCount and supports removal', async () => {
    const wrapper = mount(Upload, { props: { maxCount: 1 } })
    await selectFiles(wrapper.find('input[type="file"]'), [createFile('one.txt'), createFile('two.txt')])

    expect(wrapper.findAll('.aheart-upload__item')).toHaveLength(1)
    await wrapper.find('.aheart-upload__remove').trigger('click')
    expect(wrapper.emitted('update:fileList')?.at(-1)?.[0]).toEqual([])
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

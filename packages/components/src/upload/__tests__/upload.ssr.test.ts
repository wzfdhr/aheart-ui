import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { enUS } from '../../config'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Upload from '../upload.vue'

describe('Upload SSR', () => {
  it('renders deterministically without browser globals and uses the independent locale', async () => {
    const render = () => renderToString(createSSRApp({
      render: () => h(ConfigProvider, { locale: enUS }, {
        default: () => h(Upload, {
          defaultFileList: [
            { uid: 'cancelled', name: 'cancelled.txt', status: 'cancelled' },
            { uid: 'failed', name: 'failed.txt', status: 'error', failureReason: 'timeout' }
          ]
        })
      })
    }))

    const [first, second] = await Promise.all([render(), render()])
    expect(first).toBe(second)
    expect(first).toContain('type="file"')
    expect(first).toContain('Select file')
    expect(first).toContain('Cancelled')
    expect(first).toContain('Upload timed out')
  })
})

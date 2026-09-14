import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Cascader virtual hot-path complexity', () => {
  it('uses a cached key index instead of scanning all logical options during scroll and measurement', async () => {
    const source = await readFile(resolve(process.cwd(), 'src/cascader/cascader-virtual-list.vue'), 'utf8')
    expect(source).toMatch(/const itemKeys\s*=\s*computed/)
    expect(source).toMatch(/const indexByKey\s*=\s*computed/)

    const rowsStart = source.indexOf('const rows = computed')
    const rowsEnd = source.indexOf('const contentStyle', rowsStart)
    const rowsSource = source.slice(rowsStart, rowsEnd)
    expect(rowsStart).toBeGreaterThanOrEqual(0)
    expect(rowsSource).not.toMatch(/props\.items\.map/)
    expect(rowsSource).not.toMatch(/props\.items\.findIndex/)

    const measurementStart = source.indexOf('const scheduleRowMeasurement')
    const measurementEnd = source.indexOf('const observeRect', measurementStart)
    expect(source.slice(measurementStart, measurementEnd)).not.toMatch(/props\.items\.findIndex/)

    const watcherStart = source.indexOf('watch([() => props.items')
    const watcherEnd = source.indexOf('watch(active', watcherStart)
    expect(source.slice(watcherStart, watcherEnd)).not.toMatch(/props\.items\.some/)
  })
})

import { createApp, defineComponent, h, nextTick, onMounted, ref } from 'vue'
import { Draggable, DropZone, SortableList } from '@aheart-ui/dnd'

const rowSlot = ({ item }) => h('span', { class: 'd7-row-label' }, item.label)

export const makeConsumerApp = () => defineComponent({
  name: 'D7ConsumerApp',
  setup() {
    const genericGrabCount = ref(0)
    const genericCancelCount = ref(0)
    const genericDropCount = ref(0)
    const sourceItems = ref([{ id: 'source', label: 'Source' }, { id: 'source-tail', label: 'Source tail' }])
    const targetItems = ref([{ id: 'target', label: 'Target' }])
    const stableItems = ref([{ id: 'stable-a', label: 'Stable A' }, { id: 'stable-b', label: 'Stable B' }])
    const targetReject = ref(true)
    const revision = ref('consumer-r1')
    const rejects = ref([])
    const commits = ref([])

    const state = {
      get genericGrabCount() { return genericGrabCount.value },
      get genericCancelCount() { return genericCancelCount.value },
      get genericDropCount() { return genericDropCount.value },
      get sourceIds() { return sourceItems.value.map(item => item.id) },
      get targetIds() { return targetItems.value.map(item => item.id) },
      get stableIds() { return stableItems.value.map(item => item.id) },
      get rejects() { return rejects.value },
      get commits() { return commits.value },
      get revision() { return revision.value },
      setTargetReject(value) { targetReject.value = value },
      refreshRevision(value = `consumer-${Date.now()}`) { revision.value = value },
      async settle() { await nextTick(); await nextTick() }
    }

    onMounted(() => {
      globalThis.__d7ConsumerState = state
    })

    return () => h('main', { 'data-d7-consumer': '' }, [
      h('section', { 'data-d7-generic': '' }, [
        h(Draggable, {
          data: { type: 'task', id: 'generic-task' },
          keyboard: true,
          label: 'Generic task',
          'data-d7-generic-source': '',
          onKeyboardGrab: () => { genericGrabCount.value += 1 },
          onKeyboardCancel: () => { genericCancelCount.value += 1 }
        }, { default: () => 'Generic task' }),
        h(DropZone, {
          accept: 'task',
          keyboard: true,
          label: 'Generic target',
          'data-d7-generic-target': '',
          onKeyboardDrop: () => { genericDropCount.value += 1 }
        }, { default: () => 'Generic target' })
      ]),
      h('section', { 'data-d7-controlled': '' }, [
        h(SortableList, {
          items: sourceItems.value,
          itemKey: 'id',
          group: 'controlled',
          revision: revision.value,
          label: 'Controlled source',
          itemLabel: item => item.label,
          'onUpdate:items': next => { sourceItems.value = next },
          onMoveReject: event => rejects.value.push(event),
          onMoveCommit: event => commits.value.push(event)
        }, { item: rowSlot }),
        h(SortableList, {
          items: targetItems.value,
          itemKey: 'id',
          group: 'controlled',
          revision: revision.value,
          label: 'Controlled target',
          itemLabel: item => item.label,
          'onUpdate:items': next => { if (!targetReject.value) targetItems.value = next },
          onMoveReject: event => rejects.value.push(event),
          onMoveCommit: event => commits.value.push(event)
        }, { item: rowSlot })
      ]),
      h('section', { 'data-d7-stable': '' }, [
        h(SortableList, {
          items: stableItems.value,
          itemKey: 'id',
          group: 'stable',
          revision: 'stable-r1',
          label: 'Stable keys',
          itemLabel: item => item.label,
          'onUpdate:items': next => { stableItems.value = next },
          onMoveReject: event => rejects.value.push(event),
          onMoveCommit: event => commits.value.push(event)
        }, { item: rowSlot })
      ])
    ])
  }
})

export async function createIframeCleanupProbe() {
  const frame = document.createElement('iframe')
  document.body.append(frame)
  const ownerDocument = frame.contentDocument
  if (!ownerDocument) throw new Error('iframe document unavailable')
  const host = ownerDocument.createElement('div')
  ownerDocument.body.append(host)
  const cancels = []
  const app = createApp({
    render: () => h(Draggable, {
      data: { type: 'task', id: 'iframe-task' },
      keyboard: true,
      label: 'Iframe task',
      onKeyboardCancel: event => cancels.push(event)
    })
  })
  app.mount(host)
  await nextTick()
  const source = host.firstElementChild
  if (!source || source.ownerDocument !== ownerDocument) throw new Error('iframe source unavailable')
  source.dispatchEvent(new ownerDocument.defaultView.KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  const liveRegionBeforeDetach = Boolean(ownerDocument.querySelector('.aheart-dnd-live-region'))
  frame.remove()
  await new Promise(resolve => setTimeout(resolve, 40))
  const result = {
    reason: cancels[0]?.reason,
    liveRegionBeforeDetach,
    liveRegionAfterDetach: Boolean(ownerDocument.querySelector('.aheart-dnd-live-region'))
  }
  app.unmount()
  return result
}

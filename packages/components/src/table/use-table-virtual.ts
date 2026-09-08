import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { getVirtualRange } from './virtual-rows'
import type { NormalizedTableVirtual } from './virtual-options'

export function useTableVirtual(options: Ref<NormalizedTableVirtual>, count: Ref<number>, scrollElement: Ref<HTMLElement | null>) {
  const scrollTop = ref(0)
  const measured = ref(new Map<number, number>())
  const range = computed(() => options.value.enabled ? getVirtualRange(count.value, scrollTop.value, options.value.height, options.value.estimateSize, options.value.overscan, measured.value) : { start: 0, end: count.value, top: 0, bottom: 0 })
  const onScroll = () => { scrollTop.value = scrollElement.value?.scrollTop ?? 0 }
  const setMeasured = (index: number, height: number) => { if (height > 0) { const next = new Map(measured.value); next.set(index, height); measured.value = next } }
  onMounted(() => scrollElement.value?.addEventListener('scroll', onScroll, { passive: true }))
  onBeforeUnmount(() => scrollElement.value?.removeEventListener('scroll', onScroll))
  return { range, scrollTop, measured, setMeasured, onScroll }
}

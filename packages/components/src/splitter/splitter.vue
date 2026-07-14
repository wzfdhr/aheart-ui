<script lang="ts">
import {
  Comment,
  cloneVNode,
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  Text,
  type CSSProperties,
  type PropType,
  type VNode
} from 'vue'
import { usePointerDrag } from '../utils/use-pointer-drag'
import { resizeAdjacentPanels, resolveSplitterSizes } from './solver'
import type { SplitterLayout, SplitterPanelConstraint, SplitterSize } from './types'
import './style.css'

const splitterProps = {
  sizes: Array as PropType<SplitterSize[]>,
  defaultSizes: {
    type: Array as PropType<SplitterSize[]>,
    default: () => []
  },
  layout: {
    type: String as PropType<SplitterLayout>,
    default: 'horizontal'
  },
  lazy: Boolean
} as const

export default defineComponent({
  name: 'ASplitter',
  props: splitterProps,
  emits: {
    'update:sizes': (sizes: number[]) => Array.isArray(sizes),
    resizeStart: (sizes: number[]) => Array.isArray(sizes),
    resize: (sizes: number[]) => Array.isArray(sizes),
    resizeEnd: (sizes: number[]) => Array.isArray(sizes)
  },
  setup(props, { emit, slots }) {
    const rootRef = ref<HTMLElement | null>(null)
    const containerSize = ref(0)
    const innerSizes = ref<SplitterSize[]>([...props.defaultSizes])
    const pendingSizes = ref<number[] | null>(null)
    const dragState = ref<{ handleIndex: number; startX: number; startY: number; sizes: number[] } | null>(null)
    let resizeObserver: ResizeObserver | undefined

    const panelNodes = computed(() => (slots.default?.() ?? []).filter((node) => node.type !== Comment && node.type !== Text))
    const panelConstraints = computed<SplitterPanelConstraint[]>(() =>
      panelNodes.value.map((node) => {
        const panel = (node.props ?? {}) as SplitterPanelConstraint
        return { min: panel.min, max: panel.max }
      })
    )
    const sourceSizes = computed<SplitterSize[]>(() => {
      const configured = props.sizes ?? innerSizes.value
      return panelNodes.value.map((_, index) => configured[index] ?? 'auto')
    })
    const solverContainerSize = computed<number>(() => {
      if (containerSize.value > 0) return containerSize.value
      return sourceSizes.value.reduce<number>((total, size) => total + (typeof size === 'number' ? size : 0), 0)
    })
    const resolvedSizes = computed(() =>
      pendingSizes.value ??
      resolveSplitterSizes({
        containerSize: solverContainerSize.value,
        sizes: sourceSizes.value,
        panels: panelConstraints.value
      })
    )
    const isHorizontal = computed(() => props.layout === 'horizontal')

    const updateContainerSize = () => {
      const root = rootRef.value
      containerSize.value = root ? (isHorizontal.value ? root.clientWidth : root.clientHeight) : 0
    }

    const emitSizes = (sizes: number[]) => {
      if (props.sizes === undefined) {
        innerSizes.value = sizes
      }

      emit('update:sizes', sizes)
      emit('resize', sizes)
    }

    const applyResize = (handleIndex: number, delta: number, shouldEmit: boolean) => {
      const startSizes = dragState.value?.sizes ?? resolvedSizes.value
      const nextSizes = resizeAdjacentPanels({
        sizes: startSizes,
        panels: panelConstraints.value,
        handleIndex,
        delta
      })

      pendingSizes.value = nextSizes
      if (shouldEmit) emitSizes(nextSizes)
      return nextSizes
    }

    const { isDragging, start: startPointerDrag } = usePointerDrag({
      cursor: () => (isHorizontal.value ? 'col-resize' : 'row-resize'),
      onMove: (event) => {
        const state = dragState.value
        if (!state) return
        const delta = isHorizontal.value ? event.clientX - state.startX : event.clientY - state.startY
        applyResize(state.handleIndex, delta, !props.lazy)
      },
      onEnd: (reason) => {
        const nextSizes = pendingSizes.value
        if (reason === 'end' && nextSizes && props.lazy) emitSizes(nextSizes)
        if (reason === 'end' && nextSizes) emit('resizeEnd', nextSizes)
        pendingSizes.value = null
        dragState.value = null
      }
    })

    const handlePointerDown = (event: PointerEvent, handleIndex: number) => {
      dragState.value = {
        handleIndex,
        startX: event.clientX,
        startY: event.clientY,
        sizes: [...resolvedSizes.value]
      }
      startPointerDrag(event)

      if (!isDragging.value) {
        dragState.value = null
        return
      }

      emit('resizeStart', resolvedSizes.value)
    }

    const handleKeydown = (event: KeyboardEvent, handleIndex: number) => {
      const increaseKey = isHorizontal.value ? 'ArrowRight' : 'ArrowDown'
      const decreaseKey = isHorizontal.value ? 'ArrowLeft' : 'ArrowUp'
      if (event.key !== increaseKey && event.key !== decreaseKey) return

      event.preventDefault()
      const delta = (event.key === increaseKey ? 1 : -1) * (event.shiftKey ? 50 : 10)
      const nextSizes = applyResize(handleIndex, delta, true)
      pendingSizes.value = null
      emit('resizeEnd', nextSizes)
    }

    const panelStyle = (index: number): CSSProperties => {
      const rawSize = sourceSizes.value[index]
      if (rawSize === 'auto' && containerSize.value === 0) {
        return { flex: '1 1 0' }
      }

      return {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: `${resolvedSizes.value[index] ?? 0}px`
      }
    }

    onMounted(() => {
      updateContainerSize()
      if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
        resizeObserver = new ResizeObserver(updateContainerSize)
        resizeObserver.observe(rootRef.value)
      }
    })
    onBeforeUnmount(() => resizeObserver?.disconnect())

    return () => {
      const children: VNode[] = []

      panelNodes.value.forEach((panel, index) => {
        children.push(cloneVNode(panel, { style: [panel.props?.style, panelStyle(index)] }))

        if (index >= panelNodes.value.length - 1) return
        const size = resolvedSizes.value[index] ?? 0
        const bounds = panelConstraints.value[index] ?? {}
        children.push(
          h('div', {
            class: ['aheart-splitter__handle', `aheart-splitter__handle--${props.layout}`],
            role: 'separator',
            tabindex: 0,
            'aria-orientation': isHorizontal.value ? 'vertical' : 'horizontal',
            'aria-valuenow': Math.round(size),
            'aria-valuemin': bounds.min ?? 0,
            'aria-valuemax': bounds.max,
            onPointerdown: (event: PointerEvent) => handlePointerDown(event, index),
            onKeydown: (event: KeyboardEvent) => handleKeydown(event, index)
          })
        )
      })

      return h(
        'div',
        {
          ref: rootRef,
          class: ['aheart-splitter', `aheart-splitter--${props.layout}`]
        },
        children
      )
    }
  }
})
</script>

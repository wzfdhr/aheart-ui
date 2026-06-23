import { computed, defineComponent, ref, type PropType, type Ref, type VNodeChild } from 'vue'
import type { TypographyCopyable, TypographyCopyableConfig } from './types'

const getCopyableConfig = (copyable: TypographyCopyable | undefined): TypographyCopyableConfig | undefined => {
  if (!copyable) {
    return undefined
  }

  return typeof copyable === 'object' ? copyable : {}
}

const toText = (value: unknown) => {
  if (value === undefined || value === null || value === false) {
    return undefined
  }

  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined
}

export const TypographyRenderNode = defineComponent({
  name: 'ATypographyRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(props) {
    return () => props.node
  }
})

export const useTypographyCopyable = (
  copyable: Ref<TypographyCopyable | undefined>,
  contentRef: Ref<HTMLElement | null>,
  disabled: Ref<boolean>
) => {
  const copied = ref(false)
  const copyableConfig = computed(() => getCopyableConfig(copyable.value))
  const isCopyable = computed(() => Boolean(copyableConfig.value))
  const copyTabIndex = computed(() => copyableConfig.value?.tabIndex ?? 0)

  const copyIcon = computed<VNodeChild>(() => {
    const icon = copyableConfig.value?.icon

    if (Array.isArray(icon)) {
      return copied.value ? icon[1] : icon[0]
    }

    return icon ?? (copied.value ? 'copied' : 'copy')
  })

  const copyTitle = computed(() => {
    const tooltips = copyableConfig.value?.tooltips

    if (tooltips === false) {
      return undefined
    }

    const title = Array.isArray(tooltips) ? (copied.value ? tooltips[1] : tooltips[0]) : copied.value ? 'Copied' : 'Copy'
    return toText(title)
  })

  const resolveCopyText = async () => {
    const text = copyableConfig.value?.text

    if (typeof text === 'function') {
      return text()
    }

    return text ?? contentRef.value?.textContent ?? ''
  }

  const writeClipboardText = async (text: string) => {
    if (copyableConfig.value?.format === 'text/html' && navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([text], { type: 'text/html' })
        })
      ])
      return
    }

    await navigator.clipboard?.writeText?.(text)
  }

  const handleCopy = async (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isCopyable.value || disabled.value) {
      return
    }

    const text = await resolveCopyText()
    await writeClipboardText(text)
    copied.value = true
    copyableConfig.value?.onCopy?.(event)
  }

  return {
    copied,
    isCopyable,
    copyIcon,
    copyTitle,
    copyTabIndex,
    handleCopy
  }
}

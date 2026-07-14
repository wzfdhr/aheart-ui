<template>
  <button
    ref="switchRef"
    class="aheart-switch"
    :class="switchClass"
    :style="rootStyle"
    type="button"
    role="switch"
    :aria-checked="mergedChecked ? 'true' : 'false'"
    :aria-busy="loading ? 'true' : undefined"
    :disabled="isDisabled || loading"
    @click="handleClick"
  >
    <span :class="indicatorClass" :style="indicatorStyle" aria-hidden="true">
      <AIcon v-if="loading" name="loading" :size="12" spin />
    </span>
    <span :class="contentClass" :style="contentStyle">
      <slot v-if="mergedChecked" name="checkedChildren">
        <ASwitchRenderNode :node="checkedChildren" />
      </slot>
      <slot v-else name="unCheckedChildren">
        <ASwitchRenderNode :node="unCheckedChildren" />
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { usePropPresence } from '../utils/use-prop-presence'
import AIcon from '../icon/icon.vue'
import { switchEmits, switchProps } from './types'
import './style.css'

defineOptions({
  name: 'ASwitch'
})

const props = defineProps(switchProps)
const emit = defineEmits(switchEmits)
const config = useAheartConfig()
const switchRef = ref<HTMLButtonElement>()
const internalChecked = ref(props.defaultChecked ?? props.defaultValue ?? false)

const ASwitchRenderNode = defineComponent({
  name: 'ASwitchRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const hasModelValue = usePropPresence('modelValue', 'model-value')
const hasChecked = usePropPresence('checked')
const hasValue = usePropPresence('value')
const isControlled = computed(() => hasModelValue.value || hasChecked.value || hasValue.value)
const mergedChecked = computed(() => hasModelValue.value
  ? Boolean(props.modelValue)
  : hasChecked.value
    ? Boolean(props.checked)
    : hasValue.value
      ? Boolean(props.value)
      : internalChecked.value)

const switchClass = computed(() => [
  `aheart-switch--${resolvedSize.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-checked': mergedChecked.value,
    'is-loading': props.loading,
    'is-disabled': isDisabled.value
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const indicatorClass = computed(() => ['aheart-switch__handle', props.classNames?.indicator])
const indicatorStyle = computed(() => props.styles?.indicator)
const contentClass = computed(() => ['aheart-switch__label', props.classNames?.content])
const contentStyle = computed(() => props.styles?.content)

const handleClick = (event: MouseEvent) => {
  if (isDisabled.value || props.loading) {
    return
  }

  const checked = !mergedChecked.value
  if (!isControlled.value) {
    internalChecked.value = checked
  }

  emit('update:modelValue', checked)
  emit('update:checked', checked)
  emit('update:value', checked)
  emit('change', checked, event)
  emit('click', checked, event)
}

const focus = () => {
  switchRef.value?.focus()
}

const blur = () => {
  switchRef.value?.blur()
}

onMounted(() => {
  if (props.autoFocus) {
    nextTick(focus)
  }
})

defineExpose({
  focus,
  blur,
  nativeElement: switchRef
})
</script>

<template>
  <div class="aheart-tabs" :class="tabsClass" :style="rootStyle">
    <div :class="navClass" :style="navStyle">
      <span v-if="hasLeftExtra" :class="extraLeftClass" :style="extraLeftStyle">
        <slot name="extraLeft">
          <ARenderNode :node="leftExtraContent" />
        </slot>
      </span>
      <div :class="navListClass" :style="navListStyle" role="tablist">
        <button
          v-for="item in normalizedItems"
          :id="getTabId(item.key)"
          :key="item.key"
          class="aheart-tabs__tab"
          :class="getTabClass(item)"
          :style="getTabStyle(item)"
          type="button"
          role="tab"
          :aria-selected="item.key === mergedActiveKey ? 'true' : 'false'"
          :aria-controls="getPanelId(item.key)"
          :disabled="item.disabled"
          :tabindex="item.key === mergedActiveKey ? 0 : -1"
          @click="handleTabClick(item, $event)"
        >
          <span v-if="hasRenderable(item.icon)" :class="tabIconClass" :style="tabIconStyle" aria-hidden="true">
            <ARenderNode :node="item.icon" />
          </span>
          <span :class="tabLabelClass" :style="tabLabelStyle">
            <ARenderNode :node="item.label" />
          </span>
        </button>
      </div>
      <span v-if="hasRightExtra" :class="extraRightClass" :style="extraRightStyle">
        <slot name="extraRight">
          <ARenderNode :node="rightExtraContent" />
        </slot>
      </span>
    </div>
    <div
      v-if="activeItem"
      :id="getPanelId(activeItem.key)"
      :class="panelClass"
      :style="panelStyle"
      role="tabpanel"
      :aria-labelledby="getTabId(activeItem.key)"
    >
      <slot v-if="activeSlotName" :name="activeSlotName">
        <ARenderNode :node="activeItem.children" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, watch, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { tabsEmits, tabsProps, type TabItem, type TabsExtraContent, type TabsExtraContentConfig } from './types'
import './style.css'

defineOptions({
  name: 'ATabs'
})

const ARenderNode = defineComponent({
  name: 'ATabsRenderNode',
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

const hasRenderable = (value: VNodeChild | undefined) => value !== undefined && value !== null && value !== false

const props = defineProps(tabsProps)
const emit = defineEmits(tabsEmits)
const config = useAheartConfig()

const normalizedItems = computed(() => props.items ?? [])
const firstEnabledKey = computed(() => {
  return normalizedItems.value.find((item) => !item.disabled)?.key ?? normalizedItems.value[0]?.key
})

const innerActiveKey = ref(props.defaultActiveKey ?? firstEnabledKey.value)
const isControlled = computed(() => props.activeKey !== undefined)

const mergedActiveKey = computed(() => {
  return props.activeKey ?? innerActiveKey.value ?? firstEnabledKey.value
})

const activeItem = computed(() => normalizedItems.value.find((item) => item.key === mergedActiveKey.value))
const activeSlotName = computed(() => (activeItem.value ? `tab-${activeItem.value.key}` : undefined))
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const positionPlacementMap = {
  left: 'start',
  right: 'end',
  top: 'top',
  bottom: 'bottom'
} as const
const resolvedPlacement = computed(() => props.tabPlacement ?? (props.tabPosition ? positionPlacementMap[props.tabPosition] : 'top'))
const animatedInkBar = computed(() => (typeof props.animated === 'object' ? props.animated.inkBar === true : props.animated))
const animatedTabPane = computed(() => (typeof props.animated === 'object' ? props.animated.tabPane === true : props.animated))
const isExtraContentConfig = (value: TabsExtraContent | undefined): value is TabsExtraContentConfig => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && ('left' in value || 'right' in value)
}
const extraContentConfig = computed<TabsExtraContentConfig>(() => {
  if (isExtraContentConfig(props.tabBarExtraContent)) {
    return props.tabBarExtraContent
  }

  return props.tabBarExtraContent !== undefined ? { right: props.tabBarExtraContent } : {}
})
const leftExtraContent = computed(() => extraContentConfig.value.left)
const rightExtraContent = computed(() => extraContentConfig.value.right)
const hasLeftExtra = computed(() => hasRenderable(leftExtraContent.value))
const hasRightExtra = computed(() => hasRenderable(rightExtraContent.value))

const tabsClass = computed(() => [
  `aheart-tabs--${props.type}`,
  `aheart-tabs--${resolvedSize.value}`,
  `aheart-tabs--placement-${resolvedPlacement.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-centered': props.centered,
    'is-ink-bar-animated': animatedInkBar.value,
    'is-tab-pane-animated': animatedTabPane.value
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const navClass = computed(() => ['aheart-tabs__nav', props.classNames?.nav])
const navStyle = computed(() => [props.tabBarStyle, props.styles?.nav])
const navListClass = computed(() => ['aheart-tabs__nav-list', props.classNames?.navList])
const navListStyle = computed(() => [
  props.tabBarGutter !== undefined ? { '--aheart-tabs-gutter': `${props.tabBarGutter}px` } : undefined,
  props.styles?.navList
])
const tabIconClass = computed(() => ['aheart-tabs__tab-icon', props.classNames?.tabIcon])
const tabIconStyle = computed(() => props.styles?.tabIcon)
const tabLabelClass = computed(() => ['aheart-tabs__tab-label', props.classNames?.tabLabel])
const tabLabelStyle = computed(() => props.styles?.tabLabel)
const panelClass = computed(() => ['aheart-tabs__panel', props.classNames?.panel])
const panelStyle = computed(() => props.styles?.panel)
const extraLeftClass = computed(() => ['aheart-tabs__extra', 'aheart-tabs__extra--left', props.classNames?.extra, props.classNames?.extraLeft])
const extraLeftStyle = computed(() => [props.styles?.extra, props.styles?.extraLeft])
const extraRightClass = computed(() => ['aheart-tabs__extra', 'aheart-tabs__extra--right', props.classNames?.extra, props.classNames?.extraRight])
const extraRightStyle = computed(() => [props.styles?.extra, props.styles?.extraRight])

watch(
  () => props.items,
  () => {
    if (!mergedActiveKey.value || !normalizedItems.value.some((item) => item.key === mergedActiveKey.value)) {
      innerActiveKey.value = firstEnabledKey.value
    }
  },
  { deep: true }
)

const getTabId = (key: string) => `aheart-tab-${key}`
const getPanelId = (key: string) => `aheart-tab-panel-${key}`

const getTabClass = (item: TabItem) => [
  props.classNames?.tab,
  props.indicator?.align ? `aheart-tabs__tab--indicator-${props.indicator.align}` : undefined,
  {
    'is-active': item.key === mergedActiveKey.value,
    [String(props.classNames?.activeTab)]: item.key === mergedActiveKey.value && props.classNames?.activeTab
  }
]

const getTabStyle = (item: TabItem) => [
  props.indicator?.size !== undefined ? { '--aheart-tabs-indicator-size': `${props.indicator.size}px` } : undefined,
  props.styles?.tab,
  item.key === mergedActiveKey.value ? props.styles?.activeTab : undefined
]

const handleTabClick = (item: TabItem, event: MouseEvent) => {
  if (item.disabled) {
    return
  }

  emit('tabClick', item.key, event)

  if (item.key === mergedActiveKey.value) {
    return
  }

  if (!isControlled.value) {
    innerActiveKey.value = item.key
  }

  emit('update:activeKey', item.key)
  emit('change', item.key)
}
</script>

<template>
  <section class="aheart-card" :class="cardClass" :style="rootStyle" role="region">
    <div v-if="$slots.cover" :class="coverClass" :style="coverStyle">
      <slot name="cover" />
    </div>
    <div v-if="hasHeader" :class="headerClass" :style="headerStyle">
      <div :class="titleClass" :style="titleStyle">
        <slot name="title">
          <ARenderNode :node="title" />
        </slot>
      </div>
      <div v-if="hasExtra" :class="extraClass" :style="extraStyle">
        <slot name="extra">
          <ARenderNode :node="extra" />
        </slot>
      </div>
    </div>
    <div v-if="hasTabs" :class="tabRootClass" :style="tabRootStyle">
      <div :class="tabListClass" :style="tabListStyle" role="tablist">
        <button
          v-for="tab in tabList"
          :id="getTabId(tab.key)"
          :key="tab.key"
          class="aheart-card__tab"
          :class="getTabClass(tab)"
          :style="getTabStyle(tab)"
          type="button"
          role="tab"
          :aria-selected="tab.key === mergedActiveTabKey ? 'true' : 'false'"
          :aria-controls="getTabPanelId(tab.key)"
          :disabled="tab.disabled"
          :tabindex="tab.key === mergedActiveTabKey ? 0 : -1"
          @click="handleTabClick(tab)"
        >
          <span class="aheart-card__tab-label" :class="tabLabelClass" :style="tabLabelStyle">
            <ARenderNode :node="tab.tab" />
          </span>
        </button>
      </div>
      <div v-if="hasTabExtra" :class="tabExtraClass" :style="tabExtraStyle">
        <slot name="tabBarExtraContent">
          <ARenderNode :node="tabBarExtraContent" />
        </slot>
      </div>
    </div>
    <div
      :id="activeTabPanelId"
      :class="bodyClass"
      :style="bodyStyleValue"
      :role="hasTabs ? 'tabpanel' : undefined"
      :aria-labelledby="activeTabId"
    >
      <div v-if="loading" class="aheart-card__loading" aria-busy="true" aria-live="polite">
        <span class="aheart-card__loading-line" />
        <span class="aheart-card__loading-line" />
        <span class="aheart-card__loading-line is-short" />
      </div>
      <slot v-else-if="hasActiveTabSlot" :name="activeTabSlotName" />
      <ARenderNode v-else-if="hasActiveTabChildren" :node="activeTabChildren" />
      <slot v-else />
    </div>
    <div v-if="showActions" :class="actionsClass" :style="actionsStyle">
      <slot name="actions">
        <span v-for="(action, index) in actions" :key="index" class="aheart-card__action">
          <ARenderNode :node="action" />
        </span>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, useSlots, watch, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { cardEmits, cardProps, type CardTab } from './types'
import './style.css'

defineOptions({
  name: 'ACard'
})

const props = defineProps(cardProps)
const emit = defineEmits(cardEmits)
const slots = useSlots()
const config = useAheartConfig()

const ARenderNode = defineComponent({
  name: 'ACardRenderNode',
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

const hasRenderable = (value: VNodeChild | undefined) => value !== undefined && value !== null && value !== false && value !== ''
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const hasHeader = computed(() => Boolean(slots.title) || hasRenderable(props.title) || Boolean(slots.extra) || hasRenderable(props.extra))
const hasExtra = computed(() => Boolean(slots.extra) || hasRenderable(props.extra))
const isBorderless = computed(() => {
  if (props.variant) {
    return props.variant === 'borderless'
  }

  return !props.bordered
})
const showActions = computed(() => Boolean(slots.actions) || Boolean(props.actions?.length))
const tabList = computed(() => props.tabList ?? [])
const hasTabs = computed(() => tabList.value.length > 0)
const firstEnabledTabKey = computed(() => tabList.value.find((tab) => !tab.disabled)?.key ?? tabList.value[0]?.key)
const innerActiveTabKey = ref(props.defaultActiveTabKey ?? firstEnabledTabKey.value)
const isActiveTabControlled = computed(() => props.activeTabKey !== undefined)
const mergedActiveTabKey = computed(() => props.activeTabKey ?? innerActiveTabKey.value ?? firstEnabledTabKey.value)
const activeTab = computed(() => tabList.value.find((tab) => tab.key === mergedActiveTabKey.value))
const activeTabSlotName = computed(() => (activeTab.value ? `tab-${activeTab.value.key}` : undefined))
const activeTabId = computed(() => (activeTab.value ? getTabId(activeTab.value.key) : undefined))
const activeTabPanelId = computed(() => (activeTab.value ? getTabPanelId(activeTab.value.key) : undefined))
const hasActiveTabSlot = computed(() => Boolean(activeTabSlotName.value && slots[activeTabSlotName.value]))
const activeTabChildren = computed(() => activeTab.value?.children)
const hasActiveTabChildren = computed(() => hasRenderable(activeTabChildren.value))
const hasTabExtra = computed(() => Boolean(slots.tabBarExtraContent) || hasRenderable(props.tabBarExtraContent))

const cardClass = computed(() => [
  `aheart-card--${resolvedSize.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-borderless': isBorderless.value,
    'aheart-card--inner': props.type === 'inner',
    'is-hoverable': props.hoverable,
    'is-loading': props.loading
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const coverClass = computed(() => ['aheart-card__cover', props.classNames?.cover])
const coverStyle = computed(() => props.styles?.cover)
const headerClass = computed(() => ['aheart-card__header', props.classNames?.header])
const headerStyle = computed(() => [props.headStyle, props.styles?.header])
const titleClass = computed(() => ['aheart-card__title', props.classNames?.title])
const titleStyle = computed(() => props.styles?.title)
const extraClass = computed(() => ['aheart-card__extra', props.classNames?.extra])
const extraStyle = computed(() => props.styles?.extra)
const bodyClass = computed(() => ['aheart-card__body', props.classNames?.body])
const bodyStyleValue = computed(() => [props.bodyStyle, props.styles?.body])
const actionsClass = computed(() => ['aheart-card__actions', props.classNames?.actions])
const actionsStyle = computed(() => props.styles?.actions)
const tabRootClass = computed(() => [
  'aheart-card__tabs',
  props.tabProps?.className,
  props.tabProps?.rootClassName,
  props.tabProps?.classNames?.root
])
const tabRootStyle = computed(() => [props.tabProps?.style, props.tabProps?.styles?.root])
const tabListClass = computed(() => ['aheart-card__tab-list', props.tabProps?.classNames?.list])
const tabListStyle = computed(() => [
  props.tabProps?.tabBarGutter !== undefined
    ? {
        '--aheart-card-tab-gutter': `${props.tabProps.tabBarGutter}px`
      }
    : undefined,
  props.tabProps?.styles?.list
])
const tabLabelClass = computed(() => props.tabProps?.classNames?.tabLabel)
const tabLabelStyle = computed(() => props.tabProps?.styles?.tabLabel)
const tabExtraClass = computed(() => ['aheart-card__tab-extra', props.tabProps?.classNames?.extra])
const tabExtraStyle = computed(() => props.tabProps?.styles?.extra)

watch(
  tabList,
  () => {
    if (!mergedActiveTabKey.value || !tabList.value.some((tab) => tab.key === mergedActiveTabKey.value)) {
      innerActiveTabKey.value = props.defaultActiveTabKey ?? firstEnabledTabKey.value
    }
  },
  { deep: true }
)

const getTabId = (key: string) => `aheart-card-tab-${key}`
const getTabPanelId = (key: string) => `aheart-card-tab-panel-${key}`

const getTabClass = (tab: CardTab) => [
  props.tabProps?.classNames?.tab,
  tab.key === mergedActiveTabKey.value ? props.tabProps?.classNames?.activeTab : undefined,
  {
    'is-active': tab.key === mergedActiveTabKey.value,
    'is-disabled': tab.disabled
  }
]

const getTabStyle = (tab: CardTab) => [
  props.tabProps?.styles?.tab,
  tab.key === mergedActiveTabKey.value ? props.tabProps?.styles?.activeTab : undefined
]

const handleTabClick = (tab: CardTab) => {
  if (tab.disabled || tab.key === mergedActiveTabKey.value) {
    return
  }

  if (!isActiveTabControlled.value) {
    innerActiveTabKey.value = tab.key
  }

  emit('update:activeTabKey', tab.key)
  emit('tabChange', tab.key)
}
</script>

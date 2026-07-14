<script setup lang="ts">
import { h, ref } from 'vue'

const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
const switchBasic = ref(true)
const switchText = ref(true)
const switchCheckedAlias = ref(true)
const switchValueAlias = ref(true)
</script>

# Switch 开关 <span class="aheart-status aheart-status--ready">Ready</span>

Switch toggles a boolean setting with semantic `role="switch"` output.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch v-model="switchBasic" />
    <ASwitch />
  </ASpace>
</div>

```vue
<template>
  <ASwitch v-model="checked" />
</template>
```

## 文案与加载

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch v-model="switchText" checked-children="On" un-checked-children="Off" />
    <ASwitch loading />
  </ASpace>
</div>

```vue
<template>
  <ASwitch v-model="checked" checked-children="On" un-checked-children="Off" />
  <ASwitch loading />
</template>
```

## 别名与默认值

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch v-model:checked="switchCheckedAlias" checked-children="Checked" un-checked-children="Unchecked" />
    <ASwitch v-model:value="switchValueAlias" checked-children="Value" />
    <ASwitch default-checked checked-children="Default" un-checked-children="Off" />
  </ASpace>
</div>

```vue
<template>
  <ASwitch v-model:checked="checked" />
  <ASwitch v-model:value="enabled" />
  <ASwitch default-checked />
</template>
```

## 自定义内容

<div class="aheart-demo-panel">
  <ASwitch default-checked>
    <template #checkedChildren>1</template>
    <template #unCheckedChildren>0</template>
  </ASwitch>
</div>

```vue
<template>
  <ASwitch v-model="checked">
    <template #checkedChildren>1</template>
    <template #unCheckedChildren>0</template>
  </ASwitch>
</template>
```

## 渲染节点内容

<div class="aheart-demo-panel">
  <ASwitch
    default-checked
    :checked-children="checkedNode"
    :un-checked-children="uncheckedNode"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <ASwitch
    v-model="checked"
    :checked-children="checkedNode"
    :un-checked-children="uncheckedNode"
  />
</template>
```

## 焦点控制

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch ref="switchRef" auto-focus />
    <AButton size="small" @click="switchRef?.focus()">Focus</AButton>
    <AButton size="small" @click="switchRef?.blur()">Blur</AButton>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
</script>

<template>
  <ASwitch ref="switchRef" auto-focus />
  <AButton @click="switchRef?.focus()">Focus</AButton>
  <AButton @click="switchRef?.blur()">Blur</AButton>
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ASwitch
    default-checked
    class-name="demo-switch"
    root-class-name="demo-switch-root"
    :style="{ width: '72px' }"
    :class-names="{ root: 'demo-switch-semantic-root', indicator: 'demo-switch-indicator', content: 'demo-switch-content' }"
    :styles="{ indicator: { boxShadow: '0 0 0 2px rgba(22, 119, 255, 0.2)' }, content: { fontWeight: 600 } }"
    checked-children="On"
    un-checked-children="Off"
  />
</div>

```vue
<template>
  <ASwitch
    v-model="checked"
    class-name="demo-switch"
    root-class-name="demo-switch-root"
    :style="{ width: '72px' }"
    :class-names="{ root: 'demo-switch-semantic-root', indicator: 'demo-switch-indicator', content: 'demo-switch-content' }"
    :styles="{ indicator: { boxShadow: '0 0 0 2px rgba(22, 119, 255, 0.2)' }, content: { fontWeight: 600 } }"
  />
</template>
```

## 全局配置

<div class="aheart-demo-panel">
  <AConfigProvider size="small" disabled>
    <ASwitch />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="small" disabled>
    <ASwitch />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否开启 | `boolean` | `false` |
| checked | 是否开启，Ant 风格受控别名；优先级低于 `modelValue`、高于 `value` | `boolean` | - |
| value | 是否开启，Ant 风格受控别名；受控优先级最低 | `boolean` | - |
| defaultChecked | 非受控初始开启状态 | `boolean` | - |
| defaultValue | 非受控初始开启状态别名 | `boolean` | - |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| loading | 是否加载中 | `boolean` | `false` |
| size | 开关尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| autoFocus | 是否自动获取焦点 | `boolean` | `false` |
| checkedChildren | 开启时内容 | `VNodeChild` | - |
| unCheckedChildren | 关闭时内容 | `VNodeChild` | - |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'content' \| 'indicator', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'content' \| 'indicator', StyleValue>>` | - |

## Methods

| 名称 | 说明 |
| --- | --- |
| focus() | 聚焦根按钮元素 |
| blur() | 移除根按钮元素焦点 |
| nativeElement | 根按钮元素 |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 开关状态变化时触发 | `(checked: boolean) => void` |
| update:checked | 开关状态变化时触发，配合 `checked` 使用 | `(checked: boolean) => void` |
| update:value | 开关状态变化时触发，配合 `value` 使用 | `(checked: boolean) => void` |
| change | 开关状态变化时触发 | `(checked: boolean, event: MouseEvent) => void` |
| click | 点击开关时触发 | `(checked: boolean, event: MouseEvent) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| checkedChildren | 开启时内容 |
| unCheckedChildren | 关闭时内容 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根按钮元素 |
| indicator | 开关圆点 |
| content | 开启或关闭内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-text-secondary`
- `--aheart-motion-duration`

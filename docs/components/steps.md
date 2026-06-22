# Steps 步骤条 <span class="aheart-status aheart-status--ready">Ready</span>

Steps communicates progress through a multi-step workflow.

## 基础用法

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :items="[
      { title: 'Finished', description: 'This step is complete.' },
      { title: 'In Progress', description: 'This step is active.' },
      { title: 'Waiting', description: 'This step is upcoming.' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    :current="1"
    :items="[
      { title: 'Finished', description: 'This step is complete.' },
      { title: 'In Progress', description: 'This step is active.' },
      { title: 'Waiting', description: 'This step is upcoming.' }
    ]"
  />
</template>
```

## 垂直方向

<div class="aheart-demo-panel">
  <ASteps
    direction="vertical"
    size="small"
    :current="1"
    :items="[
      { title: 'Account', description: 'Create the account.' },
      { title: 'Billing', description: 'Add billing details.' },
      { title: 'Confirm', description: 'Review and publish.' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    direction="vertical"
    size="small"
    :current="1"
    :items="[
      { title: 'Account', description: 'Create the account.' },
      { title: 'Billing', description: 'Add billing details.' },
      { title: 'Confirm', description: 'Review and publish.' }
    ]"
  />
</template>
```

## 错误状态

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :items="[
      { title: 'Account' },
      { title: 'Billing', status: 'error', description: 'Payment method was declined.' },
      { title: 'Confirm', disabled: true }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    :current="1"
    :items="[
      { title: 'Account' },
      { title: 'Billing', status: 'error', description: 'Payment method was declined.' },
      { title: 'Confirm', disabled: true }
    ]"
  />
</template>
```

## 类型变体

<div class="aheart-demo-panel aheart-demo-stack">
  <ASteps
    type="navigation"
    :current="1"
    :items="[
      { title: 'Draft' },
      { title: 'Review' },
      { title: 'Publish' }
    ]"
  />
  <ASteps
    type="panel"
    :current="1"
    :items="[
      { title: 'Account', content: 'Collect the profile details.' },
      { title: 'Billing', content: 'Confirm the payment method.' },
      { title: 'Confirm', content: 'Review before publishing.' }
    ]"
  />
  <ASteps
    type="inline"
    :current="1"
    :items="[
      { title: 'Queued', subTitle: '09:00' },
      { title: 'Running', subTitle: 'Now' },
      { title: 'Done' }
    ]"
  />
</div>

```vue
<template>
  <ASteps type="navigation" :current="1" :items="steps" />
  <ASteps type="panel" :current="1" :items="stepsWithContent" />
  <ASteps type="inline" :current="1" :items="inlineSteps" />
</template>
```

## 标题位置

<div class="aheart-demo-panel">
  <ASteps
    type="dot"
    orientation="vertical"
    title-placement="vertical"
    :initial="3"
    :current="1"
    :items="[
      { title: 'Create', description: 'Start from display number 3.' },
      { title: 'Process', description: 'The active item keeps zero-based current.' },
      { title: 'Finish', description: 'Display numbering is offset only.' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    type="dot"
    orientation="vertical"
    title-placement="vertical"
    :initial="3"
    :current="1"
    :items="steps"
  />
</template>
```

## 进度与内容

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :percent="65"
    :items="[
      { title: 'Profile', icon: 'A', subTitle: 'Ready', content: 'Profile fields are complete.' },
      { title: 'Billing', subTitle: '65%', description: 'Payment verification is running.', content: 'Waiting for provider confirmation.' },
      { title: 'Confirm', icon: 'C', subTitle: 'Next' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    :current="1"
    :percent="65"
    :items="[
      { title: 'Profile', icon: 'A', subTitle: 'Ready', content: 'Profile fields are complete.' },
      { title: 'Billing', subTitle: '65%', description: 'Payment verification is running.', content: 'Waiting for provider confirmation.' },
      { title: 'Confirm', icon: 'C', subTitle: 'Next' }
    ]"
  />
</template>
```

## 语义样式

<div class="aheart-demo-panel">
  <ASteps
    root-class-name="steps-semantic-demo"
    :current="1"
    :class-names="{ activeItem: 'steps-semantic-demo__active', connector: 'steps-semantic-demo__connector' }"
    :styles="{
      root: { maxWidth: '720px' },
      item: { minWidth: '160px' },
      activeItem: { fontWeight: 700 },
      connector: { backgroundColor: 'var(--aheart-color-primary)' }
    }"
    :items="[
      { title: 'Configured', description: 'Root and item hooks are available.' },
      { title: 'Styled', description: 'The active item receives a dedicated hook.' },
      { title: 'Connected', description: 'Connector is a real semantic element.' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    root-class-name="steps-semantic-demo"
    :current="1"
    :class-names="{ activeItem: 'steps-semantic-demo__active', connector: 'steps-semantic-demo__connector' }"
    :styles="{ activeItem: { fontWeight: 700 }, connector: { backgroundColor: 'var(--aheart-color-primary)' } }"
    :items="steps"
  />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 步骤项目 | `StepItem[]` | `[]` |
| current | 当前步骤索引，从 0 开始 | `number` | `0` |
| status | 当前步骤状态 | `wait` \| `process` \| `finish` \| `error` | `process` |
| direction | 排列方向 | `horizontal` \| `vertical` | `horizontal` |
| orientation | Ant 兼容方向别名，传入时优先于 `direction` | `horizontal` \| `vertical` | - |
| size | 步骤尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| type | 步骤类型 | `default` \| `dot` \| `navigation` \| `panel` \| `inline` | `default` |
| titlePlacement | 标题位置 | `horizontal` \| `vertical` | `horizontal` |
| initial | 显示序号的起始值，不影响 `current` | `number` | `1` |
| percent | 当前 `process` 步骤的进度百分比，自动限制在 `0..100` | `number` | - |
| className | 根元素 class | `string` | - |
| rootClassName | 根元素 class | `string` | - |
| style | 根元素样式 | `StyleValue` | - |
| classNames | 语义 DOM class 映射 | `Partial<Record<StepsSemanticPart, string>>` | - |
| styles | 语义 DOM style 映射 | `Partial<Record<StepsSemanticPart, StyleValue>>` | - |

### StepItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | - |
| description | 描述 | `string` | - |
| status | 自定义步骤状态 | `wait` \| `process` \| `finish` \| `error` | 自动计算 |
| disabled | 是否禁用点击 | `boolean` | `false` |
| icon | 自定义图标文本 | `string` | - |
| subTitle | 标题旁的辅助文本 | `string` | - |
| content | 额外内容，适合 `panel` 或详情步骤 | `string` | - |

### StepsSemanticPart

| 值 | 说明 |
| --- | --- |
| root | 根元素 |
| item | 每个步骤项 |
| activeItem | 当前步骤项 |
| button | 步骤按钮 |
| indicator | 图标容器 |
| icon | 图标内容 |
| content | 文本内容容器 |
| title | 标题 |
| subTitle | 辅助标题 |
| description | 描述 |
| connector | 连接线 |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 点击可用的非当前步骤时触发 | `(current: number) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-control-height`

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

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 步骤项目 | `StepItem[]` | `[]` |
| current | 当前步骤索引，从 0 开始 | `number` | `0` |
| status | 当前步骤状态 | `wait` \| `process` \| `finish` \| `error` | `process` |
| direction | 排列方向 | `horizontal` \| `vertical` | `horizontal` |
| size | 步骤尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |

### StepItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | - |
| description | 描述 | `string` | - |
| status | 自定义步骤状态 | `wait` \| `process` \| `finish` \| `error` | 自动计算 |
| disabled | 是否禁用点击 | `boolean` | `false` |

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

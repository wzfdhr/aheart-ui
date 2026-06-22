# Tabs 标签页 <span class="aheart-status aheart-status--ready">Ready</span>

Tabs switch between related panels while keeping the surrounding page context stable.

## 基础用法

<div class="aheart-demo-panel">
  <ATabs
    :items="[
      { key: 'overview', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', label: 'Settings', children: 'Settings panel' },
      { key: 'disabled', label: 'Disabled', children: 'Disabled panel', disabled: true }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    :items="[
      { key: 'overview', label: 'Overview', children: 'Overview panel' },
      { key: 'settings', label: 'Settings', children: 'Settings panel' },
      { key: 'disabled', label: 'Disabled', children: 'Disabled panel', disabled: true }
    ]"
  />
</template>
```

## 卡片样式

<div class="aheart-demo-panel">
  <ATabs
    type="card"
    default-active-key="metrics"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary metrics' },
      { key: 'metrics', label: 'Metrics', children: 'Usage and conversion data' },
      { key: 'logs', label: 'Logs', children: 'Recent activity logs' }
    ]"
  />
</div>

```vue
<template>
  <ATabs
    type="card"
    default-active-key="metrics"
    :items="[
      { key: 'summary', label: 'Summary', children: 'Summary metrics' },
      { key: 'metrics', label: 'Metrics', children: 'Usage and conversion data' },
      { key: 'logs', label: 'Logs', children: 'Recent activity logs' }
    ]"
  />
</template>
```

## 全局尺寸

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <ATabs
      centered
      :items="[
        { key: 'first', label: 'First', children: 'First panel' },
        { key: 'second', label: 'Second', children: 'Second panel' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large">
    <ATabs
      centered
      :items="[
        { key: 'first', label: 'First', children: 'First panel' },
        { key: 'second', label: 'Second', children: 'Second panel' }
      ]"
    />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 标签页项目 | `TabItem[]` | `[]` |
| activeKey | 当前激活项，受控模式 | `string` | - |
| defaultActiveKey | 默认激活项，非受控模式 | `string` | 首个可用项 |
| type | 标签页样式 | `line` \| `card` | `line` |
| size | 标签页尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| centered | 标签是否居中 | `boolean` | `false` |

### TabItem

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string` | - |
| label | 标签文本 | `string` | - |
| children | 面板文本内容 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:activeKey | 激活项变化时触发 | `(key: string) => void` |
| change | 激活项变化时触发 | `(key: string) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| tab-{key} | 自定义指定 key 的面板内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-color-fill`
- `--aheart-control-height`

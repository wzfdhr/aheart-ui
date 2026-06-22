# Switch 开关 <span class="aheart-status aheart-status--ready">Ready</span>

Switch toggles a boolean setting with semantic `role="switch"` output.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch :model-value="true" />
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
    <ASwitch :model-value="true" checked-children="On" un-checked-children="Off" />
    <ASwitch loading />
  </ASpace>
</div>

```vue
<template>
  <ASwitch v-model="checked" checked-children="On" un-checked-children="Off" />
  <ASwitch loading />
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
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| loading | 是否加载中 | `boolean` | `false` |
| size | 开关尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| checkedChildren | 开启时内容 | `string` | - |
| unCheckedChildren | 关闭时内容 | `string` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 开关状态变化时触发 | `(checked: boolean) => void` |
| change | 开关状态变化时触发 | `(checked: boolean) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-text-secondary`
- `--aheart-motion-duration`

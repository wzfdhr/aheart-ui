# ConfigProvider 全局配置 <span class="aheart-status aheart-status--ready">Ready</span>

ConfigProvider provides shared configuration for Aheart UI components, including global size, disabled state, locale text, and local theme token overrides.

## 基础用法

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <div class="aheart-demo-row">
      <AButton>Default</AButton>
      <AButton type="primary">Primary</AButton>
    </div>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large">
    <AButton>Default</AButton>
    <AButton type="primary">Primary</AButton>
  </AConfigProvider>
</template>
```

## 禁用状态

<div class="aheart-demo-panel">
  <AConfigProvider disabled>
    <div class="aheart-demo-row">
      <AButton>Disabled</AButton>
      <AButton type="primary">Disabled Primary</AButton>
    </div>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider disabled>
    <AButton>Disabled</AButton>
    <AButton type="primary">Disabled Primary</AButton>
  </AConfigProvider>
</template>
```

## Theme Tokens

<div class="aheart-demo-panel">
  <AConfigProvider :theme="{ primaryColor: '#0958d9', borderRadius: '4px' }">
    <AButton type="primary">Custom Theme</AButton>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider :theme="{ primaryColor: '#0958d9', borderRadius: '4px' }">
    <AButton type="primary">Custom Theme</AButton>
  </AConfigProvider>
</template>
```

## 国际化

组件默认使用简体中文。通过根导出的 `enUS` 切换整棵子树的内置文案；内层 Provider 可以只覆盖一个字段，其余字段继续继承外层 locale。

```vue
<script setup lang="ts">
import { enUS } from 'aheart-ui'
</script>

<template>
  <AConfigProvider :locale="enUS">
    <APagination :total="42" show-total />
    <AModal open title="Delete item">This dialog uses English actions.</AModal>
  </AConfigProvider>

  <AConfigProvider :locale="enUS">
    <AConfigProvider :locale="{ modal: { okText: 'Proceed' } }">
      <AModal open title="Nested override" />
    </AConfigProvider>
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 全局组件尺寸 | `large` \| `middle` \| `small` | `middle` |
| disabled | 全局禁用状态 | `boolean` | `false` |
| locale | 组件内置文案，支持 `empty`、`pagination`、`modal` 和 `table` namespace | `AheartLocale` | `zhCN` |
| theme | 局部主题 token 覆盖 | `AheartTheme` | `{}` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 需要接收配置的组件内容 |

## Theme Token Fields

`theme` currently supports:

- `primaryColor`
- `primaryHoverColor`
- `successColor`
- `warningColor`
- `dangerColor`
- `infoColor`
- `textColor`
- `textSecondaryColor`
- `borderColor`
- `fillColor`
- `backgroundColor`
- `borderRadius`
- `fontSize`

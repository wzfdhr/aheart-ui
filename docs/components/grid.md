# Grid 栅格 <span class="aheart-status aheart-status--ready">Ready</span>

Grid provides a 24-column responsive layout system with `ARow` and `ACol`.

## 基础用法

<div class="aheart-demo-panel">
  <ARow>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
    <ACol :span="8"><div class="aheart-grid-demo-cell">col-8</div></ACol>
  </ARow>
</div>

```vue
<template>
  <ARow>
    <ACol :span="8">col-8</ACol>
    <ACol :span="8">col-8</ACol>
    <ACol :span="8">col-8</ACol>
  </ARow>
</template>
```

## 区块间隔

<div class="aheart-demo-panel">
  <ARow :gutter="[16, 16]">
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
    <ACol :span="12"><div class="aheart-grid-demo-cell">col-12</div></ACol>
  </ARow>
</div>

```vue
<template>
  <ARow :gutter="[16, 16]">
    <ACol :span="12">col-12</ACol>
    <ACol :span="12">col-12</ACol>
  </ARow>
</template>
```

## 对齐与排序

<div class="aheart-demo-panel">
  <ARow justify="center" align="middle" :gutter="12">
    <ACol :span="6" :order="2"><div class="aheart-grid-demo-cell">order-2</div></ACol>
    <ACol :span="6" :order="1" :offset="2"><div class="aheart-grid-demo-cell">offset-2</div></ACol>
  </ARow>
</div>

```vue
<template>
  <ARow justify="center" align="middle" :gutter="12">
    <ACol :span="6" :order="2">order-2</ACol>
    <ACol :span="6" :order="1" :offset="2">offset-2</ACol>
  </ARow>
</template>
```

## Flex 填充

<div class="aheart-demo-panel">
  <ARow :gutter="12">
    <ACol :flex="120"><div class="aheart-grid-demo-cell">120px</div></ACol>
    <ACol flex="auto"><div class="aheart-grid-demo-cell">auto</div></ACol>
  </ARow>
</div>

```vue
<template>
  <ARow :gutter="12">
    <ACol :flex="120">120px</ACol>
    <ACol flex="auto">auto</ACol>
  </ARow>
</template>
```

## 响应式

<div class="aheart-demo-panel">
  <ARow :gutter="{ xs: 8, md: 16, xl: 24 }">
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8 }">
      <div class="aheart-grid-demo-cell">responsive</div>
    </ACol>
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8, offset: 4 }">
      <div class="aheart-grid-demo-cell">responsive</div>
    </ACol>
  </ARow>
</div>

```vue
<template>
  <ARow :gutter="{ xs: 8, md: 16, xl: 24 }">
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8 }">responsive</ACol>
    <ACol :xs="24" :md="{ span: 12 }" :xl="{ span: 8, offset: 4 }">responsive</ACol>
  </ARow>
</template>
```

## Row API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 栅格间隔 | `number` \| `[GridGutter, GridGutter]` \| `GridResponsiveGutter` | `0` |
| justify | 水平排列方式 | `start` \| `end` \| `center` \| `space-around` \| `space-between` \| `space-evenly` | - |
| align | 垂直对齐方式 | `top` \| `middle` \| `bottom` \| `stretch` | - |
| wrap | 是否自动换行 | `boolean` | `true` |

## Col API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 栅格占位格数 | `number` | - |
| offset | 栅格左侧间隔格数 | `number` | - |
| order | 栅格顺序 | `number` | - |
| pull | 栅格向左移动格数 | `number` | - |
| push | 栅格向右移动格数 | `number` | - |
| flex | flex 布局填充 | `string` \| `number` | - |
| xs | `<576px` 响应式配置 | `number` \| `ColSpanConfig` | - |
| sm | `≥576px` 响应式配置 | `number` \| `ColSpanConfig` | - |
| md | `≥768px` 响应式配置 | `number` \| `ColSpanConfig` | - |
| lg | `≥992px` 响应式配置 | `number` \| `ColSpanConfig` | - |
| xl | `≥1200px` 响应式配置 | `number` \| `ColSpanConfig` | - |
| xxl | `≥1600px` 响应式配置 | `number` \| `ColSpanConfig` | - |

### ColSpanConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 栅格占位格数 | `number` | - |
| offset | 栅格左侧间隔格数 | `number` | - |
| order | 栅格顺序 | `number` | - |
| pull | 栅格向左移动格数 | `number` | - |
| push | 栅格向右移动格数 | `number` | - |
| flex | flex 布局填充 | `string` \| `number` | - |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`

<style>
.aheart-grid-demo-cell {
  min-height: 36px;
  padding: 8px 12px;
  color: #fff;
  text-align: center;
  background: var(--aheart-color-primary);
  border-radius: var(--aheart-radius-sm);
}
</style>

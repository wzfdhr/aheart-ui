# Button 按钮 <span class="aheart-status aheart-status--ready">Ready</span>

Button is used to trigger an action. It supports Ant-style visual type, danger, ghost, shape, anchor rendering, loading, disabled, block, and native button type.

## 基础用法

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton>默认按钮</AButton>
    <AButton type="primary">主要按钮</AButton>
    <AButton type="dashed">虚线按钮</AButton>
    <AButton type="link">链接按钮</AButton>
    <AButton type="text">文本按钮</AButton>
    <AButton type="success">成功按钮</AButton>
    <AButton type="warning">警告按钮</AButton>
    <AButton type="danger">危险按钮</AButton>
  </div>
</div>

```vue
<template>
  <Button>默认按钮</Button>
  <Button type="primary">主要按钮</Button>
  <Button type="dashed">虚线按钮</Button>
  <Button type="link">链接按钮</Button>
  <Button type="text">文本按钮</Button>
  <Button type="success">成功按钮</Button>
  <Button type="warning">警告按钮</Button>
  <Button type="danger">危险按钮</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## 尺寸

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton size="large">Large</AButton>
    <AButton>Normal</AButton>
    <AButton size="small">Small</AButton>
    <AButton size="mini">Mini</AButton>
  </div>
</div>

```vue
<template>
  <Button size="large">Large</Button>
  <Button>Normal</Button>
  <Button size="small">Small</Button>
  <Button size="mini">Mini</Button>
</template>
```

## 状态

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton disabled>Disabled</AButton>
    <AButton type="primary" loading>Loading</AButton>
    <AButton round>Round</AButton>
    <AButton danger>Danger</AButton>
    <AButton type="primary" ghost>Ghost</AButton>
  </div>
</div>

```vue
<template>
  <Button disabled>Disabled</Button>
  <Button type="primary" loading>Loading</Button>
  <Button round>Round</Button>
  <Button danger>Danger</Button>
  <Button type="primary" ghost>Ghost</Button>
</template>
```

## 形状与链接

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton shape="round">Round</AButton>
    <AButton shape="circle">i</AButton>
    <AButton href="https://ant.design" target="_blank" type="link">Ant Design</AButton>
  </div>
</div>

```vue
<template>
  <Button shape="round">Round</Button>
  <Button shape="circle">i</Button>
  <Button href="https://ant.design" target="_blank" type="link">Ant Design</Button>
</template>
```

## 图标

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton icon="+">Create</AButton>
    <AButton icon=">" icon-placement="end">Next</AButton>
    <AButton icon-position="end">
      <template #icon>
        <span>^</span>
      </template>
      Open
    </AButton>
  </div>
</div>

```vue
<template>
  <Button icon="+">Create</Button>
  <Button icon=">" icon-placement="end">Next</Button>
  <Button icon-position="end">
    <template #icon>
      <span>^</span>
    </template>
    Open
  </Button>
</template>
```

## 延迟加载

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton type="primary" :loading="{ delay: 300 }">Delayed loading</AButton>
    <AButton loading>
      <template #loadingIcon>
        <span>...</span>
      </template>
      Custom loading
    </AButton>
  </div>
</div>

```vue
<template>
  <Button type="primary" :loading="{ delay: 300 }">Delayed loading</Button>
  <Button loading>
    <template #loadingIcon>
      <span>...</span>
    </template>
    Custom loading
  </Button>
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <AButton
    icon="setting"
    class-name="demo-button-class"
    root-class-name="demo-button-root"
    :style="{ minWidth: '180px' }"
    :class-names="{ root: 'demo-button-semantic-root', icon: 'demo-button-icon', content: 'demo-button-content' }"
    :styles="{ icon: { color: 'var(--aheart-color-primary)' }, content: { fontWeight: 600 } }"
  >
    Configure
  </AButton>
</div>

```vue
<template>
  <Button
    icon="setting"
    class-name="demo-button-class"
    root-class-name="demo-button-root"
    :style="{ minWidth: '180px' }"
    :class-names="{ root: 'demo-button-semantic-root', icon: 'demo-button-icon', content: 'demo-button-content' }"
    :styles="{ icon: { color: 'var(--aheart-color-primary)' }, content: { fontWeight: 600 } }"
  >
    Configure
  </Button>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `default` \| `primary` \| `dashed` \| `link` \| `text` \| `success` \| `warning` \| `danger` | `default` |
| size | 按钮尺寸 | `large` \| `normal` \| `small` \| `mini` | `normal` |
| nativeType | 原生按钮类型 | `button` \| `submit` \| `reset` | `button` |
| htmlType | Ant 风格原生按钮类型别名，优先于 `nativeType` | `button` \| `submit` \| `reset` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中，支持延迟显示 | `boolean` \| `{ delay?: number }` | `false` |
| block | 是否块级显示 | `boolean` | `false` |
| danger | 设置危险按钮状态 | `boolean` | `false` |
| ghost | 设置幽灵按钮状态 | `boolean` | `false` |
| shape | 按钮形状 | `default` \| `circle` \| `round` | `default` |
| icon | 图标名称，渲染为 `AIcon` | `string` | - |
| iconPlacement | 图标位置 | `start` \| `end` | `start` |
| iconPosition | 图标位置兼容别名 | `start` \| `end` | - |
| href | 设置后渲染为链接按钮 | `string` | - |
| target | 链接目标 | `string` | - |
| round | 是否圆角按钮，等价于 `shape="round"` | `boolean` | `false` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'icon' \| 'content', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'icon' \| 'content', StyleValue>>` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发，禁用或加载中不会触发 | `(event: MouseEvent) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| icon | 自定义图标区域 |
| loadingIcon | 自定义加载图标 |
| default | 按钮内容 |

## Theme Tokens

Button uses the global Aheart UI CSS variables, including:

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-radius`
- `--aheart-motion-duration`

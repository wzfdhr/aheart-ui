# Button 按钮 <span class="aheart-status aheart-status--ready">已完成</span>

Button 用于触发操作。它支持 Ant 风格的视觉类型、危险态、幽灵态、形状、链接渲染、加载、禁用、块级宽度和原生按钮类型。

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
    <AButton size="large">大按钮</AButton>
    <AButton>默认按钮</AButton>
    <AButton size="small">小按钮</AButton>
    <AButton size="mini">迷你按钮</AButton>
  </div>
</div>

```vue
<template>
  <Button size="large">大按钮</Button>
  <Button>默认按钮</Button>
  <Button size="small">小按钮</Button>
  <Button size="mini">迷你按钮</Button>
</template>
```

## 状态

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton disabled>禁用</AButton>
    <AButton type="primary" loading>加载中</AButton>
    <AButton block>块级按钮</AButton>
    <AButton round>圆角按钮</AButton>
    <AButton danger>危险态</AButton>
    <AButton type="primary" ghost>幽灵按钮</AButton>
  </div>
</div>

```vue
<template>
  <Button disabled>禁用</Button>
  <Button type="primary" loading>加载中</Button>
  <Button block>块级按钮</Button>
  <Button round>圆角按钮</Button>
  <Button danger>危险态</Button>
  <Button type="primary" ghost>幽灵按钮</Button>
</template>
```

## 颜色与变体

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton color="primary" variant="solid">Solid</AButton>
    <AButton color="danger" variant="filled">Filled</AButton>
    <AButton color="success" variant="outlined">Outlined</AButton>
    <AButton color="warning" variant="dashed">Dashed</AButton>
    <AButton color="geekblue" variant="text">Text</AButton>
    <AButton color="purple" variant="link">Link</AButton>
  </div>
</div>

```vue
<template>
  <Button color="primary" variant="solid">Solid</Button>
  <Button color="danger" variant="filled">Filled</Button>
  <Button color="success" variant="outlined">Outlined</Button>
  <Button color="warning" variant="dashed">Dashed</Button>
  <Button color="geekblue" variant="text">Text</Button>
  <Button color="purple" variant="link">Link</Button>
</template>
```

## 形状与链接

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton shape="round">圆角</AButton>
    <AButton shape="circle">i</AButton>
    <AButton href="https://ant.design" target="_blank" type="link">Ant Design</AButton>
  </div>
</div>

```vue
<template>
  <Button shape="round">圆角</Button>
  <Button shape="circle">i</Button>
  <Button href="https://ant.design" target="_blank" type="link">Ant Design</Button>
</template>
```

## 图标

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton icon="+">新建</AButton>
    <AButton icon=">" icon-placement="end">下一步</AButton>
    <AButton icon-position="end">
      <template #icon>
        <span>^</span>
      </template>
      打开
    </AButton>
  </div>
</div>

```vue
<template>
  <Button icon="+">新建</Button>
  <Button icon=">" icon-placement="end">下一步</Button>
  <Button icon-position="end">
    <template #icon>
      <span>^</span>
    </template>
    打开
  </Button>
</template>
```

## 延迟加载

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton type="primary" :loading="{ delay: 300 }">延迟加载</AButton>
    <AButton :loading="{ icon: '···' }">对象图标</AButton>
    <AButton loading>
      <template #loadingIcon>
        <span>...</span>
      </template>
      自定义加载
    </AButton>
  </div>
</div>

```vue
<template>
  <Button type="primary" :loading="{ delay: 300 }">延迟加载</Button>
  <Button :loading="{ icon: '···' }">对象图标</Button>
  <Button loading>
    <template #loadingIcon>
      <span>...</span>
    </template>
    自定义加载
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
    配置
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
    配置
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
| color | 按钮颜色，显式设置时优先于 `type` 推导 | `default` \| `primary` \| `danger` \| `success` \| `warning` \| `info` \| Ant 预设色 | - |
| variant | 按钮变体，显式设置时优先于 `type` 推导 | `outlined` \| `dashed` \| `solid` \| `filled` \| `text` \| `link` | - |
| loading | 是否加载中，支持延迟显示和自定义图标 | `boolean` \| `{ delay?: number; icon?: VNodeChild }` | `false` |
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

Button 使用 Aheart UI 的全局 CSS 变量：

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-info`
- `--aheart-radius`
- `--aheart-motion-duration`

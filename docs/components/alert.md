# Alert 警告提示 <span class="aheart-status aheart-status--ready">已完成</span>

Alert displays contextual information with optional icons, descriptions, and close controls.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AAlert type="success" message="Saved successfully" show-icon />
    <AAlert type="info" message="New version is available" show-icon />
    <AAlert type="warning" message="Storage is almost full" show-icon />
    <AAlert type="error" message="Sync failed" show-icon />
  </ASpace>
</div>

```vue
<template>
  <ASpace direction="vertical" style="width: 100%">
    <AAlert type="success" message="Saved successfully" show-icon />
    <AAlert type="info" message="New version is available" show-icon />
    <AAlert type="warning" message="Storage is almost full" show-icon />
    <AAlert type="error" message="Sync failed" show-icon />
  </ASpace>
</template>
```

## 带描述

<div class="aheart-demo-panel">
  <AAlert
    type="warning"
    message="Review required"
    description="This change affects billing settings and should be reviewed before publishing."
    show-icon
    closable
  />
</div>

```vue
<template>
  <AAlert
    type="warning"
    message="Review required"
    description="This change affects billing settings and should be reviewed before publishing."
    show-icon
    closable
    @close="handleClose"
  />
</template>
```

## 自定义描述

<div class="aheart-demo-panel">
  <AAlert type="info" message="Maintenance window">
    Scheduled maintenance starts at 22:00 and should finish within 30 minutes.
  </AAlert>
</div>

```vue
<template>
  <AAlert type="info" message="Maintenance window">
    Scheduled maintenance starts at 22:00 and should finish within 30 minutes.
  </AAlert>
</template>
```

## 顶部公告

<div class="aheart-demo-panel">
  <AAlert banner title="Scheduled maintenance starts at 22:00" />
</div>

```vue
<template>
  <AAlert banner title="Scheduled maintenance starts at 22:00" />
</template>
```

## 样式变体

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AAlert type="info" title="Outlined alert" variant="outlined" show-icon />
    <AAlert type="success" title="Filled alert" variant="filled" show-icon />
  </ASpace>
</div>

```vue
<template>
  <ASpace direction="vertical" style="width: 100%">
    <AAlert type="info" title="Outlined alert" variant="outlined" show-icon />
    <AAlert type="success" title="Filled alert" variant="filled" show-icon />
  </ASpace>
</template>
```

## 操作区域

<div class="aheart-demo-panel">
  <AAlert type="warning" title="Update available" show-icon action="Restart now" />
</div>

```vue
<template>
  <AAlert type="warning" title="Update available" show-icon action="Restart now" />
</template>
```

## 自定义图标

<div class="aheart-demo-panel">
  <AAlert
    type="info"
    title="Custom controls"
    description="Use icon and closeIcon for compact inline customization."
    show-icon
    icon="?"
    closable
    close-icon="dismiss"
  />
</div>

```vue
<template>
  <AAlert
    type="info"
    title="Custom controls"
    description="Use icon and closeIcon for compact inline customization."
    show-icon
    icon="?"
    closable
    close-icon="dismiss"
  />
</template>
```

## 关闭配置

<div class="aheart-demo-panel">
  <AAlert
    type="info"
    message="Closable configuration"
    description="Use object closable to configure close icon and ARIA labels."
    :closable="{ closeIcon: 'Dismiss', ariaLabel: 'Dismiss alert', ariaDescribedby: 'alert-description' }"
  />
</div>

```vue
<template>
  <AAlert
    type="info"
    message="Closable configuration"
    description="Use object closable to configure close icon and ARIA labels."
    :closable="{ closeIcon: 'Dismiss', ariaLabel: 'Dismiss alert', ariaDescribedby: 'alert-description' }"
  />
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <AAlert
    title="Semantic alert"
    description="Style individual Alert parts without depending on internal selectors."
    show-icon
    action="Details"
    :class-names="{ title: 'demo-alert-title', section: 'demo-alert-section', actions: 'demo-alert-actions' }"
    :styles="{ root: { marginBlockStart: '8px' }, actions: { marginInlineStart: '16px' } }"
  />
</div>

```vue
<template>
  <AAlert
    title="Semantic alert"
    description="Style individual Alert parts without depending on internal selectors."
    show-icon
    action="Details"
    :class-names="{ title: 'demo-alert-title', section: 'demo-alert-section', actions: 'demo-alert-actions' }"
    :styles="{ root: { marginBlockStart: '8px' }, actions: { marginInlineStart: '16px' } }"
  />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 警告类型 | `success` \| `info` \| `warning` \| `error` | `info` |
| title | 标题内容，优先级高于 `message` | `VNodeChild` | - |
| message | 标题内容 | `VNodeChild` | - |
| description | 辅助描述 | `VNodeChild` | - |
| showIcon | 是否显示类型图标 | `boolean` | `false` |
| closable | 是否显示关闭按钮，可传对象配置关闭按钮 | `boolean` \| `AlertClosableConfig` | `false` |
| banner | 是否用作顶部公告，默认展示 warning 图标 | `boolean` | `false` |
| variant | 样式变体 | `outlined` \| `filled` | `outlined` |
| action | 右侧操作内容 | `VNodeChild` | - |
| icon | 自定义图标内容 | `VNodeChild` | - |
| closeIcon | 自定义关闭内容 | `VNodeChild` | - |
| role | 根节点 ARIA role | `string` | `alert` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `AlertClassNames` | - |
| styles | 语义化结构样式 | `AlertStyles` | - |

## AlertClosableConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| closeIcon | 关闭按钮内容，优先级高于 `closeIcon` prop | `VNodeChild` | - |
| ariaLabel | 关闭按钮 `aria-label` | `string` | `Close` |
| ariaLabelledby | 关闭按钮 `aria-labelledby` | `string` | - |
| ariaDescribedby | 关闭按钮 `aria-describedby` | `string` | - |
| onClose | 点击关闭按钮后的回调 | `(event: MouseEvent) => void` | - |
| afterClose | Alert 隐藏后的回调 | `() => void` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮时触发 | `(event: MouseEvent) => void` |
| afterClose | Alert 隐藏后触发 | `() => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义描述内容 |
| action | 自定义右侧操作区域 |
| icon | 自定义图标区域 |
| closeIcon | 自定义关闭区域 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根容器 |
| icon | 图标区域 |
| section | 内容包裹区域，Ant 语义别名 |
| content | 内容包裹区域，兼容别名 |
| title | 标题区域 |
| description | 描述区域 |
| actions | 操作区域，Ant 语义别名 |
| action | 操作区域，兼容别名 |
| close | 关闭按钮 |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-border`
- `--aheart-border-radius-md`

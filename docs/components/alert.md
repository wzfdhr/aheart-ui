# Alert 警告提示 <span class="aheart-status aheart-status--ready">Ready</span>

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

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 警告类型 | `success` \| `info` \| `warning` \| `error` | `info` |
| message | 标题内容 | `string` | - |
| description | 辅助描述 | `string` | - |
| showIcon | 是否显示类型图标 | `boolean` | `false` |
| closable | 是否显示关闭按钮 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮时触发 | `(event: MouseEvent) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义描述内容 |

## Theme Tokens

- `--aheart-color-success`
- `--aheart-color-info`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-border`
- `--aheart-border-radius-md`

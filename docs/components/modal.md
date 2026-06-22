<script setup lang="ts">
import { ref } from 'vue'

const basicOpen = ref(false)
const footerOpen = ref(false)
const centeredOpen = ref(false)
</script>

# Modal 对话框 <span class="aheart-status aheart-status--ready">Ready</span>

Modal focuses attention in a blocking dialog for decisions, confirmations, and short workflows.

## 基础用法

<div class="aheart-demo-panel">
  <AButton type="primary" @click="basicOpen = true">Open modal</AButton>
  <AModal v-model:open="basicOpen" title="Edit profile">
    Profile settings can be reviewed before saving.
  </AModal>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <AButton type="primary" @click="open = true">Open modal</AButton>
  <AModal v-model:open="open" title="Edit profile">
    Profile settings can be reviewed before saving.
  </AModal>
</template>
```

## 自定义页脚

<div class="aheart-demo-panel">
  <AButton @click="footerOpen = true">Custom footer</AButton>
  <AModal v-model:open="footerOpen" title="Publish changes" :footer="false">
    This action publishes the current draft to production.
    <template #footer>
      <AButton @click="footerOpen = false">Keep editing</AButton>
      <AButton type="primary" @click="footerOpen = false">Publish</AButton>
    </template>
  </AModal>
</div>

```vue
<template>
  <AModal v-model:open="open" title="Publish changes" :footer="false">
    This action publishes the current draft to production.
    <template #footer>
      <AButton @click="open = false">Keep editing</AButton>
      <AButton type="primary" @click="open = false">Publish</AButton>
    </template>
  </AModal>
</template>
```

## 居中与宽度

<div class="aheart-demo-panel">
  <AButton @click="centeredOpen = true">Centered modal</AButton>
  <AModal v-model:open="centeredOpen" title="Invite members" centered :width="480">
    Send invitations after reviewing roles and access.
  </AModal>
</div>

```vue
<template>
  <AModal v-model:open="open" title="Invite members" centered :width="480">
    Send invitations after reviewing roles and access.
  </AModal>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示对话框 | `boolean` | `false` |
| title | 标题内容 | `string` | - |
| width | 对话框宽度 | `number` \| `string` | `520` |
| centered | 是否垂直居中 | `boolean` | `false` |
| closable | 是否显示右上角关闭按钮 | `boolean` | `true` |
| mask | 是否显示遮罩 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| keyboard | 按下 Escape 是否关闭 | `boolean` | `true` |
| confirmLoading | OK 按钮是否显示加载态 | `boolean` | `false` |
| okText | OK 按钮文本 | `string` | `OK` |
| cancelText | Cancel 按钮文本 | `string` | `Cancel` |
| okType | OK 按钮类型 | `ButtonType` | `primary` |
| footer | 是否显示默认页脚 | `boolean` | `true` |
| destroyOnClose | 关闭时销毁内容的语义开关；当前实现关闭后不渲染节点 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:open | 显隐状态变化时触发 | `(open: boolean) => void` |
| ok | 点击 OK 按钮时触发 | `() => void` |
| cancel | 点击 Cancel 按钮时触发 | `() => void` |
| close | 点击关闭按钮、遮罩、Cancel 或 Escape 时触发 | `() => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 对话框内容 |
| title | 自定义标题 |
| footer | 自定义页脚 |

## Theme Tokens

- `--aheart-color-bg-elevated`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-fill`
- `--aheart-shadow`
- `--aheart-radius`

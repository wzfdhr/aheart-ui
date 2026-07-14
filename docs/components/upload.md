<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile } from 'aheart-ui'

const files = ref<UploadFile[]>([])
const customRequest = ({ onProgress, onSuccess }: { onProgress: (percent: number) => void; onSuccess: (response?: unknown) => void }) => {
  onProgress(50)
  window.setTimeout(() => onSuccess({ ok: true }), 300)
}
</script>

# Upload 上传 <span class="aheart-status aheart-status--ready">Ready</span>

选择文件并管理上传状态。组件不包含上传服务，通过 `customRequest` 接入业务请求。

## 基础用法

<AUpload :custom-request="customRequest" />

```vue
<AUpload :custom-request="customRequest" />
```

## 受控文件列表

使用 `v-model:file-list` 由外部管理文件状态。

<AUpload v-model:file-list="files" :custom-request="customRequest" />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile } from 'aheart-ui'

const files = ref<UploadFile[]>([])
</script>

<template>
  <AUpload v-model:file-list="files" :custom-request="customRequest" />
</template>
```

## 手动上传

`beforeUpload` 返回 `false` 时，文件进入待上传列表；点击 Upload 后再发起请求。

```vue
<AUpload :before-upload="() => false" :custom-request="customRequest" />
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fileList | 受控文件列表 | `UploadFile[]` | - |
| defaultFileList | 非受控初始文件列表 | `UploadFile[]` | `[]` |
| beforeUpload | 文件加入列表前的钩子；返回 `false` 时改为手动上传 | `(file, fileList) => boolean \| Promise<boolean>` | - |
| customRequest | 业务上传请求；通过回调更新进度、成功或失败状态 | `UploadRequest` | - |
| maxCount | 最多选择的文件数 | `number` | `Infinity` |
| multiple | 是否支持多选 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |

### UploadFile

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| uid | 文件唯一标识 | `string` |
| name | 文件名 | `string` |
| status | 上传状态 | `'ready' \| 'uploading' \| 'done' \| 'error'` |
| percent | 上传进度 | `number` |
| originFile | 原始浏览器文件 | `File` |
| response | 成功响应 | `unknown` |
| error | 失败原因 | `unknown` |

### 事件

| 事件 | 说明 |
| --- | --- |
| update:fileList | 文件列表变化 |
| change | 文件列表变化 |
| remove | 移除文件时触发 |

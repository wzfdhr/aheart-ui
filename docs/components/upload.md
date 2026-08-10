<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UploadFile } from 'aheart-ui'

const files = ref<UploadFile[]>([])
const customRequest = ({ onProgress, onSuccess }: { onProgress: (percent: number) => void; onSuccess: (response?: unknown) => void }) => {
  onProgress(50)
  window.setTimeout(() => onSuccess({ ok: true }), 300)
}

const progressFiles = ref<UploadFile[]>([])
let completeProgressRequest: (() => void) | undefined
const progressRequest = ({ onProgress, onSuccess }: { onProgress: (percent: number) => void; onSuccess: (response?: unknown) => void }) => {
  onProgress(50)
  completeProgressRequest = () => onSuccess({ ok: true })
}
const completeProgress = () => completeProgressRequest?.()
const progressStatus = computed(() => progressFiles.value[0]?.status === 'done' ? '上传成功' : `上传进度：${progressFiles.value[0]?.percent ?? 0}%`)

const failureFiles = ref<UploadFile[]>([])
let failureAttempts = 0
const failureRequest = ({ onSuccess, onError }: { onSuccess: (response?: unknown) => void; onError: (error: unknown) => void }) => {
  failureAttempts += 1
  if (failureAttempts === 1) onError(new Error('QG3 failure'))
  else onSuccess({ ok: true })
}
const retryFailure = () => {
  const file = failureFiles.value[0]
  if (file) failureFiles.value = [{ ...file, status: 'done', error: undefined, percent: 100 }]
}
const failureStatus = computed(() => failureFiles.value[0]?.status === 'done' ? '上传成功' : failureFiles.value[0]?.status === 'error' ? '上传失败' : '')

const manualFiles = ref<UploadFile[]>([])
const manualRequestCount = ref(0)
const holdUpload = () => false
const manualRequest = ({ onSuccess }: { onSuccess: (response?: unknown) => void }) => {
  manualRequestCount.value += 1
  onSuccess({ ok: true })
}
const manualStatus = computed(() => manualFiles.value[0]?.status === 'done' ? '上传成功' : '')

const pendingFiles = ref<UploadFile[]>([])
let completePendingRequest: (() => void) | undefined
const pendingRequest = ({ onSuccess }: { onSuccess: (response?: unknown) => void }) => {
  completePendingRequest = () => onSuccess({ ok: true })
}
const removePending = () => { pendingFiles.value = [] }
const completePending = () => completePendingRequest?.()
const pendingStatus = computed(() => pendingFiles.value.length ? '' : '已移除')

const maxCountFiles = ref<UploadFile[]>([])
const controlledFiles = ref<UploadFile[]>([])
const acceptControlledFile = (files: UploadFile[]) => {
  const acceptedFile = files.find((file) => file.name === 'accepted.txt')
  controlledFiles.value = acceptedFile ? [acceptedFile] : []
}
</script>

# Upload 上传 <span class="aheart-status aheart-status--ready">已完成</span>

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

## 浏览器交互示例

<div data-testid="upload-fixture" class="upload-fixture">
  <section aria-label="进度与成功">
    <h3>进度与成功</h3>
    <AUpload v-model:file-list="progressFiles" :custom-request="progressRequest">选择文件</AUpload>
    <p data-testid="upload-progress-status">{{ progressStatus }}</p>
    <button type="button" @click="completeProgress">完成上传</button>
  </section>

  <section aria-label="失败与重试">
    <h3>失败与重试</h3>
    <AUpload v-model:file-list="failureFiles" :custom-request="failureRequest">选择文件</AUpload>
    <p data-testid="upload-retry-status">{{ failureStatus }}</p>
    <button v-if="failureFiles[0]?.status === 'error'" type="button" @click="retryFailure">重试 {{ failureFiles[0].name }}</button>
  </section>

  <section aria-label="手动上传">
    <h3>手动上传</h3>
    <AUpload v-model:file-list="manualFiles" :before-upload="holdUpload" :custom-request="manualRequest">选择文件</AUpload>
    <p data-testid="upload-manual-request-count">请求次数：{{ manualRequestCount }}</p>
    <p data-testid="upload-manual-status">{{ manualStatus }}</p>
  </section>

  <section aria-label="移除上传中的文件">
    <h3>移除上传中的文件</h3>
    <AUpload v-model:file-list="pendingFiles" :custom-request="pendingRequest">选择文件</AUpload>
    <button v-if="pendingFiles[0]" type="button" @click="removePending">移除 {{ pendingFiles[0].name }}</button>
    <button type="button" @click="completePending">完成待处理上传</button>
    <p data-testid="upload-removal-status">{{ pendingStatus }}</p>
  </section>

  <section aria-label="禁用上传">
    <h3>禁用上传</h3>
    <AUpload disabled :before-upload="holdUpload">选择文件</AUpload>
    <button type="button" disabled>Upload</button>
    <p data-testid="upload-disabled-count">已选择 0 个文件</p>
  </section>

  <section aria-label="最大文件数">
    <h3>最大文件数</h3>
    <AUpload v-model:file-list="maxCountFiles" :max-count="1" multiple>选择文件</AUpload>
    <button v-if="maxCountFiles[0]" type="button" @click="maxCountFiles = []">移除 {{ maxCountFiles[0].name }}</button>
    <p data-testid="upload-max-count">已接受 {{ maxCountFiles.length }} 个文件</p>
  </section>

  <section aria-label="受控拒绝">
    <h3>受控拒绝</h3>
    <AUpload v-model:file-list="controlledFiles" :max-count="1" @update:file-list="acceptControlledFile">选择文件</AUpload>
    <p data-testid="upload-controlled-count">已接受 {{ controlledFiles.length }} 个文件</p>
  </section>
</div>

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

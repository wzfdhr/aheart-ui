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
const failureRequestCount = ref(0)
const failureRequest = ({ onSuccess, onError }: { onSuccess: (response?: unknown) => void; onError: (error: unknown) => void }) => {
  failureAttempts += 1
  failureRequestCount.value = failureAttempts
  if (failureAttempts === 1) onError(new Error('QG3 failure'))
  else onSuccess({ ok: true })
}
const failureStatus = computed(() => failureFiles.value[0]?.status === 'done' ? '上传成功' : failureFiles.value[0]?.status === 'error' ? '上传失败' : failureFiles.value[0]?.status === 'ready' ? '等待重新上传' : '')

const cancelFiles = ref<UploadFile[]>([])
let cancelAttempts = 0
let lateCancelledSuccess: (() => void) | undefined
const cancelRequest = ({ onProgress, onSuccess }: { onProgress: (percent: number) => void; onSuccess: (response?: unknown) => void }) => {
  cancelAttempts += 1
  if (cancelAttempts === 1) {
    onProgress(25)
    lateCancelledSuccess = () => onSuccess({ stale: true })
  } else onSuccess({ ok: true })
}
const completeCancelledRequest = () => lateCancelledSuccess?.()
const cancelStatus = computed(() => cancelFiles.value[0]?.status === 'cancelled' ? '已取消' : cancelFiles.value[0]?.status === 'done' ? '重试成功' : cancelFiles.value[0]?.status === 'uploading' ? `上传中 ${cancelFiles.value[0]?.percent ?? 0}%` : '')

const timeoutFiles = ref<UploadFile[]>([])
const timeoutRequest = () => undefined
const timeoutStatus = computed(() => timeoutFiles.value[0]?.failureReason === 'timeout' ? '上传超时，可重试' : timeoutFiles.value[0]?.status ?? '')

const validationFiles = ref<UploadFile[]>([])
const rejectInvalidFile = async () => { throw new Error('文件内容不合法') }
const validationStatus = computed(() => validationFiles.value[0]?.failureReason === 'validation' ? '校验失败' : '')

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

const disabledFiles = ref<UploadFile[]>([])
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

`beforeUpload` 返回 `false` 时，文件进入待上传列表；点击“上传”后再发起请求。

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
    <p data-testid="upload-retry-request-count">请求次数：{{ failureRequestCount }}</p>
  </section>

  <section aria-label="取消与任务隔离">
    <h3>取消与任务隔离</h3>
    <AUpload v-model:file-list="cancelFiles" :custom-request="cancelRequest">选择文件</AUpload>
    <button type="button" @click="completeCancelledRequest">触发旧任务完成</button>
    <p data-testid="upload-cancel-status">{{ cancelStatus }}</p>
  </section>

  <section aria-label="上传超时">
    <h3>上传超时</h3>
    <AUpload v-model:file-list="timeoutFiles" :timeout="80" :custom-request="timeoutRequest">选择文件</AUpload>
    <p data-testid="upload-timeout-status">{{ timeoutStatus }}</p>
  </section>

  <section aria-label="上传校验失败">
    <h3>上传校验失败</h3>
    <AUpload v-model:file-list="validationFiles" :before-upload="rejectInvalidFile">选择文件</AUpload>
    <p data-testid="upload-validation-status">{{ validationStatus }}</p>
  </section>

  <section aria-label="Upload 独立 locale">
    <h3>独立 locale</h3>
    <AConfigProvider :locale="{ datePicker: { locale: 'en-US' }, upload: { selectFile: '选择附件', upload: '开始传输' } }">
      <AUpload :before-upload="holdUpload" />
    </AConfigProvider>
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
    <AUpload v-model:file-list="disabledFiles" disabled :before-upload="holdUpload">选择文件</AUpload>
    <p data-testid="upload-disabled-count">已选择 {{ disabledFiles.length }} 个文件</p>
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
| timeout | 单个请求超时毫秒数；`0` 表示关闭 | `number` | `0` |
| maxCount | 最多选择的文件数 | `number` | `Infinity` |
| multiple | 是否支持多选 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |

### UploadFile

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| uid | 文件唯一标识 | `string` |
| name | 文件名 | `string` |
| status | 上传状态 | `'ready' \| 'uploading' \| 'done' \| 'error' \| 'cancelled'` |
| percent | 上传进度 | `number` |
| originFile | 原始浏览器文件 | `File` |
| response | 成功响应 | `unknown` |
| error | 失败原因 | `unknown` |
| failureReason | 标准失败类别 | `'validation' \| 'timeout' \| 'request' \| 'cancelled'` |

`customRequest` 现在还会收到当前任务的 `signal` 与 `taskId`，以及 `onCancel`。业务请求应监听 `signal` 主动停止网络传输；旧实现可忽略新增字段。每次 retry 都会创建新的 `taskId`，旧任务的迟到 progress/success/error/cancel 回调不会覆盖当前文件状态。

### 事件

| 事件 | 说明 |
| --- | --- |
| update:fileList | 文件列表变化 |
| change | 文件列表变化 |
| remove | 移除文件时触发 |
| cancel | 用户取消当前上传任务 |
| retry | 用户重试失败或已取消任务 |

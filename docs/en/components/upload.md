<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile } from 'aheart-ui'

const files = ref<UploadFile[]>([])
const customRequest = ({ onProgress, onSuccess }: { onProgress: (percent: number) => void; onSuccess: (response?: unknown) => void }) => {
  onProgress(50)
  window.setTimeout(() => onSuccess({ ok: true }), 300)
}
</script>

# Upload <span class="aheart-status aheart-status--ready">Ready</span>

Select files and manage their upload state. The component does not include an upload service; connect one through `customRequest`.

## Basic Usage

<AUpload :custom-request="customRequest" />

```vue
<AUpload :custom-request="customRequest" />
```

## Controlled File List

Use `v-model:file-list` to manage the file state outside the component.

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

## Manual Upload

Return `false` from `beforeUpload` to add files in a ready state. Select Upload to start the request.

```vue
<AUpload :before-upload="() => false" :custom-request="customRequest" />
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| fileList | Controlled file list. | `UploadFile[]` | - |
| defaultFileList | Initial uncontrolled file list. | `UploadFile[]` | `[]` |
| beforeUpload | Runs before a file is added. Return `false` for manual uploads. | `(file, fileList) => boolean \| Promise<boolean>` | - |
| customRequest | Business upload request. Use its callbacks for progress and outcomes. | `UploadRequest` | - |
| maxCount | Maximum selected files. | `number` | `Infinity` |
| multiple | Enables multi-file selection. | `boolean` | `false` |
| disabled | Disables the control. | `boolean` | `false` |

### UploadFile

| Field | Description | Type |
| --- | --- | --- |
| uid | Unique file identifier. | `string` |
| name | File name. | `string` |
| status | Upload state. | `'ready' \| 'uploading' \| 'done' \| 'error'` |
| percent | Upload progress. | `number` |
| originFile | Original browser file. | `File` |
| response | Successful response. | `unknown` |
| error | Failure reason. | `unknown` |

### Events

| Event | Description |
| --- | --- |
| update:fileList | Emitted when the file list changes. |
| change | Emitted when the file list changes. |
| remove | Emitted after a file is removed. |

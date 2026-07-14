<template>
  <div class="aheart-upload" :class="{ 'is-disabled': disabled }">
    <label class="aheart-upload__trigger">
      <input type="file" :disabled="disabled" :multiple="multiple" @change="handleChange" />
      <slot><span>Select file</span></slot>
    </label>
    <button v-if="readyFiles.length" class="aheart-upload__start" type="button" :disabled="disabled" @click="uploadReadyFiles">Upload</button>
    <ul v-if="mergedFileList.length" class="aheart-upload__list">
      <li v-for="file in mergedFileList" :key="file.uid" class="aheart-upload__item" :class="`is-${file.status ?? 'ready'}`">
        <span>{{ file.name }}</span>
        <span v-if="file.status === 'uploading'">{{ file.percent ?? 0 }}%</span>
        <span v-else-if="file.status === 'done'">Done</span>
        <span v-else-if="file.status === 'error'">Failed</span>
        <button class="aheart-upload__remove" type="button" :disabled="disabled" :aria-label="`Remove ${file.name}`" @click="removeFile(file.uid)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UploadFile, UploadRequest } from './types'
import './style.css'

defineOptions({ name: 'AUpload' })

const props = withDefaults(defineProps<{
  fileList?: UploadFile[]
  defaultFileList?: UploadFile[]
  beforeUpload?: (file: File, fileList: UploadFile[]) => boolean | Promise<boolean>
  customRequest?: UploadRequest
  maxCount?: number
  disabled?: boolean
  multiple?: boolean
}>(), {
  defaultFileList: () => [],
  maxCount: Infinity
})
const emit = defineEmits<{
  'update:fileList': [files: UploadFile[]]
  change: [files: UploadFile[]]
  remove: [file: UploadFile]
}>()

const internalFileList = ref<UploadFile[]>([...props.defaultFileList])
const mergedFileList = computed(() => props.fileList ?? internalFileList.value)
const readyFiles = computed(() => mergedFileList.value.filter((file) => file.status === 'ready'))
let uid = 0

const updateFileList = (files: UploadFile[]) => {
  if (props.fileList === undefined) internalFileList.value = files
  emit('update:fileList', files)
  emit('change', files)
}
const replaceFile = (file: UploadFile) => updateFileList(mergedFileList.value.map((current) => current.uid === file.uid ? file : current))
const toUploadFile = (file: File): UploadFile => ({
  uid: `${Date.now()}-${uid += 1}`,
  name: file.name,
  size: file.size,
  type: file.type,
  status: 'ready',
  originFile: file
})
const upload = async (file: UploadFile) => {
  if (!file.originFile || file.status === 'uploading') return

  replaceFile({ ...file, status: 'uploading', percent: 0 })
  const onProgress = (percent: number) => replaceFile({ ...file, status: 'uploading', percent: Math.max(0, Math.min(100, percent)) })
  const onSuccess = (response?: unknown) => replaceFile({ ...file, status: 'done', percent: 100, response })
  const onError = (error: unknown) => replaceFile({ ...file, status: 'error', error })

  try {
    if (props.customRequest) {
      await props.customRequest({ file, onProgress, onSuccess, onError })
    } else {
      onSuccess()
    }
  } catch (error) {
    onError(error)
  }
}
const uploadReadyFiles = () => Promise.all(readyFiles.value.map(upload))
const handleChange = async (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files ?? [])
  const remaining = Math.max(0, props.maxCount - mergedFileList.value.length)

  for (const rawFile of files.slice(0, remaining)) {
    const uploadFile = toUploadFile(rawFile)
    const shouldUpload = await props.beforeUpload?.(rawFile, [...mergedFileList.value, uploadFile])
    updateFileList([...mergedFileList.value, uploadFile])
    if (shouldUpload !== false) await upload(uploadFile)
  }

  ;(event.target as HTMLInputElement).value = ''
}
const removeFile = (uid: string) => {
  const file = mergedFileList.value.find((current) => current.uid === uid)
  if (!file) return
  updateFileList(mergedFileList.value.filter((current) => current.uid !== uid))
  emit('remove', file)
}
</script>

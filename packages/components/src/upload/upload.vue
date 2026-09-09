<template>
  <div ref="rootRef" v-bind="rootAttrs" class="aheart-upload" :class="{ 'is-disabled': disabled, 'is-error': formControl?.invalid.value }" @focusout="handleFocusOut">
    <label class="aheart-upload__trigger">
      <input v-bind="inputAttrs" :id="resolvedId" type="file" :aria-labelledby="resolvedAriaLabelledby" :aria-describedby="resolvedAriaDescribedby" :aria-invalid="resolvedAriaInvalid" :disabled="disabled" :multiple="multiple" @change="handleChange" />
      <slot><span>{{ copy.selectFile }}</span></slot>
    </label>
    <button v-if="readyFiles.length" class="aheart-upload__start" type="button" :disabled="disabled" @click="uploadReadyFiles">{{ copy.upload }}</button>
    <ul v-if="mergedFileList.length" class="aheart-upload__list">
      <li v-for="file in mergedFileList" :key="file.uid" class="aheart-upload__item" :class="`is-${file.status ?? 'ready'}`">
        <span>{{ file.name }}</span>
        <span v-if="file.status === 'uploading'">{{ file.percent ?? 0 }}%</span>
        <span v-else-if="file.status === 'done'">{{ copy.done }}</span>
        <span v-else-if="file.status === 'error'">{{ failureCopy(file) }}</span>
        <span v-else-if="file.status === 'cancelled'">{{ copy.cancelled }}</span>
        <button v-if="file.status === 'uploading'" data-upload-cancel class="aheart-upload__cancel" type="button" :disabled="disabled" :aria-label="copy.cancel(file.name)" @click="cancelFile(file)">{{ copy.cancelAction }}</button>
        <button v-if="file.status === 'error' || file.status === 'cancelled'" data-upload-retry class="aheart-upload__retry" type="button" :disabled="disabled" :aria-label="copy.retry(file.name)" @click="retryFile(file)">{{ copy.retryAction }}</button>
        <button class="aheart-upload__remove" type="button" :disabled="disabled" :aria-label="copy.remove(file.name)" @click="removeFile(file.uid)">{{ copy.removeAction }}</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useAheartConfig } from '../config'
import { formAriaInvalid, mergeAriaIds, useFormControl } from '../form/control-context'
import { useControllableState } from '../utils/use-controllable-state'
import { usePropPresence } from '../utils/use-prop-presence'
import type { UploadFailureReason, UploadFile, UploadRequest, UploadRequestHandle } from './types'
import './style.css'

defineOptions({ name: 'AUpload', inheritAttrs: false })

const props = withDefaults(defineProps<{
  fileList?: UploadFile[]
  defaultFileList?: UploadFile[]
  beforeUpload?: (file: File, fileList: UploadFile[]) => boolean | Promise<boolean>
  customRequest?: UploadRequest
  maxCount?: number
  timeout?: number
  disabled?: boolean
  multiple?: boolean
}>(), {
  defaultFileList: () => [],
  maxCount: Infinity,
  timeout: 0
})
const emit = defineEmits<{
  'update:fileList': [files: UploadFile[]]
  change: [files: UploadFile[]]
  remove: [file: UploadFile]
  cancel: [file: UploadFile]
  retry: [file: UploadFile]
}>()

const config = useAheartConfig()
const attrs = useAttrs()
const inputAttribute = (key: string) => key === 'id' || key === 'name' || key === 'accept' || key === 'capture' || key.startsWith('aria-')
const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => inputAttribute(key))))
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !inputAttribute(key))))
const formControl = useFormControl()
const rootRef = ref<HTMLElement | null>(null)
const resolvedId = computed(() => attrs.id as string | undefined ?? formControl?.controlId.value)
const resolvedAriaLabelledby = computed(() => mergeAriaIds(attrs['aria-labelledby'], formControl?.labelledBy.value))
const resolvedAriaDescribedby = computed(() => mergeAriaIds(attrs['aria-describedby'], formControl?.describedBy.value))
const resolvedAriaInvalid = computed(() => formAriaInvalid(attrs['aria-invalid'], formControl?.status.value))
const defaultUploadCopy = {
  selectFile: '选择文件', upload: '上传', done: '已完成', failed: '上传失败', cancelled: '已取消',
  validationFailed: '校验失败', timeout: '上传超时', removeAction: '移除', cancelAction: '取消', retryAction: '重试',
  remove: (name: string) => `移除 ${name}`, cancel: (name: string) => `取消上传 ${name}`, retry: (name: string) => `重试 ${name}`
}
const copy = computed(() => ({ ...defaultUploadCopy, ...config.value.locale?.upload }))
const failureCopy = (file: UploadFile) => file.failureReason === 'validation'
  ? copy.value.validationFailed
  : file.failureReason === 'timeout'
    ? copy.value.timeout
    : copy.value.failed

const isFileListControlled = usePropPresence('fileList', 'file-list')
const fileListState = useControllableState<UploadFile[]>({
  controlled: () => props.fileList,
  isControlled: isFileListControlled,
  defaultValue: () => [...props.defaultFileList],
  onChange: (files) => emit('update:fileList', files ?? [])
})
const mergedFileList = computed(() => fileListState.state.value ?? [])
const readyFiles = computed(() => mergedFileList.value.filter((file) => file.status === 'ready'))
const latestFileList = ref<UploadFile[]>([...(props.fileList ?? props.defaultFileList)])
let uid = 0
let taskSequence = 0

interface ActiveUploadTask {
  id: string
  uid: string
  originFile?: File
  controller: AbortController
  timeoutId?: number
  abortHandle?: () => void
  abortHandleCalled: boolean
}

const activeTasks = new Map<string, ActiveUploadTask>()
const ownerWindow = () => rootRef.value?.ownerDocument.defaultView
const callAbortHandle = (task: ActiveUploadTask) => {
  if (task.abortHandleCalled || !task.abortHandle) return
  task.abortHandleCalled = true
  try {
    task.abortHandle()
  } catch {
    // Transport cleanup is best-effort. The task token and AbortSignal are
    // already invalidated, so a consumer abort error must not block UI cleanup.
  }
}
const clearTaskTimer = (task: ActiveUploadTask) => {
  if (task.timeoutId !== undefined) ownerWindow()?.clearTimeout(task.timeoutId)
  task.timeoutId = undefined
}
const isCurrentTask = (task: ActiveUploadTask) => activeTasks.get(task.uid)?.id === task.id && !task.controller.signal.aborted
const finishTask = (task: ActiveUploadTask, abort = false) => {
  if (activeTasks.get(task.uid)?.id !== task.id) return false
  activeTasks.delete(task.uid)
  clearTaskTimer(task)
  if (abort && !task.controller.signal.aborted) task.controller.abort()
  if (abort) callAbortHandle(task)
  return true
}
const abortTask = (uid: string) => {
  const task = activeTasks.get(uid)
  if (task) finishTask(task, true)
}
const abortAllTasks = () => Array.from(activeTasks.keys()).forEach(abortTask)

watch(() => props.fileList, (fileList) => {
  if (!isFileListControlled.value) return
  const nextFiles = [...(fileList ?? [])]
  activeTasks.forEach((task, taskUid) => {
    const next = nextFiles.find((file) => file.uid === taskUid)
    if (!next || next.originFile !== task.originFile || next.status !== 'uploading') abortTask(taskUid)
  })
  latestFileList.value = nextFiles
}, { deep: true })

const updateFileList = (files: UploadFile[]) => {
  latestFileList.value = files
  fileListState.setState(files)
  emit('change', files)
  formControl?.change()
}
const replaceFile = (file: UploadFile) => {
  const nextFiles = latestFileList.value.map((current) => current.uid === file.uid ? file : current)
  updateFileList(nextFiles)
  return nextFiles
}
const updateFile = (file: UploadFile, patch: Partial<UploadFile>) => {
  const current = latestFileList.value.find((candidate) => candidate.uid === file.uid) ?? file
  return replaceFile({ ...current, ...patch })
}
const toUploadFile = (file: File): UploadFile => ({
  uid: `${Date.now()}-${uid += 1}`,
  name: file.name,
  size: file.size,
  type: file.type,
  status: 'ready',
  originFile: file
})
const upload = (file: UploadFile, files: UploadFile[] = latestFileList.value) => {
  if (!file.originFile || file.status === 'uploading' || activeTasks.has(file.uid)) return files

  const AbortControllerConstructor = ownerWindow()?.AbortController ?? AbortController
  const task: ActiveUploadTask = {
    id: `${file.name}-${Date.now()}-${taskSequence += 1}`,
    uid: file.uid,
    originFile: file.originFile,
    controller: new AbortControllerConstructor(),
    abortHandleCalled: false
  }
  activeTasks.set(file.uid, task)
  let currentFiles = updateFile(file, { status: 'uploading', percent: 0, response: undefined, error: undefined, failureReason: undefined })
  const onProgress = (percent: number) => {
    if (!isCurrentTask(task)) return
    currentFiles = updateFile(file, { status: 'uploading', percent: Math.max(0, Math.min(100, percent)), response: undefined, error: undefined, failureReason: undefined })
  }
  const onSuccess = (response?: unknown) => {
    if (!isCurrentTask(task) || !finishTask(task)) return
    currentFiles = updateFile(file, { status: 'done', percent: 100, response, error: undefined, failureReason: undefined })
  }
  const onError = (error: unknown, failureReason: UploadFailureReason = 'request') => {
    if (!isCurrentTask(task) || !finishTask(task, failureReason === 'timeout')) return
    currentFiles = updateFile(file, { status: 'error', error, failureReason })
  }
  const onCancel = () => {
    if (!isCurrentTask(task) || !finishTask(task)) return
    const cancelled = { ...file, status: 'cancelled' as const, percent: undefined, error: undefined, failureReason: 'cancelled' as const }
    currentFiles = replaceFile(cancelled)
    emit('cancel', cancelled)
  }

  try {
    if (props.customRequest) {
      const result = props.customRequest({ file, signal: task.controller.signal, taskId: task.id, onProgress, onSuccess, onError, onCancel })
      void Promise.resolve(result).then((handle) => {
        if (handle && typeof (handle as UploadRequestHandle).abort === 'function') {
          task.abortHandle = (handle as UploadRequestHandle).abort
          if (task.controller.signal.aborted) callAbortHandle(task)
        }
      }, onError)
    } else {
      onSuccess()
    }
  } catch (error) {
    onError(error)
  }

  const timeout = Number.isFinite(props.timeout) ? Math.max(0, props.timeout) : 0
  if (timeout > 0 && isCurrentTask(task)) {
    task.timeoutId = ownerWindow()?.setTimeout(() => {
      const error = Object.assign(new Error(copy.value.timeout), { name: 'UploadTimeoutError' })
      onError(error, 'timeout')
    }, timeout)
  }

  return currentFiles
}
const uploadReadyFiles = () => {
  let files = latestFileList.value
  for (const file of files.filter((current) => current.status === 'ready')) {
    files = upload(file, files)
  }
}
const validateAndUpload = async (uploadFile: UploadFile, currentFiles: UploadFile[], addWhenMissing: boolean) => {
  let shouldUpload: boolean | undefined
  try {
    shouldUpload = await props.beforeUpload?.(uploadFile.originFile!, addWhenMissing ? [...currentFiles, uploadFile] : [...currentFiles])
  } catch (error) {
    const failed = { ...uploadFile, status: 'error' as const, error, failureReason: 'validation' as const }
    if (addWhenMissing) updateFileList([...currentFiles, failed])
    else replaceFile(failed)
    return latestFileList.value
  }
  const latest = isFileListControlled.value ? [...(props.fileList ?? [])] : latestFileList.value
  if (addWhenMissing) {
    if (latest.length >= props.maxCount) return latest
    updateFileList([...latest, uploadFile])
  } else {
    updateFile(uploadFile, { status: 'ready', error: undefined, response: undefined, percent: undefined, failureReason: undefined })
  }
  if (shouldUpload === false) return latestFileList.value
  return upload({ ...uploadFile, status: 'ready', error: undefined, response: undefined, percent: undefined, failureReason: undefined }, latestFileList.value)
}
const handleChange = async (event: Event) => {
  if (props.disabled) return
  const files = Array.from((event.target as HTMLInputElement).files ?? [])
  ;(event.target as HTMLInputElement).value = ''
  let nextFiles = isFileListControlled.value ? [...(props.fileList ?? [])] : latestFileList.value
  latestFileList.value = nextFiles

  for (const rawFile of files) {
    if (nextFiles.length >= props.maxCount) break
    const uploadFile = toUploadFile(rawFile)
    const currentFiles = isFileListControlled.value ? [...(props.fileList ?? [])] : latestFileList.value
    if (currentFiles.length >= props.maxCount) continue
    if (!props.beforeUpload) {
      updateFileList([...currentFiles, uploadFile])
      nextFiles = upload(uploadFile, latestFileList.value)
      continue
    }
    nextFiles = await validateAndUpload(uploadFile, currentFiles, true)
  }
}
const handleFocusOut = () => {
  void Promise.resolve().then(() => {
    const active = rootRef.value?.ownerDocument.activeElement ?? null
    if (!rootRef.value?.contains(active)) formControl?.blur()
  })
}
const removeFile = (uid: string) => {
  const file = mergedFileList.value.find((current) => current.uid === uid)
  if (!file) return
  abortTask(uid)
  updateFileList(mergedFileList.value.filter((current) => current.uid !== uid))
  emit('remove', file)
}
const cancelFile = (file: UploadFile) => {
  if (props.disabled || file.status !== 'uploading') return
  abortTask(file.uid)
  const cancelled = { ...file, status: 'cancelled' as const, percent: undefined, error: undefined, failureReason: 'cancelled' as const }
  replaceFile(cancelled)
  emit('cancel', cancelled)
}
const retryFile = async (file: UploadFile) => {
  if (props.disabled || (file.status !== 'error' && file.status !== 'cancelled') || !file.originFile) return
  abortTask(file.uid)
  emit('retry', file)
  await validateAndUpload({ ...file, status: 'ready', error: undefined, response: undefined, percent: undefined, failureReason: undefined }, latestFileList.value, false)
}

onBeforeUnmount(abortAllTasks)
</script>

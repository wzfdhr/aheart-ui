<template>
  <slot :fields="fields" :errors="errors" :add="add" :remove="remove" :move="move" />
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, ref, watch } from 'vue'
import { useStableId } from '../utils/use-stable-id'
import { formInternalContextKey, type FormListController } from './internal-context'
import { formListNameContextKey } from './list-context'
import { namePathKey, namePathSegments, normalizeNamePath, resolveNamePath } from './name-path'
import {
  formListProps,
  type FormListField,
  type FormListSlotProps,
  type FormNamePath
} from './types'

defineOptions({ name: 'AFormList' })

const props = defineProps(formListProps)
defineSlots<{ default?: (props: FormListSlotProps) => unknown }>()

const form = inject(formInternalContextKey, undefined)
const parentList = inject(formListNameContextKey, undefined)
const instanceId = useStableId(undefined, 'aheart-form-list').value
const fullName = computed<FormNamePath>(() => parentList?.resolveName(props.name) ?? normalizeNamePath(props.name))
const owner = computed(() => `${parentList?.resolveOwner(props.name) ?? 'form-root'}/list:${instanceId}`)
const tokens = ref<string[]>([])
let nextToken = 0
let previousItems: readonly unknown[] = []
let active = false
let registeredName: FormNamePath | undefined
let registeredOwner: string | undefined

const devWarn = (message: string) => {
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) console.warn(`[AFormList] ${message}`)
}

const newToken = () => `${instanceId}-item-${nextToken++}`
const isReferenceValue = (value: unknown): value is object | ((...args: never[]) => unknown) =>
  (typeof value === 'object' && value !== null) || typeof value === 'function'

const resetInitialTokens = (items: readonly unknown[]) => {
  tokens.value = items.map(() => newToken())
  previousItems = [...items]
}

const reconcileItems = (items: readonly unknown[]) => {
  const oldItems = previousItems
  const oldTokens = tokens.value
  if (oldItems.length === items.length && oldItems.every((item, index) => Object.is(item, items[index]))) {
    previousItems = [...items]
    return undefined
  }

  const oldIndexToNewIndex = new Map<number, number>()
  const nextTokens: Array<string | undefined> = Array(items.length)
  const usedOld = new Set<number>()
  const claim = (oldIndex: number, newIndex: number) => {
    if (usedOld.has(oldIndex) || nextTokens[newIndex] !== undefined) return false
    usedOld.add(oldIndex)
    oldIndexToNewIndex.set(oldIndex, newIndex)
    nextTokens[newIndex] = oldTokens[oldIndex]
    return true
  }

  items.forEach((item, newIndex) => {
    if (!isReferenceValue(item)) return
    const oldIndex = oldItems.findIndex((candidate, index) => !usedOld.has(index) && Object.is(candidate, item))
    if (oldIndex >= 0) claim(oldIndex, newIndex)
  })

  if (oldItems.length === items.length) {
    items.forEach((_item, index) => claim(index, index))
  } else {
    let prefix = 0
    while (prefix < oldItems.length && prefix < items.length && Object.is(oldItems[prefix], items[prefix])) {
      claim(prefix, prefix)
      prefix += 1
    }
    let oldSuffix = oldItems.length - 1
    let newSuffix = items.length - 1
    while (oldSuffix >= prefix && newSuffix >= prefix && Object.is(oldItems[oldSuffix], items[newSuffix])) {
      claim(oldSuffix, newSuffix)
      oldSuffix -= 1
      newSuffix -= 1
    }
  }

  tokens.value = nextTokens.map(token => token ?? newToken())
  previousItems = [...items]
  return { oldIndexToNewIndex }
}

const initialized = form?.initializeList(fullName.value, props.initialValue)
resetInitialTokens(Array.isArray(initialized) ? initialized : [])
if (!form) devWarn('must be rendered inside AForm; operations are disabled')

const controller: FormListController = {
  name: fullName.value,
  owner: owner.value,
  reconcile: reconcileItems,
  reset(items) {
    resetInitialTokens(items)
  }
}

watch(
  () => [fullName.value, owner.value] as const,
  ([name, nextOwner]) => {
    if (registeredName !== undefined && registeredOwner !== undefined) {
      form?.unregisterList(registeredName, registeredOwner)
      form?.unregisterOwnedField(registeredName, `${registeredOwner}/root`)
    }
    controller.name = name
    controller.owner = nextOwner
    active = form?.registerList(controller) ?? false
    if (active) {
      form?.registerOwnedField(name, `${nextOwner}/root`, props.rules ?? [], false, {}, { preserve: props.preserve })
      const value = form?.getValue(name)
      if (Array.isArray(value) && previousItems.length === 0 && tokens.value.length === 0) resetInitialTokens(value)
    }
    registeredName = typeof name === 'string' ? name : [...name]
    registeredOwner = nextOwner
  },
  { immediate: true }
)

watch(
  () => [props.rules, props.preserve] as const,
  ([rules, preserve]) => {
    if (active) form?.registerOwnedField(fullName.value, `${owner.value}/root`, rules ?? [], false, {}, { preserve })
  },
  { deep: true }
)

let warnedInvalidValue: unknown = Symbol('initial-invalid-list-value')
watch(
  () => form?.getValue(fullName.value),
  (value) => {
    if (value !== undefined && !Array.isArray(value) && value !== warnedInvalidValue) {
      warnedInvalidValue = value
      devWarn(`model path ${namePathKey(fullName.value)} must contain an array`)
    }
  },
  { immediate: true }
)

const currentItems = computed<readonly unknown[]>(() => {
  const value = form?.getValue(fullName.value)
  return Array.isArray(value) ? value : []
})

const fields = computed<FormListField[]>(() => currentItems.value.map((_item, index) => ({
  key: tokens.value[index] ?? `${instanceId}-pending-${index}`,
  fieldKey: tokens.value[index] ?? `${instanceId}-pending-${index}`,
  name: index
})))
const errors = computed(() => form?.getFieldErrors(fullName.value) ?? [])

const validInsertIndex = (value: number, length: number) => Number.isInteger(value) && value >= 0 && value <= length
const validItemIndex = (value: number, length: number) => Number.isInteger(value) && value >= 0 && value < length

const add = (defaultValue?: unknown, insertIndex?: number) => {
  const raw = form?.getValue(fullName.value)
  if (raw !== undefined && !Array.isArray(raw)) { devWarn('add ignored because the model value is not an array'); return }
  const length = Array.isArray(raw) ? raw.length : 0
  const index = insertIndex ?? length
  if (!validInsertIndex(index, length)) { devWarn(`add index ${String(insertIndex)} is outside 0..${length}`); return }
  const oldIndexToNewIndex = new Map<number, number>()
  for (let oldIndex = 0; oldIndex < length; oldIndex += 1) oldIndexToNewIndex.set(oldIndex, oldIndex < index ? oldIndex : oldIndex + 1)
  const token = newToken()
  const committed = form?.mutateList(fullName.value, owner.value, oldIndexToNewIndex, items => {
    items.splice(index, 0, defaultValue)
    tokens.value.splice(index, 0, token)
    previousItems = [...items]
  })
  if (!committed) devWarn('add ignored because this FormList is not the active owner')
}

const remove = (input: number | readonly number[]) => {
  const raw = form?.getValue(fullName.value)
  if (!Array.isArray(raw)) {
    if (raw !== undefined) devWarn('remove ignored because the model value is not an array')
    return
  }
  const requested = Array.isArray(input) ? [...input] : [input]
  const valid = [...new Set(requested.filter(index => validItemIndex(index, raw.length)))].sort((left, right) => left - right)
  if (valid.length !== requested.length) devWarn('remove ignored duplicate or out-of-range indices')
  if (valid.length === 0) return
  const removed = new Set(valid)
  const oldIndexToNewIndex = new Map<number, number>()
  let nextIndex = 0
  for (let oldIndex = 0; oldIndex < raw.length; oldIndex += 1) {
    if (!removed.has(oldIndex)) oldIndexToNewIndex.set(oldIndex, nextIndex++)
  }
  const committed = form?.mutateList(fullName.value, owner.value, oldIndexToNewIndex, items => {
    for (const index of [...valid].sort((left, right) => right - left)) {
      items.splice(index, 1)
      tokens.value.splice(index, 1)
    }
    previousItems = [...items]
  })
  if (!committed) devWarn('remove ignored because this FormList is not the active owner')
}

const move = (from: number, to: number) => {
  const raw = form?.getValue(fullName.value)
  if (!Array.isArray(raw)) {
    if (raw !== undefined) devWarn('move ignored because the model value is not an array')
    return
  }
  if (!validItemIndex(from, raw.length) || !validItemIndex(to, raw.length)) { devWarn('move indices are outside the current list'); return }
  if (from === to) return
  const order = Array.from({ length: raw.length }, (_item, index) => index)
  const [movedIndex] = order.splice(from, 1)
  order.splice(to, 0, movedIndex)
  const oldIndexToNewIndex = new Map(order.map((oldIndex, newIndex) => [oldIndex, newIndex]))
  const committed = form?.mutateList(fullName.value, owner.value, oldIndexToNewIndex, items => {
    const [item] = items.splice(from, 1)
    items.splice(to, 0, item)
    const [token] = tokens.value.splice(from, 1)
    tokens.value.splice(to, 0, token)
    previousItems = [...items]
  })
  if (!committed) devWarn('move ignored because this FormList is not the active owner')
}

provide(formListNameContextKey, {
  prefix: fullName,
  resolveName: name => resolveNamePath(fullName.value, name),
  resolveOwner: name => {
    const segments = namePathSegments(name)
    const index = segments[0]
    const token = typeof index === 'number' ? tokens.value[index] : undefined
    const tail = typeof index === 'number' ? segments.slice(1) : segments
    return token
      ? `${owner.value}/item:${token}/field:${JSON.stringify(tail)}`
      : `${owner.value}/field:${namePathKey(name)}`
  }
})

onBeforeUnmount(() => {
  if (registeredName !== undefined && registeredOwner !== undefined) {
    form?.unregisterList(registeredName, registeredOwner)
    form?.unregisterOwnedField(registeredName, `${registeredOwner}/root`)
  }
})
</script>

import { shallowRef, type Ref } from 'vue'

export interface CollectionItem<T extends HTMLElement = HTMLElement> {
  key: string
  element: T
  disabled: boolean
  visible: boolean
}

export interface CollectionRegistration<T extends HTMLElement = HTMLElement> {
  key?: string
  element: T
  disabled?: boolean
  visible?: boolean
}

export interface UseCollectionReturn<T extends HTMLElement = HTMLElement> {
  items: Ref<CollectionItem<T>[]>
  register: (item: CollectionRegistration<T>) => { key: string; unregister: () => void }
  unregister: (key: string) => void
  update: (key: string, patch: Partial<Pick<CollectionItem<T>, 'element' | 'disabled' | 'visible'>>) => void
  getItem: (key: string) => CollectionItem<T> | undefined
  getItems: () => CollectionItem<T>[]
  getVisibleItems: () => CollectionItem<T>[]
  getEnabledItems: () => CollectionItem<T>[]
  isVisible: (key: string) => boolean
  isDisabled: (key: string) => boolean
}

/** Internal ordered registry shared by composite components. */
export function useCollection<T extends HTMLElement = HTMLElement>(): UseCollectionReturn<T> {
  const items = shallowRef<CollectionItem<T>[]>([])
  let nextKey = 0
  const makeKey = () => `collection-item-${++nextKey}`
  const getItem = (key: string) => items.value.find((item) => item.key === key)
  const getItems = () => items.value.slice()
  const getVisibleItems = () => items.value.filter((item) => item.visible)
  const getEnabledItems = () => items.value.filter((item) => item.visible && !item.disabled)

  const unregister = (key: string) => {
    const index = items.value.findIndex((item) => item.key === key)
    if (index >= 0) items.value = items.value.filter((item) => item.key !== key)
  }

  const register = (input: CollectionRegistration<T>) => {
    const key = input.key || makeKey()
    // Re-registration updates in place, preserving the original order.
    const existing = getItem(key)
    if (existing) {
      items.value = items.value.map((item) => item.key === key
        ? { ...item, element: input.element, disabled: !!input.disabled, visible: input.visible !== false }
        : item)
    } else {
      items.value = [...items.value, { key, element: input.element, disabled: !!input.disabled, visible: input.visible !== false }]
    }
    return { key, unregister: () => unregister(key) }
  }

  const update = (key: string, patch: Partial<Pick<CollectionItem<T>, 'element' | 'disabled' | 'visible'>>) => {
    const item = getItem(key)
    if (item) items.value = items.value.map((entry) => entry.key === key ? { ...entry, ...patch } : entry)
  }

  return {
    items,
    register,
    unregister,
    update,
    getItem,
    getItems,
    getVisibleItems,
    getEnabledItems,
    isVisible: (key) => getItem(key)?.visible === true,
    isDisabled: (key) => getItem(key)?.disabled === true
  }
}

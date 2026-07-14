import { getCurrentInstance, onBeforeUpdate, readonly, ref } from 'vue'

export const usePropPresence = (...names: string[]) => {
  const instance = getCurrentInstance()
  const readPresence = () => {
    const vnodeProps = instance?.vnode.props ?? {}
    return names.some((name) => Object.prototype.hasOwnProperty.call(vnodeProps, name))
  }
  const present = ref(readPresence())

  onBeforeUpdate(() => {
    present.value = readPresence()
  })

  return readonly(present)
}

import type { App, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <T>(component: T, name: string) => {
  ;(component as SFCWithInstall<T>).install = (app: App) => {
    app.component(name, component as SFCWithInstall<T>)
  }

  return component as SFCWithInstall<T>
}

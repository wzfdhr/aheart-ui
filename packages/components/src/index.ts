import type { App, Plugin } from 'vue'
import Button from './button'
import ConfigProvider from './config-provider'
import './theme/index.css'

const components = [Button, ConfigProvider]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button, ConfigProvider }
export default AheartUI

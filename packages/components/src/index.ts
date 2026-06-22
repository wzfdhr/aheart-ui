import type { App, Plugin } from 'vue'
import Button from './button'
import ConfigProvider from './config-provider'
import Divider from './divider'
import Flex from './flex'
import Space from './space'
import './theme/index.css'

const components = [Button, ConfigProvider, Space, Divider, Flex]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button, ConfigProvider, Space, Divider, Flex }
export default AheartUI

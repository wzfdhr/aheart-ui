import type { App, Plugin } from 'vue'
import Button from './button'
import './theme/index.css'

const components = [Button]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button }
export default AheartUI

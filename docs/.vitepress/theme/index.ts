import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AheartUI from 'aheart-ui'
import AheartDnd from '@aheart-ui/dnd'
import 'aheart-ui/es/style.css'
import '@aheart-ui/dnd/style.css'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AheartUI)
    app.use(AheartDnd)
  }
}

export default theme

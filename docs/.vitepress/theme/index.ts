import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AheartUI from 'aheart-ui'
import 'aheart-ui/es/style.css'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AheartUI)
  }
}

export default theme

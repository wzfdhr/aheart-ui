import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AheartUI from 'aheart-ui'
import AheartAI from '@aheart-ui/ai'
import AheartDnd from '@aheart-ui/dnd'
import 'aheart-ui/es/style.css'
import '@aheart-ui/ai/style.css'
import '@aheart-ui/dnd/style.css'
import './style.css'
import ComponentContext from './ComponentContext.vue'
import ComponentOverview from './ComponentOverview.vue'
import QualityMatrix from './QualityMatrix.vue'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(ComponentContext) }),
  enhanceApp({ app }) {
    app.use(AheartUI)
    app.use(AheartAI)
    app.use(AheartDnd)
    app.component('ComponentOverview', ComponentOverview)
    app.component('QualityMatrix', QualityMatrix)
  }
}

export default theme

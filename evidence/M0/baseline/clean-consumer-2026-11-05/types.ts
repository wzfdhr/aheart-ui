import AheartUI from 'aheart-ui'
import AheartDnd, { SortableList } from '@aheart-ui/dnd'
import AheartAI, { AIChatPanel } from '@aheart-ui/ai'
import type { App } from 'vue'
declare const app: App
app.use(AheartUI).use(AheartDnd).use(AheartAI)
export const c = [SortableList, AIChatPanel]

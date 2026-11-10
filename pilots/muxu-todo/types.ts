import { Button, Modal, Select } from 'aheart-ui'
import type { App } from 'vue'
declare const app: App
app.use(Button).use(Modal).use(Select)
export const components = [Button, Modal, Select]

import Button from 'aheart-ui/button'
import Modal from 'aheart-ui/modal'
import Select from 'aheart-ui/select'
import type { App } from 'vue'
declare const app: App
app.use(Button).use(Modal).use(Select)
export const components = [Button, Modal, Select]

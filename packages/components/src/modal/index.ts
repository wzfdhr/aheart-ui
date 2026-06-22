import modal from './modal.vue'
import { withInstall } from '../utils/install'

const Modal = withInstall(modal, 'AModal')

export default Modal
export type { ModalProps } from './types'

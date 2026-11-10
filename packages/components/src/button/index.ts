import button from './button.vue'
import { withInstall } from '../utils/install'

const Button = withInstall(button, 'AButton')

export default Button

export { Button }
export type * from './types'

import textarea from './textarea.vue'
import { withInstall } from '../utils/install'

const Textarea = withInstall(textarea, 'ATextarea')

export type * from './types'
export default Textarea

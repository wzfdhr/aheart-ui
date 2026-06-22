import popover from './popover.vue'
import { withInstall } from '../utils/install'

const Popover = withInstall(popover, 'APopover')

export default Popover
export type { PopoverProps } from './types'

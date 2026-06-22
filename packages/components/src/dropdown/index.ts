import dropdown from './dropdown.vue'
import { withInstall } from '../utils/install'

const Dropdown = withInstall(dropdown, 'ADropdown')

export default Dropdown
export type { DropdownClickInfo, DropdownMenuConfig, DropdownPlacement, DropdownProps, DropdownTrigger } from './types'

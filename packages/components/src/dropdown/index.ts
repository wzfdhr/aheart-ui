import dropdown from './dropdown.vue'
import dropdownButton from './dropdown-button.vue'
import { withInstall, type SFCWithInstall } from '../utils/install'

export const DropdownButton = withInstall(dropdownButton, 'ADropdownButton')

type DropdownComponent = SFCWithInstall<typeof dropdown> & {
  Button: typeof DropdownButton
}

const Dropdown = withInstall(dropdown, 'ADropdown') as DropdownComponent
Dropdown.Button = DropdownButton

export default Dropdown
export { DropdownButton as ADropdownButton }
export type {
  DropdownButtonProps,
  DropdownButtonRender,
  DropdownClickInfo,
  DropdownMenuConfig,
  DropdownPlacement,
  DropdownProps,
  DropdownTrigger
} from './types'

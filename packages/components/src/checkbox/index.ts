import checkbox from './checkbox.vue'
import checkboxGroup from './checkbox-group.vue'
import { withInstall } from '../utils/install'

const Checkbox = withInstall(checkbox, 'ACheckbox')
export const CheckboxGroup = withInstall(checkboxGroup, 'ACheckboxGroup')

export { CheckboxGroup as ACheckboxGroup }
export type { CheckboxGroupProps, CheckboxOption, CheckboxProps, CheckboxValue } from './types'
export default Checkbox

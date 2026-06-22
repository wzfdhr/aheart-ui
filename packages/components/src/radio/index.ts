import radio from './radio.vue'
import radioGroup from './radio-group.vue'
import { withInstall } from '../utils/install'

const Radio = withInstall(radio, 'ARadio')
export const RadioGroup = withInstall(radioGroup, 'ARadioGroup')

export { RadioGroup as ARadioGroup }
export type { RadioButtonStyle, RadioGroupProps, RadioOption, RadioOptionType, RadioProps, RadioValue } from './types'
export default Radio

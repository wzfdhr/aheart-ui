import inputNumber from './input-number.vue'
import { withInstall } from '../utils/install'

const InputNumber = withInstall(inputNumber, 'AInputNumber')

export type * from './types'
export default InputNumber

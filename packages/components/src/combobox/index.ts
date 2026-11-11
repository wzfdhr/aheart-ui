import combobox from './combobox.vue'
import { withInstall } from '../utils/install'

const Combobox = withInstall(combobox, 'ACombobox')

export type * from './types'
export { Combobox, Combobox as ACombobox }
export default Combobox

import form from './form.vue'
import formItem from './form-item.vue'
import { withInstall } from '../utils/install'

const Form = withInstall(form, 'AForm')
export const FormItem = withInstall(formItem, 'AFormItem')

export { FormItem as AFormItem }
export default Form
export type * from './types'

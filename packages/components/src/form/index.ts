import form from './form.vue'
import formItem from './form-item.vue'
import formList from './form-list.vue'
import { withInstall } from '../utils/install'

const Form = withInstall(form, 'AForm')
export const FormItem = withInstall(formItem, 'AFormItem')
export const FormList = withInstall(formList, 'AFormList')

export { FormItem as AFormItem }
export { FormList as AFormList }
export default Form
export type * from './types'

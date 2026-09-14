import { h } from 'vue'
import { AFormList, Form, FormItem, FormList } from 'aheart-ui'
import type { FormListField, FormListOperations, FormListProps, FormListSlotProps } from 'aheart-ui'

const props: FormListProps = { name: 'users', initialValue: [] }
const field: FormListField = { key: 'stable', fieldKey: 'stable', name: 0 }
const operations: FormListOperations = {
  add: (_value, _index) => undefined,
  remove: (_index) => undefined,
  move: (_from, _to) => undefined
}
const consume = (_slot: FormListSlotProps) => undefined

consume({ fields: [field], errors: [], ...operations })
h(Form, { model: { users: [] } }, () => h(FormList, props))
h(FormItem, { name: ['users', 0, 'email'] })
h(AFormList, props)

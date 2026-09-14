import { defineComponent, h, reactive, ref } from 'vue'
import Form, { FormItem, FormList } from 'aheart-ui/es/form/index.js'

export const makeConsumerApp = () => defineComponent({
  name: 'FormListConsumerApp',
  setup() {
    const model = reactive({ users: [{ id: 'a', email: 'a@example.com' }, { id: 'b', email: 'b@example.com' }] })
    const form = ref()
    let list
    const row = field => h('div', { key: field.key, 'data-row-key': field.key, 'data-row-id': model.users[field.name].id }, [
      h(FormItem, { name: [field.name, 'email'], label: `Email ${model.users[field.name].id}`, rules: [{ required: true, message: 'required' }] }, () => h('input', {
        value: model.users[field.name].email,
        onInput: event => { model.users[field.name].email = event.target.value }
      }))
    ])
    return () => h('main', { 'data-form-list-consumer': '' }, [
      h(Form, { ref: form, model, validateTrigger: 'change' }, {
        default: () => h(FormList, { name: 'users' }, {
          default: scope => {
            list = scope
            return [
              h('button', { type: 'button', 'data-add': '', onClick: () => scope.add({ id: 'c', email: 'c@example.com' }) }, 'Add'),
              h('button', { type: 'button', 'data-move': '', onClick: () => scope.move(1, 0) }, 'Move'),
              h('button', { type: 'button', 'data-error': '', onClick: () => form.value.setFieldsErrors([{ name: ['users', 1, 'email'], errors: ['server'] }]) }, 'Error'),
              h('button', { type: 'button', 'data-reset': '', onClick: () => form.value.resetFields(['users']) }, 'Reset'),
              h('output', { 'data-state': '' }, `${model.users.map(user => user.id).join(',')}|${scope.fields.map(field => field.key).join(',')}`),
              ...scope.fields.map(row)
            ]
          }
        })
      })
    ])
  }
})

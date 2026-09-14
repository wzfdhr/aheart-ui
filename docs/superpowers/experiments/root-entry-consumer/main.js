import { createApp, h } from 'vue'
import { Form, FormItem, FormList } from 'aheart-ui'
import 'aheart-ui/style.css'

const App = {
  setup() {
    return () => h(Form, { model: { users: [{ email: 'root@example.com' }] } }, {
      default: () => h(FormList, { name: 'users' }, {
        default: scope => scope.fields.map(field => h(FormItem, { key: field.key, name: [field.name, 'email'], label: 'Email' }, () => h('input')))
      })
    })
  }
}

createApp(App).mount('#app')

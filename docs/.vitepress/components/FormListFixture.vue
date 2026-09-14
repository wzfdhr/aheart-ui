<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import type { FormNamePath } from 'aheart-ui'

interface UserRow {
  id: string
  email: string
  phones: Array<{ number: string }>
}

interface FormRef {
  resetFields: (names?: FormNamePath[]) => void
  setFieldsErrors: (fields: Array<{ name: FormNamePath; errors: string[] }>) => void
}

const initialUsers: UserRow[] = [
  { id: 'ada', email: 'ada@example.com', phones: [{ number: '1001' }] },
  { id: 'grace', email: 'grace@example.com', phones: [{ number: '1002' }] },
  { id: 'linus', email: 'linus@example.com', phones: [{ number: '1003' }] }
]
const cloneUsers = () => initialUsers.map(user => ({ ...user, phones: user.phones.map(phone => ({ ...phone })) }))
const model = reactive<{ users: UserRow[] }>({ users: cloneUsers() })
const formRef = ref<FormRef>()
const sequence = ref(0)
const action = ref('ready')
const listRules = [{ type: 'array' as const, min: 2, message: '至少保留两位成员' }]
const emailRules = [{ required: true, message: '请输入邮箱' }, { type: 'email' as const, message: '邮箱格式无效' }]
const order = computed(() => model.users.map(user => user.id).join(','))

const makeUser = (prefix: string): UserRow => {
  sequence.value += 1
  return { id: `${prefix}-${sequence.value}`, email: `${prefix}-${sequence.value}@example.com`, phones: [{ number: `20${sequence.value}` }] }
}
const reset = () => {
  formRef.value?.resetFields(['users'])
  action.value = 'reset'
}
const reverseExternally = () => {
  model.users = [...model.users].reverse()
  action.value = 'external-reverse'
}
const setGraceError = () => {
  const index = model.users.findIndex(user => user.id === 'grace')
  if (index >= 0) formRef.value?.setFieldsErrors([{ name: ['users', index, 'email'], errors: ['Grace server error'] }])
  action.value = 'server-error'
}
const moveMember = async (
  event: Event,
  move: (from: number, to: number) => void,
  from: number,
  to: number,
  id: string,
  length: number
) => {
  const ownerDocument = (event.currentTarget as HTMLElement | null)?.ownerDocument
  move(from, to)
  action.value = from > to ? 'move-up' : 'move-down'
  await nextTick()
  const direction = to === 0 ? 'down' : to === length - 1 ? 'up' : from > to ? 'up' : 'down'
  ownerDocument?.querySelector<HTMLElement>(`[data-testid="move-${direction}-${id}"]`)?.focus({ preventScroll: true })
}
const removeMember = async (
  event: Event,
  remove: (index: number) => void,
  index: number
) => {
  const ownerDocument = (event.currentTarget as HTMLElement | null)?.ownerDocument
  const nextId = model.users[index + 1]?.id ?? model.users[index - 1]?.id
  remove(index)
  action.value = 'remove-row'
  await nextTick()
  const target = nextId
    ? ownerDocument?.querySelector<HTMLElement>(`[data-testid="remove-${nextId}"]`)
    : ownerDocument?.querySelector<HTMLElement>('[data-testid="form-list-add"]')
  target?.focus({ preventScroll: true })
}
const removePhoneWithFocus = async (
  event: Event,
  remove: (index: number) => void,
  index: number,
  userId: string
) => {
  const ownerDocument = (event.currentTarget as HTMLElement | null)?.ownerDocument
  remove(index)
  await nextTick()
  ownerDocument?.querySelector<HTMLElement>(`[data-testid="phone-add-${userId}"]`)?.focus({ preventScroll: true })
}
</script>

<template>
  <section class="form-list-fixture" data-testid="form-list-fixture" aria-label="Form.List dynamic array fixture">
    <header>
      <p class="form-list-fixture__eyebrow">FORM.LIST OPTIMIZATION</p>
      <h2>Dynamic team members</h2>
      <p>Stable keyed rows keep validation and focus ownership while indices change.</p>
    </header>

    <AForm ref="formRef" :model="model" layout="vertical" validate-trigger="change">
      <AFormList name="users" :rules="listRules" v-slot="{ fields, add, remove, move, errors }">
        <div class="form-list-fixture__toolbar" aria-label="List operations">
          <button type="button" data-testid="form-list-add" @click="add(makeUser('append')); action = 'append'">Add member</button>
          <button type="button" data-testid="form-list-insert" @click="add(makeUser('insert'), 1); action = 'insert-1'">Insert at 2</button>
          <button type="button" data-testid="form-list-remove-second" :disabled="fields.length < 2" @click="remove(1); action = 'remove-1'">Remove second</button>
          <button type="button" data-testid="form-list-multi-remove" :disabled="fields.length < 3" @click="remove([0, fields.length - 1]); action = 'remove-edges'">Remove edges</button>
          <button type="button" data-testid="form-list-reverse" @click="reverseExternally">External reverse</button>
          <button type="button" data-testid="form-list-server-error" @click="setGraceError">Set Grace error</button>
          <button type="button" data-testid="form-list-reset" @click="reset">Reset list</button>
        </div>

        <p v-if="errors.length" class="form-list-fixture__list-error" role="alert" data-testid="form-list-errors">{{ errors.join('; ') }}</p>

        <div class="form-list-fixture__rows" data-testid="form-list-rows">
          <article
            v-for="field in fields"
            :key="field.key"
            class="form-list-fixture__row"
            :data-field-key="field.key"
            :data-row-id="model.users[field.name]?.id"
            :aria-label="`Member ${model.users[field.name]?.id}`"
          >
            <div class="form-list-fixture__row-head">
              <strong>{{ field.name + 1 }} · {{ model.users[field.name]?.id }}</strong>
              <span>key={{ field.key }}</span>
            </div>
            <AFormItem :name="[field.name, 'email']" :label="`Email · ${model.users[field.name].id}`" :rules="emailRules">
              <AInput v-model="model.users[field.name].email" />
            </AFormItem>
            <AFormList :name="[field.name, 'phones']" v-slot="{ fields: phoneFields, add: addPhone, remove: removePhone }">
              <div class="form-list-fixture__phones">
                <AFormItem
                  v-for="phone in phoneFields"
                  :key="phone.key"
                  :name="[phone.name, 'number']"
                  :label="`Phone ${phone.name + 1} · ${model.users[field.name].id}`"
                  :rules="[{ required: true, message: '请输入电话' }]"
                >
                  <AInput v-model="model.users[field.name].phones[phone.name].number" />
                </AFormItem>
                <button type="button" :aria-label="`Add phone for ${model.users[field.name].id}`" :data-testid="`phone-add-${model.users[field.name].id}`" @click="addPhone({ number: '' })">Add phone</button>
                <button v-if="phoneFields.length > 1" type="button" :aria-label="`Remove last phone for ${model.users[field.name].id}`" :data-testid="`phone-remove-${model.users[field.name].id}`" @click="removePhoneWithFocus($event, removePhone, phoneFields.length - 1, model.users[field.name].id)">Remove phone</button>
              </div>
            </AFormList>
            <div class="form-list-fixture__row-actions">
              <button type="button" :aria-label="`Move ${model.users[field.name].id} up`" :data-testid="`move-up-${model.users[field.name].id}`" :disabled="field.name === 0" @click="moveMember($event, move, field.name, field.name - 1, model.users[field.name].id, fields.length)">Move up</button>
              <button type="button" :aria-label="`Move ${model.users[field.name].id} down`" :data-testid="`move-down-${model.users[field.name].id}`" :disabled="field.name === fields.length - 1" @click="moveMember($event, move, field.name, field.name + 1, model.users[field.name].id, fields.length)">Move down</button>
              <button type="button" :aria-label="`Remove ${model.users[field.name].id}`" :data-testid="`remove-${model.users[field.name].id}`" @click="removeMember($event, remove, field.name)">Remove member</button>
            </div>
          </article>
        </div>

        <output class="form-list-fixture__state" data-testid="form-list-state" aria-live="polite">
          count={{ fields.length }}; order={{ order }}; action={{ action }}; keys={{ fields.map(field => field.key).join(',') }}
        </output>
      </AFormList>
    </AForm>
  </section>
</template>

<style scoped>
.form-list-fixture { --aheart-color-danger: #b42318; max-width: 820px; margin: 24px auto; padding: 24px; border: 1px solid var(--vp-c-divider); border-radius: 16px; background: var(--vp-c-bg-soft); }
.form-list-fixture__eyebrow { margin: 0; color: var(--vp-c-brand-1); font-size: 12px; font-weight: 700; letter-spacing: .12em; }
.form-list-fixture h2 { margin: 4px 0; }
.form-list-fixture header > p:last-child { margin: 0 0 16px; color: var(--vp-c-text-2); }
.form-list-fixture__toolbar, .form-list-fixture__row-actions, .form-list-fixture__phones { display: flex; flex-wrap: wrap; gap: 8px; }
.form-list-fixture button { min-height: 36px; padding: 6px 10px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; }
.form-list-fixture button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.form-list-fixture button:disabled { cursor: not-allowed; opacity: .45; }
.form-list-fixture__rows { display: grid; gap: 12px; margin-top: 16px; }
.form-list-fixture__row { min-width: 0; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); }
.form-list-fixture__row-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.form-list-fixture__row-head span { min-width: 0; overflow: hidden; color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.form-list-fixture__phones { align-items: end; margin-bottom: 12px; }
.form-list-fixture__phones :deep(.aheart-form-item) { flex: 1 1 240px; margin-bottom: 0; }
.form-list-fixture__list-error { margin: 12px 0 0; color: var(--aheart-color-danger); }
.form-list-fixture__state { display: block; overflow-wrap: anywhere; margin-top: 16px; padding: 10px 12px; border-radius: 8px; background: var(--vp-c-bg-alt); font-family: var(--vp-font-family-mono); font-size: 12px; }
@media (max-width: 640px) {
  .form-list-fixture { margin: 12px 0; padding: 14px; }
  .form-list-fixture__toolbar button { flex: 1 1 130px; }
  .form-list-fixture__row-head { display: block; }
  .form-list-fixture__row-head span { display: block; margin-top: 4px; }
}
</style>

# Form.List optimization architecture

Status: architecture draft. No implementation is released by this document. The implementation gate remains closed until an architecture review records P0/P1/P2=`0/0/0` and a genuine RED is captured against the approved contract.

Baseline: master `19a0bf88c7701071f2b788845a030751cfd249c3`. Delivery branch: `codex/form-list-optimization`. This is the first remaining item in the approved optimization sequence after D4 delivery closure. D0-D3 final review, D9, npm publication and aheart-ui v2 are not started by this phase.

## Outcome and compatibility boundary

Add an installable `AFormList` / `FormList` component that composes with the existing `AForm`, `AFormItem`, nested name paths, validation, dependencies, server errors, preserve semantics and AIForm-backed core. It supplies dynamic array fields with add, remove and move operations while keeping each surviving item's render identity and field-owned synchronous error state stable.

Existing `FormNamePath` semantics remain unchanged: a top-level string is a literal property name, not a dotted path. No new package or major dependency is allowed. Existing Form behavior outside a FormList must remain byte-compatible at the public API level and behavior-compatible in tests.

## Public API

```ts
export interface FormListField {
  /** Stable for the lifetime of this logical item, including add/remove/move. */
  key: string
  /** Current array index; use in descendant FormItem name paths. */
  name: number
  /** Alias of key for consumers that forward Ant-style field props. */
  fieldKey: string
}

export interface FormListOperations {
  add: (defaultValue?: unknown, insertIndex?: number) => void
  remove: (index: number | readonly number[]) => void
  move: (from: number, to: number) => void
}

export interface FormListSlotProps extends FormListOperations {
  fields: FormListField[]
  errors: string[]
}
```

`FormList` props:

- `name: FormNamePath` is required and resolves relative to an enclosing FormList.
- `initialValue?: unknown[]` initializes the list only when the model path is `undefined`. An existing model value always wins. Initialization is delegated to Form so the cloned value is written to both the live model and Form's reset snapshot before the list is exposed. The value uses the same plain-object/array/Date/Map/Set cloning policy as Form reset snapshots.
- `rules?: FormRule[]` validates the array through the existing Form rule engine. List operations participate in the inherited Form `validateTrigger`; no separate trigger API is added.
- `preserve?: boolean` inherits Form when omitted and controls unmount only. Explicit `remove` always removes values and field state.

The default slot receives `FormListSlotProps`. Example:

```vue
<AFormList name="users" v-slot="{ fields, add, remove, move, errors }">
  <div v-for="field in fields" :key="field.key">
    <AFormItem :name="[field.name, 'email']" />
  </div>
</AFormList>
```

Inside a FormList, descendant `FormItem.name`, `FormItem.dependencies`, and nested `FormList.name` are relative to the list prefix. A string remains one literal segment. Form APIs continue to accept full model paths.

## Operation contract

- `add(value)` appends; `add(value, index)` inserts before a valid integer index in `[0, length]`. An invalid index performs no mutation and emits a development-only warning.
- `remove(index | indices)` removes unique valid integer indices in one atomic operation. Invalid entries are ignored with a development-only warning; an input with no valid indices is a no-op.
- `move(from, to)` atomically moves one item when both indices are valid integers in `[0, length - 1]`. Equal indices are a no-op. Invalid input warns in development and does not mutate.
- Every successful operation mutates the existing array at the model path so the established reactive model contract is preserved. If the path is `undefined`, `add` first creates an array. A defined non-array value is invalid: all operations are safe no-ops with a development-only warning and production does not throw.
- One operation produces one logical Form change batch. It invalidates an in-flight whole-form submission and list/affected async validations before a late result can commit.

## Stable identity and state migration

FormList owns an SSR-stable instance id and a monotonic per-list item token. Initial tokens are deterministic by initial position; new tokens are never reused. `fields[index].key` and `fieldKey` derive from that token, while `name` always reflects the current index.

Form owns an internal list coordinator registered by full list path plus an owner token. Component operations are submitted to that coordinator as `{ previousItems, nextItems, oldIndexToNewIndex }`; direct external model changes are intercepted by Form's synchronous deep-model observer, which asks registered coordinators to reconcile before ordinary field invalidation. A FormList watcher is not allowed to perform a later best-effort repair. For component-owned `add`, `remove`, and `move`, Form and FormList perform one atomic remap before Vue field lifecycle callbacks settle:

- surviving item keys and keyed DOM subtrees follow logical items;
- descendant registered names move from the old index prefix to the new prefix;
- synchronous rule errors and externally supplied server errors follow the logical item;
- removed field errors, pending validation work, dependency tasks and notification snapshots are retired;
- moved async validations are invalidated rather than rebound to a different index; late completions are stale and cannot write errors or finish a submission;
- descendant relative dependencies move with their owning item; dependencies declared outside the list keep index semantics;
- the list root error is cleared and revalidated according to its effective change trigger; other fields depending on the list value are revalidated once.

Form field and list-coordinator registration gain internal owner tokens. Unregistering an old path after a move may only retire state owned by the same token, preventing a moved component or nested list from deleting the state/controller now occupying its previous index. An outer list remap updates nested coordinator paths and relative prefixes in the same snapshot/write transaction. Owner tokens and coordinator APIs are internal and are not exported.

## External model changes

The model remains the source of truth. Form's synchronous observer asks FormList to reconcile direct external array changes before validating path differences:

- unchanged positions keep their keys when the value at that position was edited or replaced and no reliable move can be inferred;
- retained object/function identities that changed position keep their keys, with first-unused reference matching for duplicates;
- common primitive prefixes/suffixes survive clear insertion/removal, but same-length primitive edits or reorders keep positional keys because business identity cannot be inferred safely;
- newly observed positions receive new keys and removed positions retire their state;
- fresh cloned objects keep positional keys when the array length is unchanged; on ambiguous insert/remove they are treated as new middle items. FormList does not guess structural equality and does not add an `itemKey` API in this phase.

External mutations use the same path-state reconciliation and async invalidation rules as component operations. They do not emit a synthetic update event because Form currently accepts a mutable model rather than a controlled `v-model` contract.

## Initialization, reset and lifecycle

- Model value wins over `initialValue`; FormList never overwrites an existing empty array. Form's internal `initializeList` operation records an accepted initial value in both the model and the mutable reset snapshot, so `resetFields([listPath])` restores it even though Form setup ran before the child list mounted.
- SSR and the client's first render generate the same initial field keys and slot order. Watchers or measurements do not alter first-render markup.
- `resetFields([listPath])` restores the Form-level initial array snapshot. The restored items receive a deterministic fresh client identity set after reset; stale pre-reset validations and field ownership cannot commit.
- Targeted descendant reset remains path/index based, matching existing Form APIs.
- On FormList unmount, `preserve=true` keeps the array value but retires registrations; `preserve=false` deletes the list path through the existing Form lifecycle contract. Re-mounting creates a new list instance identity.
- Nested FormLists compose prefixes and ownership without exposing internal context. Outer add/remove/move and external reconciliation atomically remap nested coordinator registrations before their component lifecycle callbacks run.

## Accessibility and rendering

FormList is renderless and adds no generic list semantics, buttons, labels, focus movement or live region. Those belong to consumer markup because FormList cannot infer the meaning of a row or operation. Stable slot keys preserve focused descendant DOM during move when the consumer uses `:key="field.key"`; removing the focused row does not invent a focus destination. Documentation examples must label operation controls and demonstrate error rendering with `role="alert"` or an `AFormItem` help region.

## Diagnostics and unsupported input

Development warnings cover missing Form parent, non-array model values, invalid indices, duplicate/invalid remove indices, and two live FormList coordinators attempting to own the same full path. Unsafe or empty paths retain the existing Form normalizer's thrown security error instead of being downgraded. The first live list owner remains authoritative; a duplicate instance is render-safe but inert for its lifetime and must remount after the first owner unregisters to acquire ownership. Production remains safe and deterministic for operation/input diagnostics. No warning is emitted for an intentional equal-index move or no-op remove array.

## Verification gates

- Genuine RED for missing exports/component plus behavioral failures for add, insert, multi-remove, move, nested lists, stable DOM identity, path remap, errors, dependencies, async stale results, initial value, reset, preserve, external mutations and non-array fallback.
- Focused unit/type/SSR tests, then full components tests, AI tests, typecheck, deterministic double build, generated output and release pack.
- Browser tests in desktop/mobile Chromium, desktop Firefox and desktop/mobile WebKit for dynamic operations, validation/error movement, keyboard-operable consumer controls, focus retention on move, nested paths, zoom/narrow layout, iframe realm, hydration and teardown diagnostics.
- Real packed consumer with no workspace links validates root ESM/CJS/types/CSS plus SSR/hydration and a Form-only build through the published `es/form/index.js` subpath. It must reject unrelated Table/Cascader/TreeSelect/Upload code in that bundle. Root-entry by-demand tree shaking remains a D9 package-architecture gate and is not silently redefined by this phase.
- Independent development-manager, test-manager, screenshot-first design and product acceptance reports; P0/P1/P2 must be `0/0/0` before PR Ready or merge.
- Exact-head PR CI, squash merge, master CI, Pages and deployed interaction verification complete the phase. npm publication, D9 physical-device gates and v2 remain later work.

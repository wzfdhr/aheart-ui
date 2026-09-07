<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TreeKey, TreeNodeData } from 'aheart-ui'

const treeData: TreeNodeData[] = [
  {
    key: 'root', title: '根节点', children: [
      { key: 'level-one', title: '一级子节点', children: [{ key: 'level-two', title: '二级子节点' }] },
      { key: 'optional-leaf', title: '可选叶节点' },
      { key: 'disabled-leaf', title: '禁用叶节点', disabled: true }
    ]
  },
  { key: 'another-leaf', title: '另一个叶节点' }
]
const expandedKeys = ref<TreeKey[]>([])
const selectedKeys = ref<TreeKey[]>([])
const checkedKeys = ref<TreeKey[]>([])
const acceptExpand = ref(true)
const acceptSelect = ref(true)
const acceptCheck = ref(false)
const treeDisabled = ref(false)
const expandEvents = ref(0)
const selectEvents = ref(0)
const checkEvents = ref(0)
const actionStatus = ref('准备就绪：键盘焦点位于根节点')
const keyText = (keys: TreeKey[]) => `[${keys.join(',')}]`
const stateText = computed(() => `expanded=${keyText(expandedKeys.value)} · selected=${keyText(selectedKeys.value)} · checked=${keyText(checkedKeys.value)} · expand-events=${expandEvents.value} · select-events=${selectEvents.value} · check-events=${checkEvents.value}`)
const announce = (message: string) => { actionStatus.value = message }
const onExpanded = (keys: TreeKey[]) => { expandEvents.value++; if (acceptExpand.value) expandedKeys.value = keys; announce(acceptExpand.value ? `已接受展开更新：${keyText(keys)}` : '已拒绝展开更新，树保持折叠') }
const onSelected = (keys: TreeKey[]) => { selectEvents.value++; if (acceptSelect.value) selectedKeys.value = keys; announce(acceptSelect.value ? `已接受选择更新：${keyText(keys)}` : '已拒绝选择更新，选中状态不变') }
const onChecked = (keys: TreeKey[]) => { checkEvents.value++; if (acceptCheck.value) checkedKeys.value = keys; announce(acceptCheck.value ? `已接受勾选更新：${keyText(keys)}` : '已拒绝勾选更新，原生勾选框已恢复') }
const toggle = (name: 'expand' | 'select' | 'check') => {
  if (name === 'expand') { acceptExpand.value = !acceptExpand.value; announce(acceptExpand.value ? '展开更新：接受' : '展开更新：拒绝') }
  if (name === 'select') { acceptSelect.value = !acceptSelect.value; announce(acceptSelect.value ? '选择更新：接受' : '选择更新：拒绝') }
  if (name === 'check') { acceptCheck.value = !acceptCheck.value; announce(acceptCheck.value ? '勾选更新：接受' : '勾选更新：拒绝') }
}
const toggleDisabled = () => { treeDisabled.value = !treeDisabled.value; announce(treeDisabled.value ? '整树已禁用' : '整树已启用') }
const collapseExternally = () => { expandedKeys.value = []; announce('外部折叠已执行，树内活动项回到最近可见祖先') }
const linkedData: TreeNodeData[] = [{ key: 'group', title: '研发组', children: [{ key: 'frontend', title: '前端' }, { key: 'backend', title: '后端' }, { key: 'locked', title: '受限节点', disabled: true }] }]
const linkedChecked = ref<TreeKey[]>(['frontend'])
const halfChecked = ref<TreeKey[]>(['group'])
const lazyData: TreeNodeData[] = [{ key: 'lazy', title: '按需加载组', isLeaf: false }]
let loadAttempts = 0
const loadTreeChildren = async (_node: TreeNodeData, { signal }: { signal: AbortSignal }) => {
  loadAttempts++
  await new Promise<void>((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new Error('cancelled')) }
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, 200)
    signal.addEventListener('abort', abort, { once: true })
  })
  if (loadAttempts === 1) throw new Error('演示首次失败')
  return [{ key: 'loaded', title: '已加载节点' }]
}
</script>

# Tree 树形控件 <span class="aheart-status aheart-status--ready">已完成</span>

按层级展示、选择和勾选结构化数据；支持可见节点键盘导航，以及受控状态的接受/拒绝演示。

## QG3 受控交互工作台

<section class="tree-workbench aheart-demo-panel" role="region" aria-label="树交互工作台">
  <div class="tree-workbench__toolbar">
    <div>
      <p class="tree-workbench__eyebrow">CONTROLLED TREE / QG3</p>
      <h3>把每一次状态变化都看得见</h3>
      <p>用 Tab 进入树后，使用 ↑ ↓、Home、End、←、→、Enter 和 Space 操作。</p>
    </div>
    <div class="tree-workbench__actions" aria-label="受控策略">
      <button type="button" @click="toggle('expand')">{{ acceptExpand ? '拒绝展开更新' : '接受展开更新' }}</button>
      <button type="button" @click="toggle('select')">{{ acceptSelect ? '拒绝选择更新' : '接受选择更新' }}</button>
      <button type="button" @click="toggle('check')">{{ acceptCheck ? '拒绝勾选更新' : '接受勾选更新' }}</button>
      <button type="button" @click="toggleDisabled">{{ treeDisabled ? '启用整树' : '禁用整树' }}</button>
      <button type="button" @click="collapseExternally">外部折叠</button>
    </div>
  </div>
  <div class="tree-workbench__body">
    <div class="tree-workbench__tree">
      <ATree
        aria-label="受控三层树"
        :tree-data="treeData"
        :expanded-keys="expandedKeys"
        :selected-keys="selectedKeys"
        :checked-keys="checkedKeys"
        :disabled="treeDisabled"
        checkable
        multiple
        @update:expanded-keys="onExpanded"
        @update:selected-keys="onSelected"
        @update:checked-keys="onChecked"
      />
    </div>
    <aside class="tree-workbench__readout" aria-label="树状态">
      <p class="tree-workbench__eyebrow">LIVE STATE</p>
      <output data-testid="tree-state">{{ stateText }}</output>
      <div class="tree-workbench__legend">
        <span><i class="is-on" />接受</span><span><i />拒绝</span><span>禁用叶节点不可交互</span>
      </div>
    </aside>
  </div>
  <p class="tree-workbench__status" role="status" aria-live="polite">{{ actionStatus }}</p>
</section>

### 基础用法

```vue
<ATree :tree-data="treeData" :default-expanded-keys="['workspace']" />
```

方向键在可见节点间移动焦点；→ 先展开分支，确认展开后进入第一个子节点；← 收起或移至父节点；Home/End 跳到首/末可见节点；Enter 选择，Space 在 `checkable` 时勾选。

## 联动勾选与按需加载

<section class="aheart-demo-panel" aria-label="D4 树联动示例">
  <ATree :tree-data="linkedData" v-model:checked-keys="linkedChecked" :default-expanded-keys="['group']" checkable :check-strictly="false" @check="(_keys, _node, info) => halfChecked = info.halfCheckedKeys" />
  <p role="status">已勾选：{{ linkedChecked.join(',') }}；半选：{{ halfChecked.join(',') }}</p>
</section>

`checkStrictly` 默认为 `true`，保留独立勾选。显式设为 `false` 后父子联动，禁用节点及其子树作为边界；半选仅通过第三个事件参数 `info.halfCheckedKeys` 提供，不进入 `checkedKeys`。受控值被父层拒绝时，复选框和半选状态回到已接受的值。

<section class="aheart-demo-panel" aria-label="D4 树加载示例">
  <ATree :tree-data="lazyData" :load-data="loadTreeChildren" />
</section>

此示例第一次请求失败，点击“重试”后加载子节点。`isLeaf: false` 表示尚可加载的分支；返回数组存入组件内部补丁，返回空数组后成为叶节点，返回 `void` 则等待调用方更新 `treeData`。同节点请求去重；收起、禁用、数据/loader替换及卸载会取消，并隔离忽略取消的迟到结果。SSR阶段不主动请求数据。异步加载期间焦点保持当前节点，加载后可继续用方向键进入子节点。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| treeData | 节点数据 | `TreeNodeData[]` | `[]` |
| expandedKeys | 受控展开节点 | `TreeKey[]` | - |
| defaultExpandedKeys | 非受控初始展开节点 | `TreeKey[]` | `[]` |
| defaultExpandAll | 默认展开所有节点 | `boolean` | `false` |
| selectedKeys | 受控选中节点 | `TreeKey[]` | - |
| defaultSelectedKeys | 非受控初始选中节点 | `TreeKey[]` | `[]` |
| multiple | 是否支持多选 | `boolean` | `false` |
| selectable | 是否可选择 | `boolean` | `true` |
| checkable | 是否显示勾选框 | `boolean` | `false` |
| checkStrictly | 是否独立勾选；false启用联动与半选 | `boolean` | `true` |
| loadData | 可取消的按需加载回调 | `(node, { signal }) => Promise<TreeNodeData[] \| void>` | - |
| checkedKeys | 受控勾选节点 | `TreeKey[]` | - |
| defaultCheckedKeys | 非受控初始勾选节点 | `TreeKey[]` | `[]` |
| disabled | 是否禁用整棵树 | `boolean` | ConfigProvider disabled |

### TreeNodeData

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| key | 节点唯一标识 | `string \| number` |
| title | 节点文本 | `string` |
| disabled | 是否禁用节点及其子树 | `boolean` |
| isLeaf | true明确叶子，false为可按需加载分支 | `boolean` |
| children | 子节点 | `TreeNodeData[]` |

默认勾选仅改变当前节点；启用联动时按完整逻辑树派生父子状态，number/string key保持不同身份。

### 事件

| 事件 | 说明 |
| --- | --- |
| update:expandedKeys | 展开节点变化 |
| update:selectedKeys | 选中节点变化 |
| update:checkedKeys | 勾选节点变化 |
| expand | 展开状态变化 |
| select | 选中状态变化 |
| check | 勾选状态变化 |

<style>
.tree-workbench { color: var(--aheart-color-text); background: var(--aheart-color-bg-container); border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-radius-lg); overflow: hidden; }
.tree-workbench.aheart-demo-panel { margin: 0; padding: 0; }
.tree-workbench.aheart-demo-panel .aheart-tree__list > li + li, .tree-workbench.aheart-demo-panel .aheart-tree__group > li + li { margin-top: 8px; }
.tree-workbench.aheart-demo-panel .aheart-tree__group { margin-block: 8px 0; }
.tree-workbench__toolbar, .tree-workbench__body { display: flex; gap: 24px; justify-content: space-between; padding: 24px; }
.tree-workbench__toolbar { border-bottom: 1px solid var(--aheart-color-border); }
.tree-workbench__toolbar h3 { margin: 4px 0 8px; color: var(--aheart-color-text-heading); }
.tree-workbench__toolbar p { margin: 0; color: var(--aheart-color-text-secondary); }
.tree-workbench__eyebrow { font-size: 11px; letter-spacing: .12em; color: var(--aheart-color-primary); }
.tree-workbench__actions { display: flex; flex-wrap: wrap; gap: 8px; align-content: flex-start; justify-content: flex-end; }
.tree-workbench button { padding: 7px 11px; border: 1px solid var(--aheart-color-border); border-radius: var(--aheart-radius); background: transparent; color: inherit; cursor: pointer; }
.tree-workbench button:hover, .tree-workbench button:focus-visible { border-color: var(--aheart-color-primary); color: var(--aheart-color-primary); }
.tree-workbench__body { align-items: flex-start; }
.tree-workbench__tree { min-width: 0; max-height: 120px; overflow: auto; flex: 1; }
.tree-workbench__tree .aheart-tree { max-height: 120px; overflow: auto; }
.tree-workbench__readout { min-width: 0; flex: 0 1 260px; padding-left: 24px; border-left: 1px solid var(--aheart-color-border); }
.tree-workbench__readout output { display: block; margin-top: 10px; color: var(--aheart-color-primary); line-height: 1.7; overflow-wrap: anywhere; }
.tree-workbench__legend { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px; color: var(--aheart-color-text-secondary); font-size: 12px; }
.tree-workbench__legend i { display: inline-block; width: 7px; height: 7px; margin-right: 5px; border-radius: 50%; background: var(--aheart-color-border); }
.tree-workbench__legend i.is-on { background: var(--aheart-color-primary); }
.tree-workbench__status { margin: 0; padding: 12px 24px; background: var(--aheart-color-fill-secondary); color: var(--aheart-color-text-secondary); }
@media (max-width: 640px) { .tree-workbench__toolbar, .tree-workbench__body { display: block; padding: 16px; } .tree-workbench__actions { justify-content: flex-start; margin-top: 16px; } .tree-workbench__readout { min-width: 0; margin-top: 20px; padding: 20px 0 0; border-top: 1px solid var(--aheart-color-border); border-left: 0; } }
</style>

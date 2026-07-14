<script setup lang="ts">
import { ref } from 'vue'
import type { TreeKey, TreeNodeData } from 'aheart-ui'

const treeData: TreeNodeData[] = [
  { key: 'workspace', title: '工作台', children: [{ key: 'overview', title: '概览' }, { key: 'settings', title: '设置', disabled: true }] },
  { key: 'archive', title: '归档' }
]
const selectedKeys = ref<TreeKey[]>(['overview'])
const checkedKeys = ref<TreeKey[]>([])
</script>

# Tree 树形控件 <span class="aheart-status aheart-status--ready">Ready</span>

按层级展示、选择和勾选结构化数据。

## 基础用法

<ATree :tree-data="treeData" :default-expanded-keys="['workspace']" />

```vue
<ATree :tree-data="treeData" :default-expanded-keys="['workspace']" />
```

## 受控选择与勾选

<ATree
  :tree-data="treeData"
  :default-expanded-keys="['workspace']"
  v-model:selected-keys="selectedKeys"
  v-model:checked-keys="checkedKeys"
  checkable
  multiple
/>

```vue
<ATree
  :tree-data="treeData"
  v-model:selected-keys="selectedKeys"
  v-model:checked-keys="checkedKeys"
  checkable
  multiple
/>
```

使用方向键在可见节点间移动焦点；右方向键展开，左方向键收起或移至父节点，Enter 选择，Space 在启用 `checkable` 时勾选，否则选择节点。

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
| checkedKeys | 受控勾选节点 | `TreeKey[]` | - |
| defaultCheckedKeys | 非受控初始勾选节点 | `TreeKey[]` | `[]` |
| disabled | 是否禁用整棵树 | `boolean` | `false` |

### TreeNodeData

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| key | 节点唯一标识 | `string \| number` |
| title | 节点文本 | `string` |
| disabled | 是否禁用节点 | `boolean` |
| children | 子节点 | `TreeNodeData[]` |

首版的勾选仅改变当前节点，不自动级联父节点或子节点。

### 事件

| 事件 | 说明 |
| --- | --- |
| update:expandedKeys | 展开节点变化 |
| update:selectedKeys | 选中节点变化 |
| update:checkedKeys | 勾选节点变化 |
| expand | 展开状态变化 |
| select | 选中状态变化 |
| check | 勾选状态变化 |

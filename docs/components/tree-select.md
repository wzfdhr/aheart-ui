<script setup lang="ts">
import { ref } from 'vue'

const treeData = [
  { key: 'workspace', title: '工作台', children: [{ key: 'overview', title: '概览' }, { key: 'settings', title: '设置' }] },
  { key: 'archive', title: '归档' }
]
const value = ref<string>()
const values = ref<string[]>(['archive'])
</script>

# TreeSelect 树选择 <span class="aheart-status aheart-status--ready">Ready</span>

在下拉面板中选择层级数据，复用 Tree 的禁用、展开和键盘操作。

## 基础用法

<ATreeSelect v-model="value" :tree-data="treeData" placeholder="选择页面" />

```vue
<ATreeSelect v-model="value" :tree-data="treeData" placeholder="选择页面" />
```

## 多选与搜索

<ATreeSelect v-model="values" :tree-data="treeData" multiple show-search />

```vue
<ATreeSelect v-model="values" :tree-data="treeData" multiple show-search />
```

搜索时会自动展开包含匹配节点的路径；清空搜索后恢复 Tree 原有展开状态。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| treeData | 树节点数据 | `TreeNodeData[]` | `[]` |
| modelValue | 受控值 | `TreeKey \| TreeKey[]` | - |
| defaultValue | 非受控初始值 | `TreeKey \| TreeKey[]` | - |
| multiple | 是否多选 | `boolean` | `false` |
| showSearch | 是否显示搜索框 | `boolean` | `false` |
| placeholder | 无选中值时的提示文字 | `string` | `请选择` |
| disabled | 是否禁用 | `boolean` | `false` |

| 事件 | 说明 |
| --- | --- |
| update:modelValue | 选择值变化 |
| change | 选择值变化 |

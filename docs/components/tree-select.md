<script setup lang="ts">
import { ref } from 'vue'

const treeData = [
  { key: 'workspace', title: '工作台', children: [{ key: 'overview', title: '概览' }, { key: 'settings', title: '设置' }] },
  { key: 'archive', title: '归档' }
]
const value = ref<string>()
const values = ref<string[]>(['archive'])
const checkedValues = ref<string[]>([])
</script>

# TreeSelect 树选择 <span class="aheart-status aheart-status--ready">已完成</span>

在下拉面板中选择层级数据，复用 Tree 的禁用、展开和键盘操作。

## 基础用法

<div class="aheart-demo-panel">
  <ATreeSelect v-model="value" :tree-data="treeData" placeholder="选择页面" allow-clear />
</div>

```vue
<ATreeSelect v-model="value" :tree-data="treeData" placeholder="选择页面" allow-clear />
```

## 多选与搜索

<div class="aheart-demo-panel">
  <ATreeSelect v-model="values" :tree-data="treeData" multiple show-search />
</div>

```vue
<ATreeSelect v-model="values" :tree-data="treeData" multiple show-search />
```

搜索时会自动展开包含匹配节点的路径；清空搜索后恢复 Tree 原有展开状态。

## 联动勾选

<section class="aheart-demo-panel" aria-label="D4 树选择勾选示例">
  <ATreeSelect v-model="checkedValues" :tree-data="treeData" tree-checkable :tree-check-strictly="false" show-search allow-clear aria-label="勾选页面" />
  <p role="status">已勾选：{{ checkedValues.join(',') }}</p>
</section>

开启 `treeCheckable` 后值为完整已勾选key数组，半选不进入值，浮层保持打开。搜索只改变显示范围，联动始终使用完整逻辑树。`treeCheckStrictly` 默认true保留独立勾选；`loadData` 与 Tree 共用内部加载模型和取消契约，加载出的节点标签也用于展示已选值。关闭浮层取消仍在执行的加载。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| treeData | 树节点数据 | `TreeNodeData[]` | `[]` |
| id | combobox 触发器 id | `string` | - |
| labelledBy | 为 combobox 提供可访问名称的标签元素 id | `string` | - |
| ariaLabelledby | `labelledBy` 的兼容别名 | `string` | - |
| modelValue | 受控值 | `TreeKey \| TreeKey[]` | - |
| defaultValue | 非受控初始值 | `TreeKey \| TreeKey[]` | - |
| multiple | 是否多选 | `boolean` | `false` |
| treeCheckable | 开启复选框选择，modelValue为key数组 | `boolean` | `false` |
| treeCheckStrictly | 是否独立勾选；false启用联动 | `boolean` | `true` |
| loadData | 可取消的按需加载回调 | `TreeLoadData` | - |
| showSearch | 是否显示搜索框 | `boolean` | `false` |
| placeholder | 无选中值时的提示文字 | `string` | `请选择` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 是否允许清除当前值 | `boolean` | `false` |
| maxTagCount | 多选模式最多展示的节点标签数量 | `number` | - |
| open | 受控浮层状态 | `boolean` | - |
| defaultOpen | 非受控初始展开状态 | `boolean` | `false` |
| placement | 浮层位置 | `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` | `bottomLeft` |
| autoAdjustOverflow | 是否自动翻转与避让 | `boolean` | `true` |
| getPopupContainer | 自定义浮层挂载容器 | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |

| 事件 | 说明 |
| --- | --- |
| update:modelValue | 选择值变化 |
| change | 选择值变化 |
| openChange | 浮层状态请求变化 |
| clear | 清除当前值 |

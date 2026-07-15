<script setup lang="ts">
import { ref } from 'vue'

const options = [
  { value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] }, { value: 'ningbo', label: '宁波' }] },
  { value: 'jiangsu', label: '江苏', children: [{ value: 'nanjing', label: '南京' }] }
]
const value = ref<string[]>()
const values = ref<string[][]>([])
const lazyOptions = [{ value: 'china', label: '中国', isLeaf: false }]
const loadChildren = async () => {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return [{ value: 'shanghai', label: '上海' }, { value: 'beijing', label: '北京' }]
}
</script>

# Cascader 级联选择 <span class="aheart-status aheart-status--ready">已完成</span>

从多级选项中选择一条或多条路径，支持搜索、禁用与按需加载。

## 基础用法

<div class="aheart-demo-panel">
  <ACascader v-model="value" :options="options" placeholder="选择地区" allow-clear />
</div>

```vue
<ACascader v-model="value" :options="options" allow-clear />
```

单选值是完整路径：`['zhejiang', 'hangzhou', 'xihu']`。

## 多选与搜索

<div class="aheart-demo-panel">
  <ACascader v-model="values" :options="options" multiple show-search />
</div>

```vue
<ACascader v-model="values" :options="options" multiple show-search />
```

多选值是路径数组集合：`[['zhejiang', 'ningbo'], ['jiangsu', 'nanjing']]`。

## 按需加载

<div class="aheart-demo-panel">
  <ACascader :options="lazyOptions" :load-data="loadChildren" placeholder="选择并加载地区" />
</div>

```vue
<script setup lang="ts">
const options = [{ value: 'china', label: '中国', isLeaf: false }]
const loadData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return [{ value: 'shanghai', label: '上海' }]
}
</script>

<template><ACascader :options="options" :load-data="loadData" /></template>
```

当选项设置 `isLeaf: false` 且未提供子节点时，组件调用 `loadData` 获取子节点；请求、缓存与错误提示由业务层负责。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 级联选项 | `CascaderOption[]` | `[]` |
| modelValue | 受控值；单选为路径，多选为路径集合 | `CascaderPath \| CascaderPath[]` | - |
| defaultValue | 非受控初始值 | `CascaderPath \| CascaderPath[]` | - |
| multiple | 是否多选 | `boolean` | `false` |
| showSearch | 是否显示搜索框 | `boolean` | `false` |
| placeholder | 无选中值时的提示文字 | `string` | `请选择` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 是否允许清除当前路径 | `boolean` | `false` |
| maxTagCount | 多选模式最多展示的路径标签数量 | `number` | - |
| open | 受控浮层状态 | `boolean` | - |
| defaultOpen | 非受控初始展开状态 | `boolean` | `false` |
| placement | 浮层位置 | `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` | `bottomLeft` |
| autoAdjustOverflow | 是否自动翻转与避让 | `boolean` | `true` |
| getPopupContainer | 自定义浮层挂载容器 | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| loadData | 按需加载子节点 | `(option) => Promise<CascaderOption[]>` | - |

`CascaderOption` 包含 `value`、`label`、可选的 `children`、`disabled` 与 `isLeaf`。

| 事件 | 说明 |
| --- | --- |
| update:modelValue | 选择值变化 |
| change | 选择值变化 |
| openChange | 浮层状态请求变化 |
| clear | 清除当前值 |

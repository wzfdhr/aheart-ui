<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CascaderVirtualFixture from '../.vitepress/components/CascaderVirtualFixture.vue'

const showCascaderVirtualFixture = ref(false)
onMounted(() => { showCascaderVirtualFixture.value = new URLSearchParams(window.location.search).get('fixture') === 'cascader-virtual' })

const options = [
  { value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] }, { value: 'ningbo', label: '宁波' }] },
  { value: 'jiangsu', label: '江苏', children: [{ value: 'nanjing', label: '南京' }] }
]
const value = ref<string[]>()
const values = ref<string[][]>([])
const virtualValue = ref<string[]>()
const virtualOptions = Array.from({ length: 1200 }, (_, index) => ({
  value: `region-${index}`,
  label: `区域 ${String(index).padStart(4, '0')}`,
  children: [{ value: `region-${index}-leaf`, label: `区域 ${String(index).padStart(4, '0')} · 叶节点` }]
}))
const lazyOptions = [{ value: 'china', label: '中国', isLeaf: false }]
const loadChildren = async () => {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return [{ value: 'shanghai', label: '上海' }, { value: 'beijing', label: '北京' }]
}
</script>

<ClientOnly>
  <CascaderVirtualFixture v-if="showCascaderVirtualFixture" />
</ClientOnly>

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

当选项设置 `isLeaf: false` 且未提供子节点时，组件调用 `loadData` 获取子节点。组件会显示加载状态，隔离切换路径、替换 `options`、关闭面板或卸载后的过期响应；失败后显示“重试”，可再次点击或按 Enter 重试。数据请求和持久缓存仍由业务层负责。

## 大量选项与虚拟列

对有大量同级选项的级联面板，可以显式开启 `virtual`。每一列使用独立的纵向虚拟窗口；开启 `showSearch` 后，搜索结果行也使用独立窗口。下面的例子包含 1200 个根选项，可直接搜索叶节点或展开某个根选项查看第二列：

<div class="aheart-demo-panel" role="region" aria-label="Cascader 虚拟列示例">
  <ACascader
    v-model="virtualValue"
    :options="virtualOptions"
    virtual
    show-search
    allow-clear
    placeholder="搜索或选择大量地区"
    style="width: 320px"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[]>()
const options = Array.from({ length: 1200 }, (_, index) => ({
  value: `region-${index}`,
  label: `区域 ${String(index).padStart(4, '0')}`,
  children: [{ value: `region-${index}-leaf`, label: `区域 ${String(index).padStart(4, '0')} · 叶节点` }]
}))
</script>

<template>
  <ACascader v-model="value" :options="options" virtual show-search allow-clear />
</template>
```

`virtual` 是显式选择：默认值为 `false`，保持原有完整 DOM 和交互兼容，不会根据数量自动开启。`true` 或 `{}` 使用 `height: 256`、`estimateSize: 32`、`overscan: 4`；估算行高只用于初始窗口，实际行高会在渲染后测量并更新。配置字段无效时会在开发环境告警，并仅回退对应字段的默认值；如果传入的配置不是普通对象，则关闭虚拟化并回到完整 DOM。

虚拟行仍然是原生 `<button>`，保留禁用、点击和焦点语义。打开面板后可用 ↑/↓、Home/End 在当前列或搜索结果中移动，→/Enter/Space 进入分支，← 返回父列，Escape 关闭并把焦点还给触发器；当前键盘行会在窗口外被保留，确保导航连续。虚拟化不公开引擎实例、虚拟行集合或滚动定位方法。

运行时边界：SSR 会输出确定的有限窗口，并可无水合告警地接管；真正的测量在挂载后进行。组件从浮层所属的 `ownerDocument`/iframe 窗口读取 `ResizeObserver` 和动画帧能力；能力不完整时保留可用的完整 DOM 回退，而不是让面板失去焦点或导航。行高会响应字体、换行、容器宽度和动态内容变化。按需加载只在用户展开已挂载的分支时触发；关闭、禁用、切换路径、替换 `options` 或卸载会取消当前请求，迟到结果不会写入新路径。

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
| virtual | 是否启用虚拟列与虚拟搜索结果，也可配置视口高度、行高估计与额外挂载行数 | `boolean \| CascaderVirtualConfig` | `false` |
| loadData | 按需加载子节点；第二参数提供当前请求的 `AbortSignal` | `(option, { signal }) => Promise<CascaderOption[]>` | - |

`CascaderOption` 包含 `value`、`label`、可选的 `children`、`disabled` 与 `isLeaf`。

`loadData` 仍兼容只接收 `option` 的旧回调。需要主动取消网络请求时，可读取 `context?.signal`；组件会在切换路径、替换 `options`、关闭或禁用浮层以及卸载时将当前请求标记为 `aborted`。迟到的成功或失败结果不会修改新的路径状态，也不会抢回键盘焦点。

### CascaderVirtualConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 每个虚拟列/搜索结果视口的高度上限，单位 CSS px；浮层空间不足时会自动缩小 | `number`（有限且大于 `0`） | `256` |
| estimateSize | 尚未测量行的初始高度估计，单位 CSS px；不是强制行高 | `number`（有限且大于 `0`） | `32` |
| overscan | 视口两侧额外挂载的逻辑行数 | `number`（非负安全整数） | `4` |

`CascaderVirtual` 是 `boolean | CascaderVirtualConfig` 的类型别名；`CascaderVirtual` 与 `CascaderVirtualConfig` 均可从 `aheart-ui` 导入。运行时关闭 `virtual` 不代表构建时必然移除虚拟化代码。

```ts
interface CascaderVirtualConfig {
  height?: number
  estimateSize?: number
  overscan?: number
}

type CascaderVirtual = boolean | CascaderVirtualConfig
```

| 事件 | 说明 |
| --- | --- |
| update:modelValue | 选择值变化 |
| change | 选择值变化 |
| openChange | 浮层状态请求变化 |
| clear | 清除当前值 |

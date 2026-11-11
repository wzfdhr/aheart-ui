<script setup lang="ts">
import { ref } from 'vue'
import { Combobox, type ComboboxValue } from 'aheart-ui/combobox'
import 'aheart-ui/combobox/style.css'

const city = ref<ComboboxValue>()
const options = [
  { label: '北京 Beijing', value: 'beijing' },
  { label: '南京 Nanjing', value: 'nanjing', disabled: true },
  { label: '上海 Shanghai', value: 'shanghai' },
  { label: '深圳 Shenzhen', value: 'shenzhen' }
]
</script>

# Combobox 输入选择框 <span class="aheart-status aheart-status--ready">已完成</span>

输入城市名筛选候选项。用 ↑ / ↓ 移动高亮，按 Enter 选中，按 Esc 关闭并返回当前选中值。Tab 会关闭列表并移到下一个控件。

<div class="aheart-demo-panel">
  <div><label id="combobox-city-label" for="combobox-city">城市</label></div>
  <Combobox
    id="combobox-city"
    v-model="city"
    aria-labelledby="combobox-city-label"
    placeholder="输入城市名"
    :options="options"
  >
    <template #empty>没有匹配的城市</template>
  </Combobox>
  <p>已选城市 <output>{{ city ?? '请选择' }}</output></p>
  <div><label for="combobox-street">街道</label></div>
  <AInput id="combobox-street" style="width: 16rem; max-width: 100%" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Combobox, type ComboboxValue } from 'aheart-ui/combobox'
import 'aheart-ui/theme.css'
import 'aheart-ui/combobox/style.css'

const city = ref<ComboboxValue>()
const options = [
  { label: '北京 Beijing', value: 'beijing' },
  { label: '上海 Shanghai', value: 'shanghai' }
]
</script>

<template>
  <label for="city" id="city-label">城市</label>
  <Combobox id="city" v-model="city" aria-labelledby="city-label" :options="options" />
</template>
```

## API

| 属性 | 说明 |
| --- | --- |
| `v-model` | 受控选中值，类型为 `string \| number \| undefined` |
| `defaultValue` | 非受控模式下的初始选中值 |
| `options` | 候选项数组。每项包含唯一的 `value`、文本 `label` 和可选的 `disabled` |
| `id`、`placeholder`、`disabled` | 输入框 ID、占位文字和禁用状态 |
| `getPopupContainer` | 接收输入框，返回浮层容器，返回 `false` 时就地渲染 |

选中值变化时触发 `change(value, option)`。使用 `empty` 插槽自定义无匹配结果时的内容。

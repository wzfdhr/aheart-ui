<script setup lang="ts">
import { computed, ref } from 'vue'
import { enUS, zhCN } from 'aheart-ui'

const localeKey = ref<'zhCN' | 'enUS'>('zhCN')
const size = ref<'large' | 'middle' | 'small'>('middle')
const disabled = ref(false)
const customTheme = ref(false)
const actionCounts = ref({
  primary: 0,
  outer: 0,
  inner: 0,
  sibling: 0
})
const actionStatus = ref('尚未执行操作')

const activeLocale = computed(() => localeKey.value === 'enUS' ? enUS : zhCN)
const innerLocale = computed(() => localeKey.value === 'enUS'
  ? { empty: enUS.empty, pagination: enUS.pagination }
  : { empty: zhCN.empty, pagination: zhCN.pagination })
const activeTheme = computed(() => customTheme.value
  ? {
      primaryColor: '#0958d9',
      primaryHoverColor: '#0747a6',
      backgroundColor: '#f5f9ff',
      borderRadius: '4px'
    }
  : undefined)

function recordAction(key: keyof typeof actionCounts.value, label: string) {
  actionCounts.value[key] += 1
  actionStatus.value = `${label}已执行 ${actionCounts.value[key]} 次`
}
</script>

# ConfigProvider 全局配置 <span class="aheart-status aheart-status--ready">已完成</span>

ConfigProvider provides shared configuration for Aheart UI components, including global size, disabled state, locale text, and local theme token overrides.

## 全局配置交互工作台

<div class="aheart-config-workbench" role="region" aria-label="全局配置交互工作台">
  <div class="aheart-config-workbench__toolbar" aria-label="配置控制">
    <span class="aheart-config-workbench__label">语言</span>
    <AButton size="small" :type="localeKey === 'zhCN' ? 'primary' : 'default'" @click="localeKey = 'zhCN'">中文</AButton>
    <AButton size="small" :type="localeKey === 'enUS' ? 'primary' : 'default'" @click="localeKey = 'enUS'">English</AButton>
    <label class="aheart-config-workbench__field">
      <span>尺寸</span>
      <select v-model="size" aria-label="组件尺寸">
        <option value="large">large</option>
        <option value="middle">middle</option>
        <option value="small">small</option>
      </select>
    </label>
    <ACheckbox v-model="disabled" label="全局禁用" />
    <ACheckbox v-model="customTheme" label="自定义主题" />
  </div>
  <div class="aheart-config-workbench__state" data-testid="config-state">
    locale={{ localeKey === 'enUS' ? 'English' : '中文' }} · size={{ size }} · disabled={{ disabled }} · theme={{ customTheme ? 'custom' : 'default' }}
  </div>
  <div class="aheart-config-workbench__status" role="status" aria-label="操作结果" aria-live="polite">{{ actionStatus }}</div>
  <AConfigProvider :locale="activeLocale" :size="size" :disabled="disabled" :theme="activeTheme">
    <div class="aheart-config-workbench__preview">
      <div class="aheart-config-workbench__preview-header">
        <strong>真实后代组件</strong>
        <span>Provider 配置会实时传递给下方组件</span>
      </div>
      <div class="aheart-config-workbench__row">
        <AButton type="primary" aria-label="主要操作" @click="recordAction('primary', '主要操作')">主要操作</AButton>
        <AEmpty />
        <APagination :total="42" show-total />
      </div>
    </div>
    <AConfigProvider :locale="activeLocale" size="large" disabled>
      <div class="aheart-config-workbench__nested-grid" role="group" aria-label="嵌套配置区域">
      <div class="aheart-config-workbench__nested" role="region" aria-label="外层配置">
        <strong>外层配置</strong>
        <span>outer-locale={{ localeKey === 'enUS' ? 'English' : '中文' }}</span>
        <div class="aheart-config-workbench__nested-row">
          <AButton type="primary" aria-label="外层同级操作" @click="recordAction('outer', '外层同级操作')">外层同级操作</AButton>
          <AEmpty :description="localeKey === 'enUS' && size === 'small' ? undefined : '外层暂无数据'" />
          <APagination v-if="localeKey === 'enUS' && size === 'small'" :total="42" show-total />
        </div>
      </div>
      <div class="aheart-config-workbench__nested" role="region" aria-label="内层覆盖">
        <strong>内层覆盖</strong>
        <span>inner-size=small · inner-locale=English</span>
        <AConfigProvider :locale="innerLocale" size="small" :disabled="false">
          <div class="aheart-config-workbench__nested-row">
            <AButton type="primary" aria-label="内层操作" @click="recordAction('inner', '内层操作')">内层操作</AButton>
            <AEmpty :description="localeKey === 'enUS' && size === 'small' ? undefined : '内层暂无数据'" />
            <APagination v-if="localeKey === 'enUS' && size === 'small'" :total="42" show-total />
          </div>
        </AConfigProvider>
      </div>
      <div class="aheart-config-workbench__nested" role="region" aria-label="外层同级">
        <strong>外层同级</strong>
        <span>outer-locale={{ localeKey === 'enUS' ? 'English' : '中文' }}</span>
        <div class="aheart-config-workbench__nested-row">
          <AButton type="primary" aria-label="同级操作" @click="recordAction('sibling', '同级操作')">同级操作</AButton>
          <AEmpty :description="localeKey === 'enUS' && size === 'small' ? undefined : '同级暂无数据'" />
          <APagination v-if="localeKey === 'enUS' && size === 'small'" :total="42" show-total />
        </div>
      </div>
      </div>
    </AConfigProvider>
  </AConfigProvider>
</div>

<style>
.aheart-config-workbench {
  display: grid;
  gap: 16px;
  margin: 20px 0 28px;
  background: #fff;
  min-width: 0;
}

.aheart-config-workbench__toolbar,
.aheart-config-workbench__field,
.aheart-config-workbench__nested-row,
.aheart-config-workbench__preview-header {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.aheart-config-workbench__label,
.aheart-config-workbench__field > span,
.aheart-config-workbench__preview-header span,
.aheart-config-workbench__nested > span {
  color: #667085;
  font-size: 13px;
}

.aheart-config-workbench__field select {
  min-height: 28px;
  padding: 3px 24px 3px 8px;
  border: 1px solid #d9e1ea;
  border-radius: 6px;
  background: #fff;
  color: #344054;
}

.aheart-config-workbench__state {
  padding: 8px 10px;
  border-left: 3px solid #1677ff;
  background: #f7f9fc;
  color: #536273;
  font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.aheart-config-workbench__status {
  color: #344054;
  font-size: 13px;
}

.aheart-config-workbench__preview {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.aheart-config-workbench__preview-header {
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef1f5;
}

.aheart-config-workbench__row {
  display: grid;
  gap: 16px;
  align-items: center;
}

.aheart-config-workbench__nested-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-width: 0;
  border-top: 1px solid #e6e8ef;
}

.aheart-config-workbench__nested {
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 12px 0;
  border-bottom: 1px solid #e6e8ef;
}

.aheart-config-workbench__nested-row {
  align-items: start;
  min-width: 0;
}

.aheart-config-workbench__nested-row > * {
  min-width: 0;
}

.aheart-config-workbench__nested-row .aheart-empty {
  max-width: 100%;
}

@media (max-width: 760px) {
  .aheart-config-workbench__nested-grid {
    grid-template-columns: 1fr;
  }

  .aheart-config-workbench__toolbar {
    align-items: flex-start;
  }
}
</style>

## 基础用法

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <div class="aheart-demo-row">
      <AButton>Default</AButton>
      <AButton type="primary">Primary</AButton>
    </div>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large">
    <AButton>Default</AButton>
    <AButton type="primary">Primary</AButton>
  </AConfigProvider>
</template>
```

## 禁用状态

<div class="aheart-demo-panel">
  <AConfigProvider disabled>
    <div class="aheart-demo-row">
      <AButton>Disabled</AButton>
      <AButton type="primary">Disabled Primary</AButton>
    </div>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider disabled>
    <AButton>Disabled</AButton>
    <AButton type="primary">Disabled Primary</AButton>
  </AConfigProvider>
</template>
```

## Theme Tokens

<div class="aheart-demo-panel">
  <AConfigProvider :theme="{ primaryColor: '#0958d9', borderRadius: '4px' }">
    <AButton type="primary">Custom Theme</AButton>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider :theme="{ primaryColor: '#0958d9', borderRadius: '4px' }">
    <AButton type="primary">Custom Theme</AButton>
  </AConfigProvider>
</template>
```

## 国际化

组件默认使用简体中文。通过根导出的 `enUS` 切换整棵子树的内置文案；内层 Provider 可以只覆盖一个字段，其余字段继续继承外层 locale。

```vue
<script setup lang="ts">
import { enUS } from 'aheart-ui'
</script>

<template>
  <AConfigProvider :locale="enUS">
    <APagination :total="42" show-total />
    <AModal open title="Delete item">This dialog uses English actions.</AModal>
  </AConfigProvider>

  <AConfigProvider :locale="enUS">
    <AConfigProvider :locale="{ modal: { okText: 'Proceed' } }">
      <AModal open title="Nested override" />
    </AConfigProvider>
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 全局组件尺寸 | `large` \| `middle` \| `small` | `middle` |
| disabled | 全局禁用状态 | `boolean` | `false` |
| locale | 组件内置文案，支持 `empty`、`pagination`、`modal` 和 `table` namespace | `AheartLocale` | `zhCN` |
| theme | 局部主题 token 覆盖 | `AheartTheme` | `{}` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 需要接收配置的组件内容 |

## Theme Token Fields

`theme` currently supports:

- `primaryColor`
- `primaryHoverColor`
- `successColor`
- `warningColor`
- `dangerColor`
- `infoColor`
- `textColor`
- `textSecondaryColor`
- `borderColor`
- `fillColor`
- `backgroundColor`
- `borderRadius`
- `fontSize`

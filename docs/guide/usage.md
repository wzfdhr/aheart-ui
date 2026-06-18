# 使用

## 全量安装

```ts
import { createApp } from 'vue'
import AheartUI from 'aheart-ui'
import 'aheart-ui/es/style.css'
import App from './App.vue'

createApp(App).use(AheartUI).mount('#app')
```

## 命名导入

```vue
<template>
  <Button type="primary">保存</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## 单组件注册

```ts
import { createApp } from 'vue'
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
import App from './App.vue'

createApp(App).use(Button).mount('#app')
```

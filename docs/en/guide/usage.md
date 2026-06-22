# Usage

## Full Installation

```ts
import { createApp } from 'vue'
import AheartUI from 'aheart-ui'
import 'aheart-ui/es/style.css'
import App from './App.vue'

createApp(App).use(AheartUI).mount('#app')
```

## Named Import

```vue
<template>
  <Button type="primary">Save</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## Single Component Registration

```ts
import { createApp } from 'vue'
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
import App from './App.vue'

createApp(App).use(Button).mount('#app')
```

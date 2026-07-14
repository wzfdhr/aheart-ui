# aheart-ui

Aheart UI 的 Vue 3 核心组件包，覆盖布局、导航、数据录入、数据展示、浮层反馈、日期时间、树和 Splitter。

## 安装

```bash
pnpm add aheart-ui vue
```

```ts
import { createApp } from 'vue'
import AheartUI from 'aheart-ui'
import 'aheart-ui/style.css'
import App from './App.vue'

createApp(App).use(AheartUI).mount('#app')
```

也可以按需导入：

```ts
import { Button, Table } from 'aheart-ui'
```

Vue `>=3.4.0 <4` 由业务应用提供。完整用法见[中文组件文档](https://github.com/wzfdhr/aheart-ui/tree/master/docs/components)。

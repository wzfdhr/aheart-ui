<template>
  <main class="demo">
    <Button>默认按钮</Button>
    <Button type="primary">主要按钮</Button>
    <Button type="success">成功按钮</Button>
    <Button type="warning">警告按钮</Button>
    <Button type="danger" loading>加载中</Button>
  </main>
</template>

<script lang="ts" setup>
import { Button } from 'aheart-ui'
</script>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px;
}
</style>

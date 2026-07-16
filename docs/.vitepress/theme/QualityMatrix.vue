<template>
  <section class="aheart-quality-matrix" aria-label="组件质量矩阵">
    <p class="aheart-quality-matrix__summary">已登记 {{ qualityMatrix.length }} 个 Ready 组件。发布前由 CI 校验组件目录、质量证据与负责人是否完整。</p>
    <div v-for="group in groups" :key="group.package" class="aheart-quality-matrix__group">
      <header>
        <strong>{{ group.package }}</strong>
        <span>{{ group.records.length }} 个组件</span>
      </header>
      <div class="aheart-quality-matrix__table-wrap">
        <table>
          <thead><tr><th>组件</th><th>风险</th><th>单元测试</th><th>浏览器验收</th><th>负责人</th></tr></thead>
          <tbody>
            <tr v-for="record in group.records" :key="record.component">
              <td><code>{{ record.component }}</code></td>
              <td><span :class="['aheart-quality-risk', `is-${record.risk.toLowerCase()}`]">{{ record.risk }}</span></td>
              <td>{{ record.unit[0] }}</td>
              <td>{{ record.e2e[0] }}</td>
              <td>{{ record.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { qualityMatrix } from '../data/quality-matrix.mjs'

const groups = computed(() => ['aheart-ui', '@aheart-ui/dnd', '@aheart-ui/ai'].map((packageName) => ({
  package: packageName,
  records: qualityMatrix.filter((record) => record.package === packageName)
})))
</script>

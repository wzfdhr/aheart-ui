<template>
  <section class="aheart-quality-matrix" aria-label="组件质量矩阵">
    <p class="aheart-quality-matrix__summary">已登记 {{ qualityMatrix.length }} 个 Ready 组件。发布前由 CI 校验组件目录、质量证据与负责人是否完整。</p>
    <p class="aheart-quality-matrix__legend">R1 代表关键风险组件，R2 代表标准交互组件，R3 代表基础展示组件；待验收或延期证据需要在发布前补齐。</p>
    <div v-for="group in groups" :key="group.package" class="aheart-quality-matrix__group">
      <header>
        <strong>{{ group.package }}</strong>
        <span>{{ group.records.length }} 个组件</span>
      </header>
      <div class="aheart-quality-matrix__table-wrap" role="region" tabindex="0" :aria-label="`${group.package} 组件质量矩阵横向滚动区域`">
        <table>
          <colgroup>
            <col class="aheart-quality-matrix__col-component" />
            <col class="aheart-quality-matrix__col-risk" />
            <col class="aheart-quality-matrix__col-evidence" span="5" />
            <col class="aheart-quality-matrix__col-owner" />
          </colgroup>
          <thead><tr><th scope="col">组件</th><th scope="col">风险</th><th scope="col">单元测试</th><th scope="col">浏览器验收</th><th scope="col">SSR</th><th scope="col">无障碍</th><th scope="col">视觉</th><th scope="col">负责人</th></tr></thead>
          <tbody>
            <tr v-for="record in group.records" :key="record.component">
              <td>
                <code>{{ record.component }}</code>
                <div v-for="task in record.productTasks" :key="task.id" class="aheart-quality-matrix__product-task">
                  <strong>{{ task.taskGroup }}</strong>
                  <span>{{ task.acceptance }}</span>
                </div>
              </td>
              <td><span :class="['aheart-quality-risk', `is-${record.risk.toLowerCase()}`]">{{ record.risk }}</span></td>
              <td>{{ evidenceLabel(record.unit[0]) }}</td>
              <td>
                <span v-for="(evidence, index) in record.e2e" :key="`${record.component}-e2e-${index}`" class="aheart-quality-matrix__evidence">
                  {{ evidenceLabel(evidence) }}
                </span>
              </td>
              <td>{{ evidenceLabel(record.ssr[0]) }}</td>
              <td>{{ evidenceLabel(record.a11y[0]) }}</td>
              <td>{{ evidenceLabel(record.visual[0]) }}</td>
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

const evidenceLabel = (evidence) => evidence.kind === 'file'
  ? evidence.path
  : evidence.kind === 'planned' ? `${evidence.milestone}：${evidence.status === 'deferred' ? '延期（待验收）' : '待验收'}`
    : `不适用：${evidence.reason}`
</script>

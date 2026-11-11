<template>
  <main class="aheart-roadmap" aria-labelledby="aheart-roadmap-title">
    <header class="aheart-roadmap__hero">
      <p class="aheart-roadmap__eyebrow">AHEART UI / ROADMAP</p>
      <h1 id="aheart-roadmap-title">v2 路线图</h1>
      <p>路线图按已批准的 A1 阶段划分。M3 进入 AI/DND 按需入口、Resolver 与文档迁移。</p>
      <aside class="aheart-roadmap__guardrail">公开版本、候选包和阶段验收分别记录。候选按需入口使用本地 tarball 验证。</aside>
    </header>

    <ol class="aheart-roadmap__timeline">
      <li v-for="phase in phases" :key="phase.key" class="aheart-roadmap__phase">
        <div class="aheart-roadmap__phase-marker" aria-hidden="true">{{ phase.key }}</div>
        <article>
          <div class="aheart-roadmap__phase-heading">
            <div>
              <h2>{{ phase.title }}</h2>
              <p>{{ phase.description }}</p>
            </div>
            <span class="aheart-status" :class="`aheart-status--${phase.state}`">{{ phase.status }}</span>
          </div>
          <ul>
            <li v-for="item in phase.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </li>
    </ol>
  </main>
</template>

<script setup lang="ts">
const phases = [
  { key: 'M0', title: '产品与契约冻结', description: '建立版本边界和两个消费试点。', status: '已验收', state: 'ready', items: ['clean-consumer 和 ai-review-gate'] },
  { key: 'M1', title: 'v1.2 真实按需', description: '建立基础包子入口与显式样式契约。', status: '已验收', state: 'ready', items: ['Button / Modal / Select 子入口', '消费端和发布契约'] },
  { key: 'M2', title: 'Combobox 与浮层', description: '通过单选示例验证公共浮层和键盘操作。', status: '已部署', state: 'ready', items: ['Combobox', 'Popover / Tooltip / Dropdown、Modal / Drawer、Select 与 Picker 族'] },
  { key: 'M3', title: 'AI/DND 与文档', description: '拆分场景入口和样式，并提供静态 Resolver 与迁移指南。', status: '候选', state: 'preview', items: ['Chat / Agent / Workbench、DND Sortable', '按需导入、自动解析和回滚'] },
  { key: 'M4', title: 'v2 发布决策', description: '根据试点反馈、主线质量和回滚证据决定发布节奏。', status: '待评估', state: 'planned', items: ['Beta / RC / Stable'] }
]
</script>

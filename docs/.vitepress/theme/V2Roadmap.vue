<template>
  <main class="aheart-roadmap" aria-labelledby="aheart-roadmap-title">
    <header class="aheart-roadmap__hero">
      <p class="aheart-roadmap__eyebrow">AHEART UI / VERSION 2 · NOT STARTED</p>
      <h1 id="aheart-roadmap-title">v2 路线图</h1>
      <p>v2 当前保持暂停。下方仅记录候选方向；M0–M8 均未启动，也没有排期或发布日期。</p>
      <aside class="aheart-roadmap__guardrail">启动条件：v1 外部验收完成，并经产品与技术负责人明确决定。所有阶段仍未启动；未标已发布的能力不会承诺当前可安装。</aside>
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
            <span class="aheart-status aheart-status--planned">尚未启动</span>
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
  { key: 'M0', title: '产品与契约冻结', description: '冻结用户、包边界、支持矩阵、指标与责任人。', items: ['四份决策文档批准', '三个真实消费项目基线'] },
  { key: 'M1', title: 'v1.1 真实按需', description: '建立组件级 JS、类型、CSS 和 Resolver Preview。', items: ['Button / Modal / Select subpath', '真实 consumer 与发布合约'] },
  { key: 'M2', title: 'Icons 供应链', description: '建立独立图标包和名称兼容层。', items: ['@aheart-ui/icons 包边界', '公共发布门禁与安装验证'] },
  { key: 'M3', title: 'Primitive + Combobox', description: '以单选 Combobox 验证状态、Focus、Layer、Collection 与 Compound API。', items: ['ControllableState / ownerDocument / Presence', 'Primitive / Slot / Focus / Layer / Collection / Namespaced'] },
  { key: 'M4', title: '浮层 / Dialog 内核', description: '按组件族迁移统一浮层、焦点、退出与容器协议。', items: ['Popover / Tooltip / Dropdown', 'Modal / Drawer / Select / Picker'] },
  { key: 'M5', title: 'Motion Preview', description: '提供可访问、可取消、支持 reduced motion 的状态动效。', items: ['Presence / Fade / Slide / Scale / Collapse', 'ReducedMotionProvider'] },
  { key: 'M6', title: 'AI 与 DND 产品化', description: '把仓库预览推进到公共包发布评估。', items: ['AI Chat / Agent / Workbench 发布门禁', 'DND 公共供应链与跨平台证据'] },
  { key: 'M7', title: '文档、Resolver 与生态', description: '让文档、导出、Resolver 和实际 tarball 保持一致。', items: ['单一 manifest 驱动 exports / Resolver / 导航 / 质量矩阵', '唯一推荐路径、迁移指南与十分钟激活验证'] },
  { key: 'M8', title: 'v2 决策 / Beta / RC / Stable', description: '根据采用与质量证据决定是否发布，而不是按计划自动进入稳定版。', items: ['Beta 观察与三试点复测', '发布、回滚和 30/60/90 天复盘'] }
]
</script>

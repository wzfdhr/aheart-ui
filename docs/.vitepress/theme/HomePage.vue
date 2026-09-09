<template>
  <main class="aheart-home-page">
    <section class="aheart-home-hero" aria-labelledby="aheart-home-title">
      <div class="aheart-home-hero__glow" aria-hidden="true"></div>
      <div class="aheart-home-hero__inner">
        <div class="aheart-home-hero__copy">
          <p class="aheart-home-kicker">
            <span>Vue 3</span>
            专业产品与 AI 工作流组件体系
          </p>
          <h1 id="aheart-home-title">
            把复杂工作流，
            <span>做成可靠的产品界面</span>
          </h1>
          <p class="aheart-home-lead">
            从基础构件与组合工作流，到 Agent 任务、人工审批、产物预览与可访问拖拽——用清晰分层、可组合、可验证的能力构建 Vue 3 产品。
          </p>

          <div class="aheart-home-actions">
            <a class="aheart-home-button aheart-home-button--primary" :href="withBase('/guide/installation')">
              开始使用
              <span aria-hidden="true">→</span>
            </a>
            <a class="aheart-home-button aheart-home-button--secondary" :href="withBase('/ai/overview')">
              查看 AI 产品
            </a>
          </div>

          <div class="aheart-home-install" aria-label="安装命令">
            <span class="aheart-home-install__prompt" aria-hidden="true">$</span>
            <code>{{ installCommand }}</code>
            <button type="button" :aria-label="copyLabel" @click="copyInstallCommand">
              {{ copyLabel }}
            </button>
          </div>

          <ul class="aheart-home-proof" aria-label="技术特性">
            <li><span aria-hidden="true">✓</span> TypeScript</li>
            <li><span aria-hidden="true">✓</span> SSR 友好</li>
            <li><span aria-hidden="true">✓</span> 可访问交互</li>
            <li><span aria-hidden="true">✓</span> 模型后端无关</li>
          </ul>
        </div>

        <div class="aheart-home-workbench" aria-label="AI Agent 产品工作台预览">
          <div class="aheart-home-workbench__topbar">
            <div class="aheart-home-window-dots" aria-hidden="true"><i></i><i></i><i></i></div>
            <span>产品方案 Agent</span>
            <strong><i aria-hidden="true"></i>运行中</strong>
          </div>
          <div class="aheart-home-workbench__body">
            <aside class="aheart-home-workbench__nav">
              <p>工作区</p>
              <span class="is-active"><i aria-hidden="true">✦</i>产品方案</span>
              <span><i aria-hidden="true">⌘</i>研发评审</span>
              <span><i aria-hidden="true">◇</i>发布记录</span>
              <div class="aheart-home-workbench__sources">
                <p>上下文</p>
                <span>需求简报</span>
                <span>用户研究</span>
              </div>
            </aside>

            <div class="aheart-home-workbench__main">
              <div class="aheart-home-chat">
                <span class="aheart-home-avatar" aria-hidden="true">A</span>
                <div>
                  <strong>Aheart Agent</strong>
                  <p>已完成需求梳理，正在生成可评审的产品方案。</p>
                </div>
              </div>
              <div
                class="aheart-home-progress"
                role="progressbar"
                aria-label="任务进度"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="72"
              ><i></i></div>
              <div class="aheart-home-task-list">
                <article class="is-complete">
                  <span aria-hidden="true">✓</span>
                  <div><strong>整理产品资料</strong><small>8 个来源已就绪</small></div>
                </article>
                <article class="is-running">
                  <span aria-hidden="true">↗</span>
                  <div><strong>生成执行摘要</strong><small>正在组织结构与验收标准</small></div>
                </article>
                <article class="is-waiting">
                  <span aria-hidden="true">!</span>
                  <div><strong>发布到团队知识库</strong><small>等待人工审批</small></div>
                </article>
              </div>
            </div>

            <aside class="aheart-home-workbench__artifact">
              <p>产物</p>
              <article>
                <span>MARKDOWN</span>
                <strong>产品方案.md</strong>
                <small>可评审版本 · 刚刚更新</small>
                <div aria-hidden="true"><i></i><i></i><i></i><i></i></div>
              </article>
              <div class="aheart-home-approval">
                <span>需要你的决定</span>
                <strong>确认发布方案？</strong>
                <div><span>拒绝</span><strong>批准</strong></div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <section class="aheart-home-metrics" aria-label="项目能力概览">
      <div><strong>{{ publishedComponentCount }}</strong><span>个 aheart-ui 组件</span></div>
      <div><strong>7</strong><span>条产品能力线</span></div>
      <div><strong>5</strong><span>类浏览器矩阵</span></div>
      <div><strong>SSR</strong><span>稳定渲染验证</span></div>
    </section>

    <section class="aheart-home-section aheart-home-capabilities" aria-labelledby="aheart-capabilities-title">
      <header class="aheart-home-section__header">
        <p>CAPABILITIES</p>
        <h2 id="aheart-capabilities-title">一套体系，贯穿完整产品工作流</h2>
        <span>开箱即用的产品组件，与清晰可控的业务边界。</span>
      </header>

      <div class="aheart-home-capability-grid">
        <a class="aheart-home-capability-card is-core" :href="withBase('/components/overview')">
          <span class="aheart-home-capability-card__index">01</span>
          <div class="aheart-home-capability-card__icon" aria-hidden="true">UI</div>
          <h3>基础组件</h3>
          <p>直接用于页面搭建的高频构件，提供一致的状态、尺寸、主题和交互反馈。</p>
          <ul>
            <li>Button / Input / Layout</li>
            <li>Navigation / Status</li>
            <li>Theme / ConfigProvider</li>
          </ul>
          <strong>浏览基础组件 <span aria-hidden="true">→</span></strong>
        </a>

        <a class="aheart-home-capability-card is-composed" :href="withBase('/composed/overview')">
          <span class="aheart-home-capability-card__index">02</span>
          <div class="aheart-home-capability-card__icon" aria-hidden="true">CP</div>
          <h3>组合组件</h3>
          <p>面向表单、数据工作区与浮层任务的复杂模式，并逐步演进 Compound API。</p>
          <ul>
            <li>Form / Table / Picker</li>
            <li>Modal / Drawer / Layer</li>
            <li>v2 Combobox / Compound</li>
          </ul>
          <strong>查看组合组件 <span aria-hidden="true">→</span></strong>
        </a>

        <a class="aheart-home-capability-card is-ai" :href="withBase('/ai/overview')">
          <span class="aheart-home-capability-card__index">03</span>
          <div class="aheart-home-capability-card__icon" aria-hidden="true">AI</div>
          <h3>AI 产品工作流</h3>
          <p>不止聊天窗口。把执行过程、来源、审批与产物组织成可追溯的 Agent 体验。</p>
          <ul>
            <li>AIChatPanel / AIForm</li>
            <li>任务状态与人工审批</li>
            <li>来源、附件与产物预览</li>
          </ul>
          <strong>体验 Agent 工作台 <span aria-hidden="true">→</span></strong>
        </a>

        <a class="aheart-home-capability-card is-dnd" :href="withBase('/dnd/overview')">
          <span class="aheart-home-capability-card__index">04</span>
          <div class="aheart-home-capability-card__icon" aria-hidden="true">↕</div>
          <h3>可访问拖拽</h3>
          <p>支持排序、跨容器移动与拖拽浮层，同时保留键盘和非拖拽操作路径。</p>
          <ul>
            <li>桌面、触摸与嵌套滚动</li>
            <li>键盘排序与状态播报</li>
            <li>受控数据与焦点恢复</li>
          </ul>
          <strong>查看拖拽能力 <span aria-hidden="true">→</span></strong>
        </a>
      </div>
    </section>

    <section class="aheart-home-section aheart-home-quality" aria-labelledby="aheart-quality-title">
      <div class="aheart-home-quality__copy">
        <p>QUALITY BY DEFAULT</p>
        <h2 id="aheart-quality-title">不只是看起来正确，也要经得起验证</h2>
        <span>
          从类型和单元测试，到真实浏览器、SSR、构建确定性与发布包合约，质量证据与组件一起交付。
        </span>
        <a :href="withBase('/guide/quality-matrix')">查看质量矩阵 <span aria-hidden="true">→</span></a>
      </div>

      <div class="aheart-home-terminal" aria-label="发布检查示例">
        <header><i></i><i></i><i></i><span>release:check</span></header>
        <div>
          <p><span>✓</span> Typecheck &amp; unit tests</p>
          <p><span>✓</span> Deterministic ES / CJS build</p>
          <p><span>✓</span> Chromium · Firefox · WebKit</p>
          <p><span>✓</span> Desktop · Mobile WebKit</p>
          <p><span>✓</span> Docs &amp; npm tarball contract</p>
          <strong><i aria-hidden="true"></i> Ready for review</strong>
        </div>
      </div>
    </section>

    <section class="aheart-home-section aheart-home-featured" aria-labelledby="aheart-featured-title">
      <header class="aheart-home-section__header">
        <p>EXPLORE</p>
        <h2 id="aheart-featured-title">从高频控件，到复杂工作区</h2>
        <span>从最能体现产品能力的组件开始探索。</span>
      </header>
      <div class="aheart-home-featured-grid">
        <a v-for="item in featured" :key="item.name" :href="withBase(item.href)">
          <div><span>{{ item.tag }}</span><i :class="`is-${item.tone}`" aria-hidden="true"></i></div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <strong aria-hidden="true">↗</strong>
        </a>
      </div>
    </section>

    <section class="aheart-home-cta" aria-labelledby="aheart-cta-title">
      <div>
        <p>BUILD WITH AHEART UI</p>
        <h2 id="aheart-cta-title">从一个可靠组件开始，构建下一代 Vue 产品</h2>
      </div>
      <div>
        <a class="aheart-home-button aheart-home-button--light" :href="withBase('/guide/installation')">阅读安装指南</a>
        <a class="aheart-home-button aheart-home-button--ghost" href="https://github.com/wzfdhr/aheart-ui">在 GitHub 查看</a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'
import { getComponentCatalogs } from '../data/components'

const installCommand = 'pnpm add aheart-ui'
const copyLabel = ref('复制')
let copyResetTimer: ReturnType<typeof setTimeout> | undefined

const componentCatalogs = getComponentCatalogs('zh')
const publishedComponentCount = componentCatalogs.core.length + componentCatalogs.composed.length

const featured = [
  { name: 'Agent Workbench', tag: 'AI 工作流', tone: 'teal', href: '/ai/overview', description: '任务、审批、来源与产物的一体化工作台。' },
  { name: 'AIForm', tag: 'Schema 表单', tone: 'violet', href: '/ai/overview', description: '把安全 Schema 映射为可校验的产品表单。' },
  { name: 'Table', tag: '数据展示', tone: 'blue', href: '/components/table', description: '分页、筛选、固定列与虚拟滚动的数据工作区。' },
  { name: 'Select', tag: '数据录入', tone: 'sky', href: '/components/select', description: '可控状态、键盘导航与可选虚拟列表。' },
  { name: 'Modal', tag: '浮层反馈', tone: 'amber', href: '/components/modal', description: '可靠处理焦点、嵌套浮层和退出动效。' },
  { name: 'DnD', tag: '空间编排', tone: 'green', href: '/dnd/overview', description: '支持桌面、触摸和键盘的受控拖拽。' }
]

const copyInstallCommand = async () => {
  if (copyResetTimer) clearTimeout(copyResetTimer)
  try {
    await navigator.clipboard.writeText(installCommand)
    copyLabel.value = '已复制'
  } catch {
    copyLabel.value = '请手动复制'
  }
  copyResetTimer = setTimeout(() => {
    copyLabel.value = '复制'
  }, 1800)
}

onBeforeUnmount(() => {
  if (copyResetTimer) clearTimeout(copyResetTimer)
})
</script>

---
layout: home
outline: false
---

<script setup lang="ts">
import { componentCategories } from './.vitepress/data/components'

const readyCount = componentCategories
  .flatMap((category) => category.components)
  .filter((component) => component.status === 'Ready').length

const plannedCount = componentCategories
  .flatMap((category) => category.components)
  .filter((component) => component.status === 'Planned').length
</script>

<section class="aheart-hero">
  <div class="aheart-hero__inner">
    <p class="aheart-eyebrow">Vue 3 Component Library</p>
    <h1 class="aheart-title">Aheart UI</h1>
    <p class="aheart-subtitle">
      Aheart UI is a Vue 3 component library for calm, consistent product interfaces. It starts with a tested Button foundation, theme tokens, plugin installation, and a clear component roadmap.
    </p>
    <div class="aheart-actions">
      <a class="aheart-action-link" href="/guide/installation">
        <AButton type="primary" size="large">开始使用</AButton>
      </a>
      <a class="aheart-action-link" href="/components/overview">
        <AButton size="large">组件总览</AButton>
      </a>
      <code class="aheart-command">pnpm add aheart-ui</code>
    </div>
    <div class="aheart-preview" aria-label="Aheart UI preview">
      <div class="aheart-demo-row">
        <AButton>Default</AButton>
        <AButton type="primary">Primary</AButton>
        <AButton type="success">Success</AButton>
        <AButton type="danger" loading>Loading</AButton>
      </div>
    </div>
  </div>
</section>

<section class="aheart-section">
  <h2>为产品界面而生</h2>
  <p class="aheart-section__intro">
    文档结构参考成熟组件库的信息组织方式，同时保持 Aheart UI 当前能力边界清晰可见。
  </p>
  <div class="aheart-feature-grid">
    <article class="aheart-card">
      <h3>Vue 3 + TypeScript</h3>
      <p>组件源码、props 类型和构建产物都围绕 Vue 3 与 TypeScript 组织。</p>
    </article>
    <article class="aheart-card">
      <h3>Theme Tokens</h3>
      <p>使用 CSS Variables 管理颜色、字号、圆角和动效时长。</p>
    </article>
    <article class="aheart-card">
      <h3>Plugin Install</h3>
      <p>支持全量安装、命名导入和单组件注册的基础模式。</p>
    </article>
    <article class="aheart-card">
      <h3>Verified Foundation</h3>
      <p>Button 已接入样式、状态、测试、类型检查和构建验证。</p>
    </article>
  </div>
</section>

<section class="aheart-section">
  <h2>组件路线图</h2>
  <p class="aheart-section__intro">
    当前有 {{ readyCount }} 个 Ready 组件，{{ plannedCount }} 个 Planned 组件。Planned 表示路线图方向，不代表当前已经发布。
  </p>
  <div class="aheart-category-grid">
    <section v-for="category in componentCategories" :key="category.name" class="aheart-component-card">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
      <div class="aheart-component-list">
        <a
          v-for="component in category.components.slice(0, 4)"
          :key="component.name"
          class="aheart-component-item"
          :href="component.link || '/components/overview'"
        >
          <span>{{ component.name }}</span>
          <span
            class="aheart-status"
            :class="component.status === 'Ready' ? 'aheart-status--ready' : 'aheart-status--planned'"
          >
            {{ component.status }}
          </span>
        </a>
      </div>
    </section>
  </div>
</section>

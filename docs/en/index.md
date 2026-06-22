---
layout: home
outline: false
---

<script setup lang="ts">
import { getComponentCategories, statusText } from '../.vitepress/data/components'

const componentCategories = getComponentCategories('en')
const components = componentCategories.flatMap((category) => category.components)
const readyCount = components.filter((component) => component.status === 'Ready').length
const plannedCount = components.filter((component) => component.status === 'Planned').length
</script>

<section class="aheart-hero">
  <div class="aheart-hero__inner">
    <p class="aheart-eyebrow">Vue 3 Component Library</p>
    <h1 class="aheart-title">Aheart UI</h1>
    <p class="aheart-subtitle">
      Aheart UI is a Vue 3 component library for calm, consistent product interfaces. It starts with a tested Button foundation, theme tokens, plugin installation, and a clear component roadmap.
    </p>
    <div class="aheart-actions">
      <a class="aheart-action-link" href="/en/guide/installation">
        <AButton type="primary" size="large">Get Started</AButton>
      </a>
      <a class="aheart-action-link" href="/en/components/overview">
        <AButton size="large">Components</AButton>
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
  <h2>Built For Product Interfaces</h2>
  <p class="aheart-section__intro">
    The docs follow a familiar component-library structure while keeping Aheart UI's current capability boundary visible.
  </p>
  <div class="aheart-feature-grid">
    <article class="aheart-card">
      <h3>Vue 3 + TypeScript</h3>
      <p>Component source, prop types, and build outputs are organized around Vue 3 and TypeScript.</p>
    </article>
    <article class="aheart-card">
      <h3>Theme Tokens</h3>
      <p>CSS variables control colors, font size, radius, and motion duration.</p>
    </article>
    <article class="aheart-card">
      <h3>Plugin Install</h3>
      <p>Use full installation, named imports, or single-component registration.</p>
    </article>
    <article class="aheart-card">
      <h3>Verified Foundation</h3>
      <p>Button is wired through styles, states, tests, type checking, and build verification.</p>
    </article>
  </div>
</section>

<section class="aheart-section">
  <h2>Component Roadmap</h2>
  <p class="aheart-section__intro">
    There are currently {{ readyCount }} {{ statusText.en.Ready }} components and {{ plannedCount }} {{ statusText.en.Planned }} components. {{ statusText.en.Planned }} means roadmap direction, not current availability.
  </p>
  <div class="aheart-category-grid">
    <section v-for="category in componentCategories" :key="category.key" class="aheart-component-card">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
      <div class="aheart-component-list">
        <a
          v-for="component in category.components.slice(0, 4)"
          :key="component.key"
          class="aheart-component-item"
          :href="component.link || '/en/components/overview'"
        >
          <span>
            <strong>{{ component.name }}</strong>
            <small style="display:block;color:#667085">{{ component.description }}</small>
          </span>
          <span
            class="aheart-status"
            :class="component.status === 'Ready' ? 'aheart-status--ready' : 'aheart-status--planned'"
          >
            {{ statusText.en[component.status] }}
          </span>
        </a>
      </div>
    </section>
  </div>
</section>

---
outline: false
---

<script setup lang="ts">
import { componentCategories } from '../.vitepress/data/components'
</script>

# 组件总览

Aheart UI follows a practical component roadmap. Components marked `Ready` are available in the current package. Components marked `Planned` are part of the product direction and will be implemented gradually.

<div class="aheart-section" style="padding: 18px 0 0">
  <div class="aheart-category-grid">
    <section v-for="category in componentCategories" :key="category.name" class="aheart-component-card">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
      <div class="aheart-component-list">
        <a
          v-for="component in category.components"
          :key="component.name"
          class="aheart-component-item"
          :href="component.link || '#'"
          :aria-disabled="!component.link"
        >
          <span>
            <strong>{{ component.name }}</strong>
            <small style="display:block;color:#667085">{{ component.description }}</small>
          </span>
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
</div>

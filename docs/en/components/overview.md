---
outline: false
---

<script setup lang="ts">
import { getComponentCategories, statusText } from '../../.vitepress/data/components'

const componentCategories = getComponentCategories('en')
</script>

# Components Overview

Aheart UI organizes components around common product-interface tasks. Components marked `{{ statusText.en.Ready }}` are available in the current package. Components marked `{{ statusText.en.Planned }}` are roadmap items that will be implemented gradually.

<div class="aheart-section" style="padding: 18px 0 0">
  <div class="aheart-category-grid">
    <section v-for="category in componentCategories" :key="category.key" class="aheart-component-card">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
      <div class="aheart-component-list">
        <a
          v-for="component in category.components"
          :key="component.key"
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
            {{ statusText.en[component.status] }}
          </span>
        </a>
      </div>
    </section>
  </div>
</div>

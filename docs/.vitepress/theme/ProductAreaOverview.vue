<template>
  <main v-if="area" class="aheart-product-area" :data-area="area.key">
    <header class="aheart-product-area__hero">
      <p class="aheart-product-area__eyebrow">{{ area.eyebrow }}</p>
      <h1>{{ area.name }}</h1>
      <p class="aheart-product-area__lead">{{ area.description }}</p>
      <p class="aheart-product-area__note">{{ area.packageNote }}</p>
    </header>

    <section v-for="section in area.sections" :key="section.key" class="aheart-product-area__section" :id="section.key">
      <header class="aheart-product-area__section-header">
        <div>
          <p class="aheart-product-area__section-kicker">{{ area.name }}</p>
          <h2>{{ section.title }}</h2>
          <p>{{ section.description }}</p>
        </div>
        <span class="aheart-product-area__section-count">{{ section.items.length }} 项</span>
      </header>

      <div class="aheart-product-area__grid">
        <article v-for="item in section.items" :key="item.key" class="aheart-product-area__card">
          <div class="aheart-product-area__card-topline">
            <span class="aheart-product-area__card-key">{{ item.key }}</span>
            <span :class="['aheart-status', statusClass(item.status)]">{{ item.statusLabel || productAreaStatusText[item.status] }}</span>
          </div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <a v-if="item.href" :href="withBase(item.href)" class="aheart-product-area__card-link">
            查看详细文档 <span aria-hidden="true">→</span>
          </a>
          <span v-else class="aheart-product-area__card-link is-disabled">等待规划门禁</span>
        </article>
      </div>
    </section>

    <aside class="aheart-product-area__guardrail">
      <strong>版本与状态说明</strong>
      <span>规划需通过对应门禁；未标为已发布的能力，不承诺当前可安装。</span>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { getProductArea, productAreaStatusText, statusClass, type ProductAreaKey } from '../data/product-areas'

const props = defineProps<{ area: ProductAreaKey }>()
const area = computed(() => getProductArea(props.area))
</script>

<template>
  <section class="aheart-component-overview" :class="{ 'is-motion-ready': motionReady }" aria-label="组件能力域">
    <header class="aheart-component-overview__header">
      <p class="aheart-component-overview__eyebrow">COMPONENT SYSTEM / CN</p>
      <h1>组件总览</h1>
      <p>按照产品任务与能力层级组织组件，从设计基础逐步进入高级工作区与智能产品能力。</p>
    </header>

    <section
      v-for="(domain, index) in domains"
      :key="domain.key"
      :ref="(element) => setDomainRef(element, index)"
      class="aheart-component-domain"
      :class="{ 'is-revealed': revealedDomains.has(domain.key) }"
      :data-domain="domain.key"
    >
      <header class="aheart-component-domain__header">
        <span class="aheart-component-domain__index">0{{ index + 1 }}</span>
        <div>
          <h2>{{ domain.name }}</h2>
          <p>{{ domain.description }}</p>
        </div>
        <span class="aheart-component-domain__count">{{ domain.components.length }} 个组件</span>
      </header>
      <div class="aheart-component-domain__items">
        <a v-for="component in domain.components" :key="component.key" :href="component.link" class="aheart-component-item">
          <span>
            <strong>{{ component.name }}</strong>
            <small>{{ component.zhName }} · {{ component.description }}</small>
          </span>
          <span :class="['aheart-status', `aheart-status--${component.status.toLowerCase()}`]">
            {{ statusText.zh[component.status] }}
          </span>
        </a>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getComponentDomains, statusText } from '../data/components'

const domains = getComponentDomains('zh')
const domainElements = ref<HTMLElement[]>([])
const revealedDomains = ref(new Set<string>())
const motionReady = ref(false)
let observer: IntersectionObserver | undefined

const setDomainRef = (element: Element | null, index: number) => {
  if (element instanceof HTMLElement) domainElements.value[index] = element
}

onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealedDomains.value = new Set(domains.map((domain) => domain.key))
    return
  }

  revealedDomains.value = new Set([domains[0].key])
  motionReady.value = true

  observer = new IntersectionObserver(
    (entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
        const key = entry.target.getAttribute('data-domain')
        if (!key) return
        revealedDomains.value = new Set([...revealedDomains.value, key])
        observer?.unobserve(entry.target)
      })
    },
    { threshold: 0.12 }
  )
  domainElements.value.forEach((element) => observer?.observe(element))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

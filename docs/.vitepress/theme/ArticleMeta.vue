<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const show = computed(() => {
  const path = page.value.relativePath
  return Boolean(path) && !path.endsWith('index.md') && frontmatter.value.articleMeta !== false
})

const stats = computed(() => frontmatter.value.readingStats ?? { words: 0, minutes: 1 })
</script>

<template>
  <div v-if="show" class="article-meta" aria-label="文章阅读信息">
    <span class="article-meta__item">
      <span class="article-meta__icon" aria-hidden="true">⌁</span>
      约 {{ stats.words }} 字
    </span>
    <span class="article-meta__dot" aria-hidden="true" />
    <span class="article-meta__item">
      <span class="article-meta__icon" aria-hidden="true">◷</span>
      {{ stats.minutes }} 分钟阅读
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, isDark, page } = useData()
const container = ref<HTMLElement>()

const showComments = computed(() => {
  const path = page.value.relativePath
  return Boolean(path) && !path.endsWith('index.md') && frontmatter.value.comments !== false
})

function loadGiscus() {
  if (!showComments.value || !container.value) return

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', 'scrapal/algorithm-blog')
  script.setAttribute('data-repo-id', 'R_kgDOUROPag')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOUROPas4DFIO1')
  script.setAttribute('data-mapping', 'specific')
  script.setAttribute('data-term', page.value.relativePath.replace(/\.md$/, ''))
  script.setAttribute('data-strict', '1')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')

  container.value.replaceChildren(script)
}

function updateTheme() {
  const iframe = container.value?.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: isDark.value ? 'dark' : 'light'
        }
      }
    },
    'https://giscus.app'
  )
}

onMounted(loadGiscus)

watch(
  () => page.value.relativePath,
  async () => {
    await nextTick()
    loadGiscus()
  }
)

watch(isDark, updateTheme)
</script>

<template>
  <section v-if="showComments" class="giscus-comments" aria-labelledby="comments-title">
    <h2 id="comments-title">评论</h2>
    <p class="giscus-comments__hint">
      使用 GitHub 账号参与讨论，评论内容由
      <a href="https://giscus.app/zh-CN" target="_blank" rel="noreferrer">Giscus</a>
      托管。
    </p>
    <div ref="container" class="giscus-comments__widget" />
  </section>
</template>

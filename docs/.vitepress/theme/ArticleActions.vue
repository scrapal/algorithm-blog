<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

const show = computed(() => {
  const path = page.value.relativePath
  return Boolean(path) && !path.endsWith('index.md') && frontmatter.value.articleActions !== false
})

function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const success = document.execCommand('copy')
  textarea.remove()
  return success
}

async function copyArticleLink() {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
  const text = `${page.value.title}\n${canonical || window.location.href}`
  let success = false

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      success = true
    } else {
      success = fallbackCopy(text)
    }
  } catch {
    success = fallbackCopy(text)
  }

  if (!success) return
  copied.value = true
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
  }, 1600)
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <button
    v-if="show"
    class="article-copy-link"
    type="button"
    :aria-label="copied ? '文章标题与链接已复制' : '复制文章标题与原文地址'"
    @click="copyArticleLink"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M10.6 13.4a1 1 0 0 0 1.4 1.4l4.6-4.6a3 3 0 1 0-4.2-4.2L9.7 8.7a1 1 0 0 0 1.4 1.4l2.7-2.7a1 1 0 1 1 1.4 1.4z" />
      <path d="M13.4 10.6a1 1 0 0 0-1.4-1.4l-4.6 4.6a3 3 0 1 0 4.2 4.2l2.7-2.7a1 1 0 0 0-1.4-1.4l-2.7 2.7a1 1 0 1 1-1.4-1.4z" />
    </svg>
    <span>{{ copied ? '已复制' : '复制文章链接' }}</span>
  </button>
</template>

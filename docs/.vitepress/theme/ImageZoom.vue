<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const visible = ref(false)
const imageSrc = ref('')
const imageAlt = ref('')
let previousOverflow = ''

function close() {
  if (!visible.value) return
  visible.value = false
  document.body.style.overflow = previousOverflow
}

function open(image: HTMLImageElement) {
  imageSrc.value = image.currentSrc || image.src
  imageAlt.value = image.alt
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  visible.value = true
}

function handleImageClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof HTMLImageElement)) return
  if (!target.closest('.vp-doc')) return
  if (target.closest('a') || target.hasAttribute('data-no-zoom')) return
  open(target)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', handleImageClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  close()
  document.removeEventListener('click', handleImageClick)
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => route.path, close)
</script>

<template>
  <Teleport to="body">
    <Transition name="image-zoom">
      <div
        v-if="visible"
        class="image-zoom"
        role="dialog"
        aria-modal="true"
        :aria-label="imageAlt ? `查看大图：${imageAlt}` : '查看大图'"
        @click.self="close"
      >
        <button class="image-zoom__close" type="button" aria-label="关闭大图" @click="close">×</button>
        <img class="image-zoom__image" :src="imageSrc" :alt="imageAlt" @click.stop>
      </div>
    </Transition>
  </Teleport>
</template>

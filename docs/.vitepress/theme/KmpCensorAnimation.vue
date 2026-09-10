<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Frame {
  input: number
  stack: number[]
  match: number
  deleting: number[]
  message: string
}

const source = [...'ABABABA']
const frames: Frame[] = [
  { input: -1, stack: [], match: 0, deleting: [], message: '准备从左到右扫描原串' },
  { input: 0, stack: [0], match: 1, deleting: [], message: '读入 A，模式串已经匹配 1 位' },
  { input: 1, stack: [0, 1], match: 2, deleting: [], message: '读入 B，模式串已经匹配 2 位' },
  { input: 2, stack: [0, 1, 2], match: 3, deleting: [0, 1, 2], message: '读入 A，栈顶匹配出 ABA' },
  { input: 2, stack: [], match: 0, deleting: [], message: '删除 ABA，栈变空，恢复 j=0' },
  { input: 3, stack: [3], match: 0, deleting: [], message: '读入 B，当前没有匹配字符' },
  { input: 4, stack: [3, 4], match: 1, deleting: [], message: '读入 A，模式串已经匹配 1 位' },
  { input: 5, stack: [3, 4, 5], match: 2, deleting: [], message: '读入 B，模式串已经匹配 2 位' },
  { input: 6, stack: [3, 4, 5, 6], match: 3, deleting: [4, 5, 6], message: '读入 A，栈顶再次匹配出 ABA' },
  { input: 6, stack: [3], match: 0, deleting: [], message: '删除 ABA，恢复剩余 B 保存的 j=0' }
]

const step = ref(0)
const playing = ref(true)
const current = computed(() => frames[step.value])
let timer: number | undefined

function isMatched(token: number) {
  if (!current.value.match) return false
  return current.value.stack.slice(-current.value.match).includes(token)
}

function stopTimer() {
  if (timer === undefined) return
  window.clearInterval(timer)
  timer = undefined
}

function startTimer() {
  stopTimer()
  timer = window.setInterval(() => {
    step.value = (step.value + 1) % frames.length
  }, 1300)
}

function togglePlaying() {
  playing.value = !playing.value
  if (playing.value) startTimer()
  else stopTimer()
}

function replay() {
  step.value = 0
  playing.value = true
  startTimer()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    playing.value = false
    return
  }
  startTimer()
})

onBeforeUnmount(stopTimer)
</script>

<template>
  <div class="kmp-censor" aria-label="KMP 删除模式串 ABA 的扫描动画">
    <div class="kmp-censor__header">
      <div>
        <strong>原串 ABABABA</strong>
        <span>模式串 ABA</span>
      </div>
      <div class="kmp-censor__controls">
        <button type="button" @click="togglePlaying">{{ playing ? '暂停' : '继续' }}</button>
        <button type="button" @click="replay">重播</button>
      </div>
    </div>

    <div class="kmp-censor__input" aria-label="原串扫描进度">
      <span
        v-for="(character,index) in source"
        :key="index"
        :class="{
          'is-read': index<=current.input,
          'is-current': index===current.input
        }"
      >{{ character }}</span>
    </div>

    <div class="kmp-censor__arrow" aria-hidden="true">
      <span :style="{ '--step': Math.max(current.input,0) }" />
    </div>

    <div class="kmp-censor__status" aria-live="polite">{{ current.message }}</div>

    <div class="kmp-censor__result">
      <div class="kmp-censor__label">字符栈</div>
      <div class="kmp-censor__stack">
        <TransitionGroup name="censor-stack">
          <span
            v-for="token in current.stack"
            :key="token"
            :class="{
              'is-matched': isMatched(token),
              'is-deleting': current.deleting.includes(token)
            }"
          >{{ source[token] }}</span>
        </TransitionGroup>
        <em v-if="!current.stack.length">空</em>
      </div>
      <div class="kmp-censor__match">j = <strong>{{ current.match }}</strong></div>
    </div>

    <div class="kmp-censor__progress" aria-hidden="true">
      <span v-for="(_,index) in frames" :key="index" :class="{ active: index===step }" />
    </div>
  </div>
</template>

<style scoped>
.kmp-censor {
  margin: 1.25rem 0;
  padding: 1.1rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.9rem;
  background:
    linear-gradient(rgba(85, 230, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(85, 230, 255, 0.035) 1px, transparent 1px),
    var(--vp-c-bg-soft);
  background-size: 24px 24px;
}

.kmp-censor__header,
.kmp-censor__result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.kmp-censor__header > div:first-child {
  display: grid;
  gap: 0.15rem;
}

.kmp-censor__header strong {
  color: var(--vp-c-text-1);
}

.kmp-censor__header span,
.kmp-censor__label {
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
}

.kmp-censor__controls {
  display: flex;
  gap: 0.45rem;
}

.kmp-censor__controls button {
  padding: 0.28rem 0.62rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.45rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-elv);
  font-size: 0.76rem;
  cursor: pointer;
}

.kmp-censor__controls button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.kmp-censor__input {
  display: grid;
  grid-template-columns: repeat(7, minmax(2rem, 3.25rem));
  justify-content: center;
  gap: clamp(0.3rem, 1.5vw, 0.65rem);
  margin-top: 1.15rem;
}

.kmp-censor__input span,
.kmp-censor__stack > span {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.55rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-elv);
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  transition: color 0.22s ease, border-color 0.22s ease, background-color 0.22s ease, transform 0.22s ease;
}

.kmp-censor__input span.is-read {
  color: var(--vp-c-text-1);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-divider));
  background: var(--vp-c-brand-soft);
}

.kmp-censor__input span.is-current {
  transform: translateY(-0.2rem);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 18px color-mix(in srgb, var(--vp-c-brand-1) 28%, transparent);
}

.kmp-censor__arrow {
  position: relative;
  width: min(100%, 26.75rem);
  height: 1rem;
  margin: 0.15rem auto 0;
}

.kmp-censor__arrow span {
  position: absolute;
  left: calc((100% / 7) * var(--step) + (100% / 14));
  transform: translateX(-50%);
  color: var(--vp-c-brand-1);
  transition: left 0.3s ease;
}

.kmp-censor__arrow span::before {
  content: "▲";
  font-size: 0.65rem;
}

.kmp-censor__status {
  min-height: 1.8rem;
  margin: 0.4rem 0 0.85rem;
  color: var(--vp-c-text-2);
  text-align: center;
  font-size: 0.86rem;
}

.kmp-censor__result {
  min-height: 4.2rem;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 0.7rem;
  background: color-mix(in srgb, var(--vp-c-bg) 62%, transparent);
}

.kmp-censor__label {
  flex: 0 0 3rem;
}

.kmp-censor__stack {
  position: relative;
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.42rem;
}

.kmp-censor__stack > span {
  width: 2.6rem;
}

.kmp-censor__stack > span.is-matched {
  border-color: #34d399;
  color: #047857;
  background: rgba(52, 211, 153, 0.16);
}

:global(.dark) .kmp-censor__stack > span.is-matched {
  color: #6ee7b7;
}

.kmp-censor__stack > span.is-deleting {
  border-color: #fb7185;
  color: #be123c;
  background: rgba(251, 113, 133, 0.17);
  box-shadow: 0 0 16px rgba(251, 113, 133, 0.18);
}

:global(.dark) .kmp-censor__stack > span.is-deleting {
  color: #fda4af;
}

.kmp-censor__stack em {
  color: var(--vp-c-text-3);
  font-size: 0.84rem;
  font-style: normal;
}

.kmp-censor__match {
  flex: 0 0 3.3rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
}

.kmp-censor__match strong {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
}

.kmp-censor__progress {
  display: flex;
  justify-content: center;
  gap: 0.3rem;
  margin-top: 0.75rem;
}

.kmp-censor__progress span {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: var(--vp-c-divider);
  transition: width 0.22s ease, background-color 0.22s ease;
}

.kmp-censor__progress span.active {
  width: 1rem;
  background: var(--vp-c-brand-1);
}

.censor-stack-enter-active,
.censor-stack-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.censor-stack-enter-from {
  opacity: 0;
  transform: translateY(-0.6rem) scale(0.82);
}

.censor-stack-leave-to {
  opacity: 0;
  transform: translateY(0.7rem) scale(0.78);
}

@media (max-width: 40rem) {
  .kmp-censor {
    padding: 0.85rem;
  }

  .kmp-censor__input {
    grid-template-columns: repeat(7, minmax(1.8rem, 2.55rem));
    gap: 0.28rem;
  }

  .kmp-censor__result {
    gap: 0.45rem;
  }

  .kmp-censor__label {
    display: none;
  }

  .kmp-censor__stack > span {
    width: 2.2rem;
  }

  .kmp-censor__match {
    flex-basis: 3rem;
  }
}
</style>

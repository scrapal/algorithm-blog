// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ArticleMeta from './ArticleMeta.vue'
import GiscusComments from './GiscusComments.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(ArticleMeta),
      'doc-after': () => h(GiscusComments)
    })
  }
} satisfies Theme

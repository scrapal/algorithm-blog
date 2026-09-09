// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ArticleMeta from './ArticleMeta.vue'
import ArticleActions from './ArticleActions.vue'
import GiscusComments from './GiscusComments.vue'
import ImageZoom from './ImageZoom.vue'
import RecentPosts from './RecentPosts.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RecentPosts', RecentPosts)
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h('div', { class: 'article-toolbar' }, [
        h(ArticleMeta),
        h(ArticleActions)
      ]),
      'doc-after': () => h(GiscusComments),
      'layout-bottom': () => h(ImageZoom)
    })
  }
} satisfies Theme

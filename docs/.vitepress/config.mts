import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsDir = fileURLToPath(new URL('../', import.meta.url))
const siteUrl = 'https://scrapal.github.io/algorithm-blog/'
const defaultDescription = '记录算法学习与竞赛历程'
const defaultSocialImage = `${siteUrl}social-card.svg`

function getPageUrl(page: string) {
  const route = page
    .replace(/\.md$/, '.html')
    .replace(/(^|\/)index\.html$/, '$1')
  return new URL(route, siteUrl).href
}

function getReadingStats(source: string) {
  let codeLines = 0
  const text = source
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[\s\S]*?```/g, block => {
      codeLines += Math.max(0, block.split('\n').length - 2)
      return ' '
    })
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_~|:-]/g, ' ')

  const chinese = text.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g)?.length ?? 0
  const words = text
    .replace(/[\u3400-\u4dbf\u4e00-\u9fff]/g, ' ')
    .match(/[A-Za-z0-9]+(?:['_-][A-Za-z0-9]+)*/g)?.length ?? 0

  return {
    words: chinese + words,
    minutes: Math.max(1, Math.ceil(chinese / 300 + words / 180 + codeLines / 18))
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/algorithm-blog/',
  lang: 'zh-CN',
  title: "a8cde 的算法笔记",
  description: defaultDescription,
  appearance: 'dark',
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/algorithm-blog/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#080d18' }]
  ],
  sitemap: {
    hostname: siteUrl
  },
  transformPageData(pageData) {
    if (!pageData.filePath) return
    const source = readFileSync(resolve(docsDir, pageData.filePath), 'utf-8')
    pageData.frontmatter.readingStats = getReadingStats(source)
  },
  transformHead({ page, pageData, title, description }) {
    const canonicalUrl = getPageUrl(page)
    const pageDescription = pageData.frontmatter.description || description || defaultDescription
    const pageTitle = pageData.frontmatter.title || title || 'a8cde 的算法笔记'
    const socialImage = pageData.frontmatter.image
      ? new URL(pageData.frontmatter.image, canonicalUrl).href
      : defaultSocialImage
    const isArticle = Boolean(pageData.relativePath) && !pageData.relativePath.endsWith('index.md')

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:type', content: isArticle ? 'article' : 'website' }],
      ['meta', { property: 'og:site_name', content: 'a8cde 的算法笔记' }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:image', content: socialImage }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['meta', { name: 'twitter:image', content: socialImage }]
    ]
  },
  markdown: {
    math: true,
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'dracula'
    }
  },
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: '搜索文章',
            buttonAriaLabel: '搜索文章'
          },
          modal: {
            displayDetails: '显示详细结果',
            resetButtonTitle: '清除搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到相关内容',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '向上',
              navigateDownKeyAriaLabel: '向下',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    lastUpdated: {
      text: '最后更新'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '文章目录',
    returnToTopLabel: '返回顶部',
    navMenuLabel: '主导航',
    mobileMenuLabel: '打开菜单',
    extraMenuLabel: '更多选项',
    skipToContentLabel: '跳转到正文',
    externalLinkIcon: true,
    nav: [
      { text: '首页', link: '/' },
      {
        text: '算法分类',
        items: [
          { text: '基础算法', link: '/basic/' },
          { text: '数据结构', link: '/data-structure/' },
          { text: '图论', link: '/graph/' },
          { text: '动态规划', link: '/dynamic-programming/' },
          { text: '数论', link: '/number-theory/' },
          { text: '字符串', link: '/string/' }
        ]
      },
      { text: '比赛记录', link: '/contest/' },
      { text: '代码模板', link: '/templates/' }
    ],

    sidebar: {
      '/basic/': [
        {
          text: '基础算法',
          items: [
            { text: '分类首页', link: '/basic/' },
            { text: '时间复杂度', link: '/basic/complexity' },
            { text: '二分查找', link: '/basic/binary-search' },
            { text: '前缀和', link: '/basic/prefix-sum' },
            { text: '贪心算法', link: '/basic/greedy' }
          ]
        }
      ],
      '/data-structure/': [
        {
          text: '数据结构',
          items: [
            { text: '分类首页', link: '/data-structure/' },
            { text: '并查集', link: '/data-structure/dsu' },
            { text: '树状数组', link: '/data-structure/fenwick' },
            { text: '线段树', link: '/data-structure/segment-tree' }
          ]
        }
      ],
      '/graph/': [
        {
          text: '图论',
          items: [
            { text: '分类首页', link: '/graph/' },
            { text: 'DFS 与 BFS', link: '/graph/dfs-bfs' },
            { text: '最短路', link: '/graph/shortest-path' },
            { text: '最小生成树', link: '/graph/mst' }
          ]
        }
      ],
      '/dynamic-programming/': [
        {
          text: '动态规划',
          items: [
            { text: '分类首页', link: '/dynamic-programming/' },
            { text: '背包 DP', link: '/dynamic-programming/knapsack' },
            { text: '区间 DP', link: '/dynamic-programming/interval-dp' },
            { text: '树形 DP', link: '/dynamic-programming/tree-dp' }
          ]
        }
      ],
      '/number-theory/': [
        {
          text: '数论',
          items: [
            { text: '分类首页', link: '/number-theory/' },
            { text: '最大公约数', link: '/number-theory/gcd' },
            { text: '质数与筛法', link: '/number-theory/prime' },
            { text: '模运算', link: '/number-theory/modular-arithmetic' }
          ]
        }
      ],
      '/string/': [
        {
          text: '字符串',
          items: [
            { text: '分类首页', link: '/string/' },
            { text: 'KMP', link: '/string/kmp' },
            { text: '字符串哈希', link: '/string/string-hash' },
            { text: 'Trie', link: '/string/trie' }
          ]
        }
      ],
      '/contest/': [
        {
          text: '比赛记录',
          items: [
            { text: '分类首页', link: '/contest/' },
            { text: '比赛复盘模板', link: '/contest/review-template' }
          ]
        }
      ],
      '/templates/': [
        {
          text: '代码模板',
          items: [
            { text: '分类首页', link: '/templates/' },
            { text: 'C++ 基础模板', link: '/templates/cpp-base' },
            { text: '快速输入输出', link: '/templates/fast-io' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/scrapal/algorithm-blog' }
    ],
    footer: {
      message: '持续学习，保持思考。',
      copyright: 'Copyright © 2026 a8cde'
    }
  }
})

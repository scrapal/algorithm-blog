import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/algorithm-blog/',
  title: "a8cde 的算法笔记",
  description: "记录算法学习与竞赛历程",
  markdown: {
    math: true
  },
  themeConfig: {
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
    ]
  }
})

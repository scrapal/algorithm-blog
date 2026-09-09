import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader, getGitTimestamp } from 'vitepress'

export interface RecentPost {
  title: string
  url: string
  category: string
  excerpt: string
  date: string
  timestamp: number
}

const docsDir = fileURLToPath(new URL('../../', import.meta.url))
const categoryNames: Record<string, string> = {
  basic: '基础算法',
  'data-structure': '数据结构',
  graph: '图论',
  'dynamic-programming': '动态规划',
  'number-theory': '数论',
  string: '字符串',
  contest: '比赛记录',
  templates: '代码模板'
}

function getSourcePath(url: string) {
  let route = url.replace(/^\/+/, '').replace(/\.html$/, '')
  if (!route || route.endsWith('/')) route += 'index'
  return resolve(docsDir, `${route}.md`)
}

function getTitle(source: string, frontmatter: Record<string, any>) {
  if (frontmatter.title) return String(frontmatter.title)
  return source.match(/^#\s+(.+)$/m)?.[1].trim() || '未命名文章'
}

function getExcerpt(source: string, maxLength=170) {
  const text = source
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[^\n]*\n([\s\S]*?)```/g, ' $1 ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+.*$/gm, ' ')
    .replace(/^:::[^\n]*$/gm, ' ')
    .replace(/^\s*[-*+]\s+/gm, ' ')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}……`
}

function formatDate(timestamp: number) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(timestamp)
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

async function getTimestamp(filePath: string, date?: string | number | Date) {
  if (date) {
    const timestamp = new Date(date).getTime()
    if (!Number.isNaN(timestamp)) return timestamp
  }

  try {
    return await getGitTimestamp(filePath)
  } catch {
    return statSync(filePath).mtimeMs
  }
}

export default createContentLoader<RecentPost[]>('**/*.md', {
  includeSrc: true,
  transform: async pages => {
    const posts = await Promise.all(pages
      .filter(page => {
        if (!page.src?.trim()) return false
        if (page.url === '/' || page.url.endsWith('/')) return false
        if (page.frontmatter.draft || page.frontmatter.recent === false) return false
        return true
      })
      .map(async page => {
        const sourcePath = getSourcePath(page.url)
        const timestamp = await getTimestamp(sourcePath, page.frontmatter.date)
        const categoryKey = page.url.replace(/^\/+/, '').split('/')[0]

        return {
          title: getTitle(page.src!, page.frontmatter),
          url: page.url,
          category: categoryNames[categoryKey] || '学习笔记',
          excerpt: getExcerpt(page.src!),
          date: formatDate(timestamp),
          timestamp
        }
      }))

    return posts
      .filter(post => post.excerpt)
      .sort((left, right) => right.timestamp - left.timestamp || left.url.localeCompare(right.url))
      .slice(0, 4)
  }
})

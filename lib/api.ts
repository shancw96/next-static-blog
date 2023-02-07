import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import PostType from '../types/post'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const stat = fs.statSync(fullPath)
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      // regexp remove <!--more--> 
      items[field] = content.replace(/<!--\s*more\s*-->/g, '')
    }
    if (field === 'excerpt') {
      // regexp remove <!--more--> and everything after it
      items[field] = content.replace(/<!--\s*more\s*-->[\s\S]*/g, '')
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
    if (field === 'date') {
      // format to year-month-day
      items[field] = stat.birthtime.toISOString().split('T')[0]
    }
    if (field === 'updated') {
      items[field] = stat.mtime.toISOString().split('T')[0]
    }
    if (field === 'updated') {
      items.top = data.top ?? 0
    }
  })

  return items
}

function isMDNotDraftFile(slug: string) {
  const isDraft = /^draft_/.test(slug);
  const isMarkdown = /\.md$/.test(slug);
  return !isDraft && isMarkdown
}

export function getAllPosts(fields: (keyof PostType)[] = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .filter(isMDNotDraftFile)
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts in descending order
    // date 和 updated 是时间字段用于排序，优先使用 updated
    .sort((post1, post2) => {
      return new Date(post1.updated ?? post1.date) > new Date(post2.updated ?? post2.date) ? -1 : 1
    })
    // top 为置顶字段，置顶的文章排在前面
    .sort((post1, post2) => {
      const top1 = post1.top ?? 0
      const top2 = post2.top ?? 0
      return top1 > top2 ? -1 : 1
    })
  
  return posts
}

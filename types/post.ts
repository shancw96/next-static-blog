import Author from './author'

type PostType = {
  slug: string
  title: string
  date: string
  updated: string
  top: number,
  excerpt: string
  content: string
  tags: string[]
  categories: string[]
}

export default PostType

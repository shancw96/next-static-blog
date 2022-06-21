import Author from './author'

type PostType = {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  categories: string[]
}

export default PostType

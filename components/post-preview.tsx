import DateFormatter from './date-formatter'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PostBody from './post-body'
type Props = {
  title: string
  date: string
  excerpt: string
  slug: string
}

const PostPreview = ({
  title,
  date,
  excerpt,
  slug,
}: Props) => {
  return (
    <div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a className="hover:underline">{title}</a>
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <PostBody content={excerpt} />
    </div>
  )
}

export default PostPreview

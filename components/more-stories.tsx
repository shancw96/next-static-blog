import PostPreview from './post-preview'
import Post from '../types/post'

type Props = {
  posts: Post[]
}

const MoreStories = ({ posts }: Props) => {
  return (
    posts.map((post) => (
      <PostPreview
        key={post.slug}
        title={post.title}
        date={post.date}
        slug={post.slug}
        excerpt={post.excerpt}
      />
    ))
  )
}

export default MoreStories

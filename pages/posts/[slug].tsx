import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import PostBody from '../../components/post-body'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import PostType from '../../types/post'
import { Box, Heading, useMediaQuery } from '@chakra-ui/react'
import { useContext, useEffect } from 'react'
import { StoreContext } from '../../lib/store'
import { StoreActionType } from '../../lib/store/reducer'
type Props = {
  post: PostType
  morePosts: PostType[],
  allPosts: PostType[],
}

const Post = ({ post, allPosts }: Props) => {
  const router = useRouter()
  const [store, dispatch] = useContext(StoreContext);
  const [isPortable] = useMediaQuery("(min-width: 1280px)");
  useEffect(() => {
    dispatch({ type: StoreActionType.SET_POSTS, payload: allPosts });
  }, []);
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout>
      <Box w={isPortable ? "60%" : "100%"} mx={isPortable ? "auto" : "2"} >
        {router.isFallback ? (
          <Heading>Loading…</Heading>
        ) : (
          <>
            <Head>
              <title>
                {post.title} | Next.js Blog Example with {CMS_NAME}
              </title>
            </Head>
            <PostHeader
              title={post.title}
              date={post.date}
            />
            <PostBody content={post.content} />
          </>
        )}
      </Box>
    </Layout>
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "categories",
    "tags",
    "excerpt",
    "content",
  ]);
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  return {
    props: {
      post,
      allPosts
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

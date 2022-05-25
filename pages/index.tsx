import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Post from '../types/post'
import PostPreview from '../components/post-preview'
import { Container, VStack } from '@chakra-ui/react'
import { createContext } from 'react'

type Props = {
  allPosts: Post[]
}
export const PostContext = createContext<Post[]>([])
const Index = ({ allPosts }: Props) => {
  return (
    <PostContext.Provider value={allPosts}>
      <Layout>
        <Head>
          <title>ShanCW tech blog</title>
        </Head>
        <Container>
          <VStack w="60%" mx="auto" spacing={'10'}>
            {
              allPosts.map((post) => (
                <PostPreview
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  slug={post.slug}
                  excerpt={post.excerpt}
                />
              ))
            }
          </VStack>
        </Container>
      </Layout>
    </PostContext.Provider>
  )
}

export default Index

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'categories',
    'tags',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}

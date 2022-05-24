import Container from '../components/container'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Post from '../types/post'
import PostPreview from '../components/post-preview'
import { VStack } from '@chakra-ui/react'

type Props = {
  allPosts: Post[]
}

const Index = ({ allPosts }: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title>ShanCW tech blog</title>
        </Head>
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
      </Layout>
    </>
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

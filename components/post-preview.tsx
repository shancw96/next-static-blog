import DateFormatter from './date-formatter'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PostBody from './post-body'
import { Box, Center, Flex, Heading, Link as CLink, Text } from '@chakra-ui/react'
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
    <Box w="100%">
      <Heading>
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <CLink>
          {title}
          </CLink>
        </Link>
      </Heading>
      <Text color={'GrayText'}>
        {date}
      </Text>
      <PostBody content={excerpt} />
    </Box>
  )
}

export default PostPreview

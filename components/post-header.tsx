import { Box, Heading, Text } from '@chakra-ui/react'
import DateFormatter from './date-formatter'
import PostTitle from './post-title'
type Props = {
  title: string
  coverImage: string
  date: string
}

const PostHeader = ({ title, coverImage, date }: Props) => {
  return (
    <>
      <Heading>{title}</Heading>
      <Text color="GrayText">{date}</Text>
    </>
  )
}

export default PostHeader

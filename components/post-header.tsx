import { Box, Heading, Text } from '@chakra-ui/react'
type Props = {
  title: string
  date: string
}

const PostHeader = ({ title, date }: Props) => {
  return (
    <>
      <Heading>{title}</Heading>
      <Text color="GrayText">{date}</Text>
    </>
  )
}

export default PostHeader

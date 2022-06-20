import { Text, Heading, HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
type Props = {
  title: string
  date: string
}

const PostHeader = ({ title, date }: Props) => {
  const router = useRouter();
  
  return (
    <VStack py="10">
      <Heading>{title}</Heading>
      <HStack w="100%" justifyContent={'space-between'}>
        <Text cursor={'pointer'} className='icon icon-fanhui' color="GrayText" onClick={() => router.push('/')} />
        <Text color="GrayText" alignSelf={'flex-end'}>{date}</Text>
      </HStack>
    </VStack>
  )
}

export default PostHeader

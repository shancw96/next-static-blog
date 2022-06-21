import { Text, Heading, HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
type Props = {
  title: string
  date: string
  tags: string[]
}

const PostHeader = ({ title, date, tags }: Props) => {
  console.log(tags);
  const router = useRouter();
  
  return (
    <VStack py="10">
      <Heading>{title}</Heading>
      <HStack w="100%" justifyContent={'space-between'}>
        <Text cursor={'pointer'} className='icon icon-fanhui' color="GrayText" onClick={() => router.push('/')} />
        <HStack>
          {tags?.map((tag) => <Text bgColor={'pink.100'} borderRadius={'md'} px="2" mx="1" cursor="pointer">{tag}</Text>)}
        </HStack>
        <Text color="GrayText" alignSelf={'flex-end'}>{date}</Text>
      </HStack>
    </VStack>
  )
}

export default PostHeader

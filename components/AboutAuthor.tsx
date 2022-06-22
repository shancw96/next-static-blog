import React, { useCallback } from 'react';
import { Box, Center, StackProps, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import Tag from './Tag';
type Props = {
  title: string;
  description: string;
}
export default function AboutAuthor({title, description, ...rest} : Props & StackProps) {
  const router = useRouter();
  const activeTag = router.query?.tag as string;
  const cancelTag = () => {
    router.push('/');
  }
  return <VStack {...rest}>
    <Text fontSize={'3xl'} px="12" py="1" bg="black" color="whitesmoke">{title}</Text>
    <Text textColor={'GrayText'}>{description}</Text>
    {
      !!activeTag && <Tag title={activeTag} handleClick={cancelTag} />
    }
  </VStack>
}

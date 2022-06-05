import React from 'react';
import { Box, Center, StackProps, Text, VStack } from '@chakra-ui/react'
type Props = {
  title: string;
  description: string;
}
export default function AboutAuthor({title, description, ...rest} : Props & StackProps) {
  return <VStack {...rest}>
    <Text fontSize={'3xl'} px="12" py="1" bg="black" color="whitesmoke">{title}</Text>
    <Text textColor={'GrayText'}>{description}</Text>
  </VStack>
}

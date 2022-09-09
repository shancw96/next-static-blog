import Container from './container'
import { Center, Text, useMediaQuery } from '@chakra-ui/react'

const Footer = ({isOpen}) => {
  const [isPortable] = useMediaQuery("(min-width: 1280px)");
  return (
    <Center my="10" w={isPortable && isOpen ? `70%` : "100%"}>
      <Container >
        <Text textColor={'gray.600'}>✨Made By ShanCW✨</Text>
      </Container>
    </Center>
  )
}

export default Footer

import { Box, Center } from '@chakra-ui/react'
import { ReactNode, FunctionComponent } from 'react'

type Props = {
  children?: ReactNode
}

const Container: FunctionComponent = ({ children }: Props) => {
  return <Box>{children}</Box>
}

export default Container

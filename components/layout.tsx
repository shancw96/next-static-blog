import { Box } from '@chakra-ui/react'
import Footer from './footer'
import Meta from './meta'

type Props = {
  preview?: boolean
  children: React.ReactNode
}

const Layout = ({ preview, children }: Props) => {
  return (
    <>
      <Meta />
      <Box>{children}</Box>
      <Footer />
    </>
  )
}

export default Layout

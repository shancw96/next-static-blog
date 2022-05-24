import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Theme from '../theme'
export default function MyApp({ Component, pageProps }: AppProps) {
  return <ChakraProvider theme={Theme}>
    {/* @ts-ignore */}
    <Component {...pageProps} />
  </ChakraProvider>
  // return <Component {...pageProps} />
}

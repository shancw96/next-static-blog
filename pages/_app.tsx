import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "../theme";
import { Store } from "../lib/store";
import '../public/assets/iconfont/iconfont.css'
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={Theme}>
      <Store>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </Store>
    </ChakraProvider>
  );
}

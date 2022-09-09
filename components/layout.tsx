import { Box, Button, useMediaQuery, Text } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import { useHotKey } from "../hooks/useHotKey";
import { Category } from "./Category";
import { Drawer } from "./drawer";
import Footer from "./footer";
import Meta from "./meta";

type Props = {
  children: React.ReactNode;
};

export type ThemeContext = {
  isPortable: boolean;
};

export const ThemeContext = createContext<ThemeContext>({
  isPortable: false,
});
const Layout = ({ children }: Props) => {
  
  const [isPortable] = useMediaQuery("(min-width: 1280px)");
  const [isOpen, setIsOpen] = useState(true);
  const [lock, setLock] = useState(false);
  useHotKey('ctrl + shift + k', () => {
    setIsOpen(prev=> !prev);
  })

  useEffect(() => {
    if (!lock) {
      setLock(true);
      setIsOpen(isPortable);
    }
  }, [lock, isPortable])
  return <ThemeContext.Provider value={{ isPortable }}>
      <Meta />
      <Box pos="relative">
        <Box
          w={isPortable && isOpen ? `70%` : "100%"}
          transition="all 0.3s ease-in-out"
        >
          {children}
        </Box>
        <>
          <Drawer visible={isOpen}>
            <Category />
          </Drawer>
          <Text
            cursor={'pointer'}
            className={`icon ${!isOpen ? "icon-24px" : "icon-yincangmulu"}`}
            pos="fixed"
            color={isOpen ? "white" : "black"}
            fontSize="2xl"
            bottom={10}
            right={10}
            onClick={() => setIsOpen((prev) => !prev)}
          />
        </>
        <Footer isOpen={isOpen} />
      </Box>
      
    </ThemeContext.Provider>
};

export default Layout;

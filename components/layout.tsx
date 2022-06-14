import { Box, Button, useMediaQuery } from "@chakra-ui/react";
import { createContext, useState } from "react";
import { Category } from "./Category";
import { Drawer } from "./drawer";
import Footer from "./footer";

type Props = {
  children: React.ReactNode;
};

export type ThemeContext = {
  isPortable: boolean;
}

export const ThemeContext = createContext<ThemeContext>({
  isPortable: false
});
const Layout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPortable] = useMediaQuery("(min-width: 1280px)");
  return (
    <ThemeContext.Provider value={{isPortable}}>
      <Box pos="relative">
        <Box
          w={isPortable && isOpen ? `calc(100% - 350px);` : "100%"}
          transition="all 0.3s ease-in-out"
        >
          {children}
        </Box>
        {!!isPortable && (
          <>
            <Drawer visible={isOpen}>
              <Category />
            </Drawer>
            <Button
              pos="fixed"
              bottom={10}
              right={10}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? "hide" : "display"}
            </Button>
          </>
        )}
      </Box>
      <Footer />
    </ThemeContext.Provider>
  );
};

export default Layout;

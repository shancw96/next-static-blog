import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  visible?: boolean;
};
export function Drawer({ children, visible = true }: Props) {
  
  return (
    <Box
      pos="fixed"
      w={visible ? "350px" : "0"}
      opacity={visible ? 1 : 0}
      top="0"
      right="0"
      h="100vh"
      backgroundColor="#222"
      transition="all 0.3s ease-in-out"
      boxShadow={'inset 0 2px 6px #000'}
    >
      {children}
    </Box>
  );
}

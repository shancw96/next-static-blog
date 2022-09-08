import { Box, Text } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  visible?: boolean;
};
export function Drawer({ children, visible=false }: Props) {
  
  return (
    <Box
      pos="fixed"
      w={"350px"}
      opacity={visible ? 1 : 0}
      top="0"
      right="0"
      h="100vh"
      overflowY={'auto'}
      overflowX={'hidden'}
      backgroundColor="#222"
      transition="all 0.3s ease-in-out"
      boxShadow={'inset 0 2px 6px #000'}
    >
      {children}
    </Box>
  );
}

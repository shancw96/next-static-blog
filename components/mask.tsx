import { Box } from "@chakra-ui/react";

type Props = {
  visible: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};
export function Mask({
  visible = false,
  onPress,
  children,
}: Props): JSX.Element {
  return !!visible ? (
    <>
      <Box
        w="100%"
        h="200vh"
        pos="absolute"
        zIndex={2}
        backgroundColor={"blackAlpha.800"}
        onClick={() => onPress?.()}
      />
      {children}
    </>
  ) : (
    <></>
  );
}

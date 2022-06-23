import { Tag } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { memo, useCallback } from "react";
interface Props {
  title: string
  handleClick?: Function
  count?: number
  isActive?: boolean
}
function ArticleTag({ title, handleClick , count, isActive = false}: Props) {
  const router = useRouter();
  const handleClickTag = useCallback(() => {
    function defaultClick() {
      // define default click logic here
    }
    typeof handleClick === 'function' ? handleClick() : defaultClick();
  }, [title, handleClick]);
  return (
    <Tag
      cursor={"pointer"}
      onClick={handleClickTag}
      size={"md"}
      m="1"
      variant={isActive ? 'solid' : 'outline'}
      colorScheme="blue"
    >
      {
        !!count ? `${title} ${count}` : title
      }
    </Tag>
  );
}

export default memo(ArticleTag);

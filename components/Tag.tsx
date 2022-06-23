import { Tag } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { memo, useCallback } from "react";
interface Props {
  title: string
  handleClick?: Function
  count?: number
}
function ArticleTag({ title, handleClick , count}: Props) {
  const router = useRouter();
  const handleClickTag = useCallback(() => {
    function defaultClick() {
      router.push({
        pathname: "/",
        query: {
          tag: title,
        },
      });
    }
    typeof handleClick === 'function' ? handleClick() : defaultClick();
  }, [title, handleClick]);
  return (
    <Tag
      cursor={"pointer"}
      onClick={handleClickTag}
      size={"md"}
      m="1"
      variant="outline"
      colorScheme="blue"
    >
      {
        !!count ? `${title} ${count}` : title
      }
    </Tag>
  );
}

export default memo(ArticleTag);

import { Tag } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { memo, useCallback } from "react";
interface Props {
  title: string
  handleClick?: Function
}
function ArticleTag({ title, handleClick }: Props) {
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
  }, [title]);
  return (
    <Tag
      cursor={"pointer"}
      onClick={handleClickTag}
      size={"md"}
      variant="outline"
      colorScheme="blue"
    >
      {title}
    </Tag>
  );
}

export default memo(ArticleTag);

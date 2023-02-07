import { Text, Heading, HStack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Tag from "./Tag";
type Props = {
  title: string;
  date: string;
  updated: string;
  tags: string[];
  slug: string;
};
const PostHeader = ({ title, date, tags, slug, updated }: Props) => {
  const router = useRouter();

  return (
    <VStack py="10">
      <Heading>{title}</Heading>
      <HStack>
        <Text color="GrayText" alignSelf={"flex-end"}>
          创建：{date}
        </Text>

        {updated && (
          <>
            <Text>|</Text>{" "}
            <Text color="GrayText" alignSelf={"flex-end"}>
              更新：{updated}
            </Text>
          </>
        )}
      </HStack>
      <HStack w="100%" justifyContent={"space-between"}>
        <Text
          cursor={"pointer"}
          className="icon icon-fanhui"
          color="GrayText"
          onClick={() => router.push("/")}
        />
        <HStack>
          {tags?.map((tag) => (
            <Tag title={tag} />
          ))}
        </HStack>
      </HStack>
    </VStack>
  );
};

export default PostHeader;

import Link from "next/link";
import PostBody from "./post-body";
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Link as CLink,
  Text,
  VStack,
} from "@chakra-ui/react";
type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags: string[];
};

const PostPreview = ({ title, date, excerpt, slug, tags }: Props) => {
  return (
    <Box w="100%">
      <VStack mb="10">
        <Heading textAlign={"center"}>
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <CLink>{title}</CLink>
          </Link>
        </Heading>
        <HStack>
          {tags?.map((tag) => <Text bgColor={'pink.100'} borderRadius={'md'} px="2" mx="1" cursor="pointer">{tag}</Text>)}
        </HStack>
        <Text color={"GrayText"}>{date}</Text>
      </VStack>
      <PostBody content={excerpt} />
    </Box>
  );
};

export default PostPreview;

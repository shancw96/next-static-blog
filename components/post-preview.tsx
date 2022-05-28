import Link from "next/link";
import PostBody from "./post-body";
import {
  Box,
  Center,
  Flex,
  Heading,
  Link as CLink,
  Text,
  VStack,
} from "@chakra-ui/react";
type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
};

const PostPreview = ({ title, date, excerpt, slug }: Props) => {
  return (
    <Box w="100%">
      <VStack mb="10">
        <Heading textAlign={"center"}>
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <CLink>{title}</CLink>
          </Link>
        </Heading>
        <Text color={"GrayText"}>发布时间：{date}</Text>
      </VStack>
      <PostBody content={excerpt} />
    </Box>
  );
};

export default PostPreview;

import Link from "next/link";
import PostBody from "./post-body";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link as CLink,
  Text,
  VStack,
} from "@chakra-ui/react";
import Tag from '../components/Tag'
import { useTagSelectHook } from "../hooks/useTagSelect";
type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags: string[];
};

const PostPreview = ({ title, date, excerpt, slug, tags }: Props) => {
  const [tagList, onSelectTag] = useTagSelectHook();

  return (
    <Box w="100%">
      <VStack mb="10">
        <Heading textAlign={"center"}>
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <CLink>{title}</CLink>
          </Link>
        </Heading>
        <HStack>
          {tags?.map((tag) => (
            <Tag 
              title={tag}
              handleClick={() => onSelectTag(tag)}
              isActive={!!tagList?.find(item => item === tag)}
            />
          ))}
        </HStack>
        <Text color={"GrayText"}>{date}</Text>
      </VStack>
      <PostBody content={excerpt} />
    </Box>
  );
};

export default PostPreview;

import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import Post from "../types/post";
import PostPreview from "../components/post-preview";
import { Box, Divider, useMediaQuery, VStack } from "@chakra-ui/react";
import { createContext, useMemo } from "react";
import { SearchSuggestion } from "../components/SearchSuggest";
import { useHotKey } from "../hooks/useHotKey";

type Props = {
  allPosts: Post[];
};
export const PostContext = createContext<Post[]>([]);
const Index = ({ allPosts }: Props) => {
  const [isPortable] = useMediaQuery('(min-width: 1280px)')
  useHotKey('ctrl+shift+m', () => {
    console.log('trigger ctrl+shift+m')
  });
  useHotKey('ctrl + k', () => {
    console.log('trigger ctrl+k')
  });
  return (
    <PostContext.Provider value={allPosts}>
      <Layout>
        <Head>
          <title>ShanCW tech blog</title>
        </Head>
        <SearchSuggestion
          documents={allPosts}
        />
        <VStack w={isPortable ? '60%' : '100%'} mx={isPortable ? 'auto' : '2'} spacing={"10"}>
          {allPosts.map((post) => (
            <Box w="100%">
              <PostPreview
                key={post.slug}
                title={post.title}
                date={post.date}
                slug={post.slug}
                excerpt={post.excerpt}
              />
              <Divider my="10" />
            </Box>
          ))}
        </VStack>
      </Layout>
    </PostContext.Provider>
  );
};

export default Index;

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "categories",
    "tags",
    "excerpt",
    "content"
  ]);

  return {
    props: { allPosts },
  };
};

import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import Post from "../types/post";
import PostPreview from "../components/post-preview";
import { Box, Divider, useMediaQuery, VStack } from "@chakra-ui/react";
import { SearchSuggestion } from "../components/SearchSuggest";
import { useHotKey } from "../hooks/useHotKey";
import { StoreContext } from "../lib/store";
import { useContext, useEffect } from "react";
import { StoreActionType } from "../lib/store/reducer";

type Props = {
  allPosts: Post[];
};
const Index = ({ allPosts }: Props) => {
  const [isPortable] = useMediaQuery('(min-width: 1280px)')
  const [store, dispatch] = useContext(StoreContext)

  useEffect(() => {
    dispatch({type: StoreActionType.SET_POSTS, payload: allPosts})
  }, [])
  
  useHotKey('ctrl+shift+m', () => {
    console.log('trigger ctrl+shift+m')
  });
  useHotKey('ctrl + k', () => {
    console.log('trigger ctrl+k')
  });
  return (
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

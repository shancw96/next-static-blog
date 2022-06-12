import Layout, { ThemeContext } from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import Post from "../types/post";
import PostPreview from "../components/post-preview";
import { Box, Button, Divider, HStack, useMediaQuery, VStack } from "@chakra-ui/react";
import { StoreContext } from "../lib/store";
import { useContext, useEffect, useMemo, useState } from "react";
import { StoreActionType } from "../lib/store/reducer";
import AboutAuthor from "../components/AboutAuthor";
import { SearchSuggestion } from "../components/SearchSuggest";

type Props = {
  allPosts: Post[];
};
const Index = ({ allPosts }: Props) => {
  const [isPortable] = useMediaQuery("(min-width: 1280px)");
  const [store, dispatch] = useContext(StoreContext);
  // const { isPortable }: ThemeContext = useContext(ThemeContext);

  useEffect(() => {
    dispatch({ type: StoreActionType.SET_POSTS, payload: allPosts });
  }, []);

  const [pNum, setPNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pagedPosts = useMemo(() => {
    return allPosts.slice(pNum * pageSize, (pNum + 1) * pageSize);
  }, [pNum, pageSize]);
  const handlePageClick = (type) => {
    if (type === 'next') setPNum(prev => prev + 1);
    if (type === 'previous') setPNum(prev => prev - 1);
  };

  return (
    <Layout>
      <Head>
        <title>ShanCW tech blog</title>
      </Head>
      {!isPortable && <SearchSuggestion documents={allPosts} />}
      <AboutAuthor py="10" title={"shancw"} description={"deeper is better"} />
      <VStack
        w={isPortable ? "60%" : "100%"}
        mx={isPortable ? "auto" : "2"}
        spacing={"10"}
      >
        {pagedPosts.map((post) => (
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
      <HStack w={'100%'} justifyContent='space-between' px="10">
        <Button onClick={() => handlePageClick('previous')}>上一页</Button>
        <Button onClick={() => handlePageClick('next')}>下一页</Button>
      </HStack>
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
    "content",
  ]);

  return {
    props: { allPosts },
  };
};

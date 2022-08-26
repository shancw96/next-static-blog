import Layout, { ThemeContext } from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import Post from "../types/post";
import PostPreview from "../components/post-preview";
import {
  Box,
  Button,
  Divider,
  HStack,
  useMediaQuery,
  VStack,
  Text
} from "@chakra-ui/react";
import { StoreContext } from "../lib/store";
import { useContext, useEffect, useMemo, useState } from "react";
import { selectFilteredPosts, StoreActionType } from "../lib/store/reducer";
import AboutAuthor from "../components/AboutAuthor";
import { SearchSuggestion } from "../components/SearchSuggest";
import { useSelector } from "../lib/store/useSelector";
import { useRouter } from "next/router";

type Props = {
  allPosts: Post[];
};
const Index = ({ allPosts }: Props) => {
  const [isPortable] = useMediaQuery("(min-width: 1280px)");
  const [store, dispatch] = useContext(StoreContext);
  const router = useRouter();
  useEffect(() => {
    const tags = (router.query.tags as string)?.split(',');
    const filterPosts = tags
      ? allPosts.filter((post) =>
          post.tags.some((postTag) => {
            return tags.some(activeTag => postTag.includes(activeTag))
          })
        )
      : allPosts;
    dispatch({ type: StoreActionType.SET_POSTS, payload: filterPosts });
  }, [router]);

  const filteredPost = useSelector(selectFilteredPosts);
  const [pNum, setPNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pagedPosts = useMemo(() => {
    return filteredPost.slice(pNum * pageSize, (pNum + 1) * pageSize);
  }, [pNum, pageSize, filteredPost]);
  const totalPage = useMemo(() => {
    return Math.ceil(filteredPost.length / pageSize)
  }, [filteredPost, pageSize]);
  const handlePageClick = (type) => {
    setPNum(prev => type === "next" ? prev + 1 : prev - 1);
    window.scrollTo(0, 0);
    ``;
  };

  return (
    <Layout>
      <Head>
        <title>ShanCW tech blog</title>
        <meta name="google-site-verification" content="9gDU7WGc85oUydwbHiOODfTPuUeHhd9Frgxl1ye7UTc" />
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
              tags={post.tags}
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
      <HStack w={"100%"} justifyContent="space-between" px="40">
        <Button disabled={pNum === 0}  onClick={() => handlePageClick("previous")}>上一页</Button>
        <Text>{pNum + 1} / {totalPage}</Text>
        <Button disabled={pNum + 1 >= totalPage} onClick={() => pNum + 1 < totalPage && handlePageClick("next")}>下一页</Button>
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

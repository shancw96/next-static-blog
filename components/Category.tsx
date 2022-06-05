import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import { selectCategory, selectPosts } from "../lib/store/reducer";
import { useSelector } from "../lib/store/useSelector";
import { SearchSuggestion } from "./SearchSuggest";

type Props = {
  data: string[];
};
export function Category() {
  const categories = useSelector(selectCategory)
  const posts = useSelector(selectPosts)
  const categoryItem = ({name, count}: {[key: string]: any}) => {
    return <Box w="100%" color="white" key={name} textAlign="left">{`${name} - ${count}`}</Box>;
  };
  return <Box w="100%">
    <SearchSuggestion documents={posts}/>
    <VStack m="10" w="100%" justifyContent={'flex-start'}>
      {categories.map(categoryItem)}
    </VStack>
  </Box>
}

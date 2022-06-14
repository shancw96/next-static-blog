import { Box, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { StoreContext } from "../lib/store";
import {
  selectCategory,
  selectPosts,
  StoreActionType,
} from "../lib/store/reducer";
import { useSelector } from "../lib/store/useSelector";
import { SearchSuggestion } from "./SearchSuggest";

type Props = {
  data: string[];
};
export function Category() {
  const categories = useSelector(selectCategory);
  const posts = useSelector(selectPosts);
  const [store, dispatch] = useContext(StoreContext);
  const router = useRouter();
  const onSelectCategory = (category: string) => {
    dispatch({ type: StoreActionType.SET_FILTER_TAG, payload: category });
    router.push("/");
  };
  const categoryItem = ({ name, count }: { [key: string]: any }) => {
    const isSelected = store.filterTagList.some((tag) => {
      return tag === name
    });
    return (
      <Box
        onClick={() => onSelectCategory(name)}
        w="100%"
        cursor={'pointer'}
        color={isSelected ? "blue.500" : "gray.500"}
        key={name}
        textAlign="left"
      >
        {`${name} - ${count}`}</Box>
    );
  };
  return (
    <Box w="100%">
      <SearchSuggestion documents={posts} />
      <VStack m="10" w="100%" justifyContent={"flex-start"}>
        {categories.map(categoryItem)}
      </VStack>
    </Box>
  );
}

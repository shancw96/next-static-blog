import { Box, VStack, Text, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { remove } from "ramda";
import React, { useContext, useMemo, useState } from "react";
import { useTagSelectHook } from "../hooks/useTagSelect";
import { StoreContext } from "../lib/store";
import {
  selectCategory,
  selectFilteredPostTags,
  selectPosts,
  StoreActionType,
} from "../lib/store/reducer";
import { useSelector } from "../lib/store/useSelector";
import { SearchSuggestion } from "./SearchSuggest";
import Tag from "./Tag";

type Props = {
  data: string[];
};
export function Category() {
  const categories = useSelector(selectCategory);
  const posts = useSelector(selectPosts);
  const tags = useSelector(selectFilteredPostTags);
  const [store, dispatch] = useContext(StoreContext);
  const router = useRouter();
  const [tagList, onSelectTag] = useTagSelectHook();
  const onSelectCategory = (category: string) => {
    dispatch({ type: StoreActionType.SET_FILTER_TAG, payload: category });
    router.push("/");
  };
  const categoryItem = ({ name, count }: { [key: string]: any }) => {
    const isSelected = store.filterTagList.some((tag) => {
      return tag === name;
    });

    return (
      <Box
        w="100%"
        cursor={"pointer"}
        color={isSelected ? "blue.500" : "gray.500"}
        key={name}
        textAlign="left"
      >
        <Text
          onClick={() => onSelectCategory(name)}
        >{`${name} - ${count}`}</Text>
        <Flex wrap={"wrap"} w="90%">
          {!!tags?.length &&
            isSelected &&
            tags.map((tag) => (
              <Tag
                handleClick={() => onSelectTag(tag.title)}
                title={tag.title}
                count={tag.count}
                isActive={!!tagList?.find(item => item === tag.title)}
              />
            ))}
        </Flex>
      </Box>
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

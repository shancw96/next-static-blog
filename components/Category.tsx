import { Box, VStack, Text, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { remove } from "ramda";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTagSelectHook } from "../hooks/useTagSelect";
import { StoreContext } from "../lib/store";
import {
  selectCategory,
  selectFilteredPostTags,
  selectFilterTagList,
  selectPosts,
  selectTags,
  StoreActionType,
} from "../lib/store/reducer";
import { useSelector } from "../lib/store/useSelector";
import { SearchSuggestion } from "./SearchSuggest";
import {Collapse} from 'react-collapse';
import Tag from "./Tag";

type Props = {
  data: string[];
};
export function Category() {
  const categories = useSelector(selectCategory);
  const posts = useSelector(selectPosts);
  const tagsMap = useSelector(selectTags);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [store, dispatch] = useContext(StoreContext);
  const router = useRouter();
  const [tagList, onSelectTag] = useTagSelectHook();

  const [expandDict, setExpandDict] = useState<{[key: string]: any}>({});

  const handleExpand = (category: string) => {
    if (!expandDict[category]) {
      setExpandDict(dict => ({
        ...dict,
        [category]: true
      }))
    } else {
      setExpandDict(dict => ({
        ...dict,
        [category]: !dict[category]
      }))
    }
    console.log(expandDict);
  }

  const onSelectCategory = (category: string) => {
    dispatch({ type: StoreActionType.SET_FILTER_TAG, payload: category });
    router.push("/");
  };
  useEffect(() => {
    const tags = (router.query.tags as string)
      ?.split(",")
      .filter((item) => !!item);
    setActiveTags(tags);
  }, [router]);
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
        <Flex justify={'space-between'} width="80%">
          <Text
            onClick={() => onSelectCategory(name)}
          >{`${name} - ${count}`}</Text>
          <Text className={`${expandDict[name] ? 'icon icon-jiantoushang' : 'icon icon-jiantouxia'}`} onClick={() => handleExpand(name)}></Text>
        </Flex>
        <Collapse isOpened={expandDict[name]}>
          <Flex wrap={"wrap"} w="90%">
            {tagsMap[name].map((tag) => (
              <Tag
                handleClick={() => onSelectTag(tag.title)}
                title={tag.title}
                count={tag.count}
                isActive={!!tagList?.find((item) => item === tag.title)}
              />
            ))}
          </Flex>
        </Collapse>
      </Box>
    );
  };
  return (
    <Box w="100%">
      <SearchSuggestion documents={posts} />
      {activeTags?.length && (
        <Flex wrap={"wrap"} m="2">
          {activeTags?.map((tag) => (
            <Tag
              handleClick={() => onSelectTag(tag)}
              title={tag}
              count={""}
              isActive={!!tagList?.find((item) => item === tag)}
            />
          ))}
        </Flex>
      )}

      <VStack m="10" w="100%" justifyContent={"flex-start"}>
        {categories.map(categoryItem)}
      </VStack>
    </Box>
  );
}

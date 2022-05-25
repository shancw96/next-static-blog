import { Link as CLink, Box, Heading, Input, VStack, Text, Divider } from "@chakra-ui/react";
import FlexSearch from "flexsearch";
import Link from "next/link";
import { useEffect, useState } from "react";
import PostType from "../types/post";
import {compose, curry, pipe} from 'ramda'
type Props = {
  documents: PostType[];
};

function SearchOption({ content, title, slug }: PostType) {
  return (
    <>
    <Box w="100%">
      <Heading size={"md"} textAlign="left">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <CLink>{title}</CLink>
        </Link>
      </Heading>
      <Text noOfLines={2} dangerouslySetInnerHTML={{ __html: content }} />
    </Box>
    </>
    
  );
}

export function SearchSuggestion({ documents }: Props) {
  const [index, setIndex] = useState<FlexSearch.Index>();
  const [options, setOptions] = useState<PostType[]>([]);
  useEffect(() => {
    const index = new FlexSearch.Index({
      tokenize: "reverse",
      cache: true,
    });
    documents.forEach((document) => {
      index?.add(document.title, document.content);
    });
    setIndex(index);
  }, []);

  const onSearch = (keyword: string) => {
    const results = index?.search(keyword, 25, { suggest: true });
    setOptions(
      documents
        .filter((item) => results?.some((result) => result === item.title))
        .map((document) => {
          return {
            ...document,
            content: highlightSnippets(document.content, keyword),
          };
        })
    );
  };
  return (
    <Box pos="relative">
      <Input
        placeholder="请输入关键词搜索"
        onKeyDown={(e) => {
          e.key === "Enter" && onSearch(e.target.value);
        }}
        onBlur={(e) => {
          onSearch('');
        }}
      />
      {options?.length ? (
        <VStack
          spacing={6}
          pos="absolute"
          zIndex={2}
          bgColor="gray.200"
          p="10"
          borderEndRadius={"2xl"}
          mx="5"
          boxShadow={"dark-lg"}
        >
          {options.map((option) => (
            <SearchOption {...option} />
          ))}
        </VStack>
      ) : (
        <></>
      )}
    </Box>
  );
}

const highlightAndCut = curry((content: string, text: string) => {
  const getAllIndexes = getIndicesOf(text, content);
  const firstIndex = getAllIndexes[0];
  const lastIndex = getAllIndexes[getAllIndexes.length - 1];
  const regexp = new RegExp(`(${text})`, "ig");
  if (firstIndex === lastIndex) {
    return content
      ?.substring(firstIndex - 100, firstIndex + 100)
      .replace(regexp, `<span style="background: gold">${text}</span>`);
  } else if (firstIndex < lastIndex) {
    return content
      ?.substring(firstIndex - 100, lastIndex + 100)
      .replace(regexp, `<span style="background: gold">${text}</span>`);
  } else {
    return content;
  }

  function getIndicesOf(searchStr: string, str: string, caseSensitive = false) {
    let searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
      return [];
    }
    let startIndex = 0,
      index,
      indices = [];
    if (!caseSensitive) {
      str = str.toLowerCase();
      searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    return indices;
  }
});

function wrapWithEllipse(text: string) {
  return `...${text}...`
}

const highlightSnippets = (content: string, text: string) => compose(wrapWithEllipse, highlightAndCut(content))(text);
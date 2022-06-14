import {
  Link as CLink,
  Box,
  Heading,
  Input,
  VStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import FlexSearch from "flexsearch";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PostType from "../types/post";
import { compose, curry, pipe } from "ramda";
import { Mask } from "./mask";
import { useHotKey } from "../hooks/useHotKey";
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
        <Text noOfLines={5} dangerouslySetInnerHTML={{ __html: content }} />
      </Box>
    </>
  );
}

export function SearchSuggestion({ documents }: Props) {
  const [index, setIndex] = useState<FlexSearch.Index>();
  const [options, setOptions] = useState<PostType[]>([]);
  const inputRef = useRef<HTMLInputElement>();
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

  const [keyword, setKeyword] = useState<string>("");
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
  const onClear = () => {
    setOptions([]);
    setKeyword("");
  };
  useHotKey('ctrl+shift+k', () => {
    inputRef.current?.focus();
  })
  return (
    <Box pos="relative">
      <Input
        // @ts-ignore
        ref={inputRef}
        color={'gray'}
        placeholder="ctrl+shift+k 聚焦，回车搜索"
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e: any) => {
          e.key === "Enter" && onSearch(e.target.value);
          setKeyword(e.target.value);
        }}
        value={keyword}
      />
      <Mask visible={!!options?.length} onPress={onClear}>
        <VStack
          w="100%"
          maxH="80vh"
          overflowY={"scroll"}
          overflowX={"hidden"}
          spacing={6}
          pos="absolute"
          right={'0%'}
          zIndex={2}
          bgColor="white"
          px="5"
          py="6"
          borderBottomRadius={"2xl"}
          boxShadow={"dark-lg"}
        >
          {options.map((option) => (
            <SearchOption {...option} />
          ))}
        </VStack>
      </Mask>
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
    let startIndex = 0
    let index: number;
    const indices: number[] = [];
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
  return `...${text}...`;
}

const highlightSnippets = (content: string, text: string) =>
// @ts-ignore
  compose(wrapWithEllipse, highlightAndCut(content))(text);

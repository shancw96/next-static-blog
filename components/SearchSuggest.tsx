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
  // @ts-ignore
  const [index, setIndex] = useState<FlexSearch.Index>();
  const [options, setOptions] = useState<PostType[]>([]);
  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    // @ts-ignore
    const index = new FlexSearch.Index({
      tokenize: "reverse",
      cache: true,
    });
    documents.forEach((document) => {
      index?.add(document.title, document.content);
    });
    setIndex(index);
  }, [documents]);

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
        rounded={'none'}
        placeholder="ctrl+shift+k"
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

const highlightSnippetsV2 = curry((content: string, text: string) => {
  // 获取单词在文章中的边界
  const getWordsRange = curry((content, textList: string[]) => {
    const sortedIndexList = textList.map(text => getIndicesOf(text, content)).flat(1).sort((a, b) => a - b);
    return {
      min: sortedIndexList[0],
      max: sortedIndexList[1]
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
    
  })
  // 剪切
  const cutContentByRange = curry((content: string, range: {min: number, max: number}) => {
    return content?.substring(range.min-100, range.max + 100);
  });

  // 高亮
  const highlightContentByWords = curry((textList: string[], content: string) => {
    return textList.reduce((temp, text) => {
      const regexp = new RegExp(`(${text})`, "ig");
      return temp.replace(regexp, `<span style="background: gold">${text}</span>`);
    }, content)
  })

  function getAllSubStr(textList: string[]) {
    if (textList.length === 0) return [];
    let subList = getAllSubStr(textList.slice(1));
    return join(textList[0], subList).concat(subList)
  }

  function join(a: any, list: any[]): any[] {
    return [a, list.map(item => `${a} ${item}`)].flat(1);
  }

  const textGroup = getAllSubStr(text.split(' '));
  return pipe(getWordsRange(content), cutContentByRange(content), highlightContentByWords(textGroup))(textGroup);
})


function wrapWithEllipse(text: string) {
  return `...${text}...`;
}

const highlightSnippets = (content: string, text: string) =>
// @ts-ignore
  compose(wrapWithEllipse, highlightSnippetsV2(content))(text);

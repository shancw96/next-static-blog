import { Box, Input, Text, VStack } from "@chakra-ui/react";
import FlexSearch from "flexsearch";
interface SuggestDocument {
  id: string;
  content: string;
  title: string;
}
type Props = {
  onSelect: (suggestion: string) => void;
  suggestions: SuggestDocument[];
};
interface SuggestProps extends SuggestDocument {
  onSelect: (suggestion: string) => void;
}

function SearchOption({ id, content, title, onSelect }: SuggestProps) {
  return (
    <Box onClick={() => onSelect?.(id)}>
      <Text>{title}</Text>
      <Text>{content}</Text>
    </Box>
  );
}

export function SearchSuggestion({ onSelect, suggestions }: Props) {
  return (
    <Box pos="relative">
      <Input
        placeholder="请输入关键词搜索"
        onKeyDown={(e) => {
          e.key === "Enter" && onSearch(e.target.value);
        }}
      />
      <VStack pos="absolute">
        {suggestions.map((suggestion) => (
          <SearchOption {...suggestion} onSelect={onSelect} />
        ))}
      </VStack>
    </Box>
  );
}
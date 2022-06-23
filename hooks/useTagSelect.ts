import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

export function useTagSelectHook(): [string[], (str: string) => void] {
  const router = useRouter();
  const tagList = useMemo(() => {
    return (router.query?.tags as string)?.split(",");
  }, [router.query]);
  const onSelectTag = useCallback((tag) => {
    const tagSet = new Set(tagList);
    tagSet.has(tag) ? tagSet.delete(tag) : tagSet.add(tag);
    tagSet.delete("")
    router.push({
      pathname: "/",
      query: {
        tags: Array.from(tagSet).join(","),
      },
    });
  }, [tagList, router]);
  return [tagList, onSelectTag]
}
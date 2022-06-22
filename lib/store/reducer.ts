import PostType from "../../types/post";
// import {uniq} from 'ramda'
export type StoreAction = {
  type: StoreActionType;
  payload?: any;
}

export enum StoreActionType {
  SET_POSTS = "SET_POSTS",
  SET_FILTER_TAG = "SET_FILTER_TAG",
}


export type Store = {
  posts: PostType[];
  filterTagList: string[];
};

export const initialState: Store = {
  posts: [],
  filterTagList: [],
};

export function reducer(state: Store, { type, payload }: StoreAction): Store {
  console.log('REDUCER: ', type, payload);
  switch (type) {
    case StoreActionType.SET_POSTS:
      return {
        ...state,
        posts: payload,
      }
    case StoreActionType.SET_FILTER_TAG:
      return {
        ...state,
        // filterTagList: uniq(state.filterTagList.concat(payload))
        filterTagList: payload === state.filterTagList[0] ? [] : [payload]
      }
    default:
      return state;
  }
}

export const selectPosts = (state: Store) => state.posts;
// 获取特定分组下的post
export const selectFilteredPosts = (state: Store) => {
  return state.filterTagList.length ? state.posts.filter(post => {
    return post.categories?.some(category => {
      return state.filterTagList.includes(category);
    })
  }) : state.posts;
}

// 获取特定分组下的post的标签集合
type PostTag = {
  count: number,
  title: string;
}
export const selectFilteredPostTags = (state: Store): PostTag[] => {
  const posts = selectFilteredPosts(state);
  const tags = posts.map(post => post.tags).flat(1);
  return aggregateBySame(tags);
  function aggregateBySame(tags: string[]): PostTag[] {
    const dict = tags.reduce((acc, cur) => {
      acc[cur] = !!acc[cur] ? acc[cur] + 1 : 1;
      return acc;
    }, {});

    return Object.keys(dict).map(key => ({
      count: dict[key],
      title: key
    })).sort((tagInfoA, tagInfoB) => tagInfoB.count - tagInfoA.count)
  }
}
export const selectTags = (state: Store) => state.posts.map(post => post.tags);
export const selectCategory = (state: Store): ReturnType<objToArr> => {
  return objToArr(state.posts
    .reduce((categoryDict, curPost) => {
      curPost.categories?.forEach(category => {
        categoryDict[category] = categoryDict[category] ? categoryDict[category] + 1 : 1;
      })
      return categoryDict;
    }, {} as any)
  ).sort((a, b) => b.count - a.count)
};

type objToArr = (object: { [key: string]: any }) => {
  name: string;
  count: any;
}[]
function objToArr(object) {
  return Object.keys(object).map(key => {
    return {
      name: key,
      count: object[key],
    }
  });
}

function uniq<T>(list: T[]): T[] {
  const set = new Set(list);
  return Array.from(set);
}
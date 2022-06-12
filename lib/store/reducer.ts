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
export const selectFilteredPosts = (state: Store) => {
  return state.filterTagList.length ? state.posts.filter(post => {
    return post.categories?.some(category => {
      return state.filterTagList.includes(category);
    })
  }) : state.posts;
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
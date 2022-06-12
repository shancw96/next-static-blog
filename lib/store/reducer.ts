import PostType from "../../types/post";

export type StoreAction = {
  type: StoreActionType;
  payload?: any;
} 

export enum StoreActionType {
  SET_POSTS = "SET_POSTS",
}


export type Store = {
  posts: PostType[];
};

export const initialState: Store = {
  posts: [],
};

export function reducer(state: Store, {type, payload}: StoreAction): Store {
  switch (type) {
    case StoreActionType.SET_POSTS:
      return {
        ...state,
        posts: payload,
      }
    default:
      return state;
  }
}

export const selectPosts = (state: Store) => state.posts;
export const selectTags = (state: Store) => state.posts.map(post => post.tags);
export const selectCategory = (state: Store): ReturnType<objToArr> => {
  return objToArr(state.posts
    .reduce((categoryDict, curPost) => {
        curPost.categories?.forEach(category => {
          categoryDict[category] = categoryDict[category] ? categoryDict[category] + 1 : 1;
        })
        return categoryDict;
      }, {} as any)
  );
};

type objToArr = (object: {[key: string]: any}) => {
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
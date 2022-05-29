import { createContext, Dispatch, useReducer } from "react";
import PostType from "../../types/post";
import { initialState, reducer, Store, StoreAction } from "./reducer";


export function Store({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={[store, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
}

export const StoreContext = createContext<[Store, Dispatch<StoreAction>]>([initialState, () => {}]);

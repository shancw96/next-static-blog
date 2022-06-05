import { useContext } from "react";
import { StoreContext } from ".";

export function useSelector<TState, Selected>(selector: (state: TState) => Selected): Selected {
  const [store, dispatch] = useContext(StoreContext) as [unknown, unknown];
  return selector(store as TState);
}
import { useContext } from "react";
import { StoreContext } from ".";

// type selector= (state: T) => any;
export function useSelector<TState, Selected>(selector: (state: TState) => Selected): Selected {
  const [store, dispatch] = useContext(StoreContext);
  return selector(store as TState);
}
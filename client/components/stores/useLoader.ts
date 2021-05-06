import create, { State } from "zustand";
import { combine } from "zustand/middleware";

type keys = "friendRequest" | "messagesLoading";

interface ILoaderState extends State {
  friendRequest: boolean;
  messagesLoading: boolean;
  chatListLoading: boolean;
  clearLoaders: () => void;
  setLoader: (obj: LoaderSetProps) => void;
}

interface LoaderSetProps {
  friendRequest?: boolean;
  messagesLoading?: boolean;
  chatListLoading?: boolean;
}

const INITIAL_STATE = { friendRequest: false, messagesLoading: false, chatListLoading: false };

const useLoader = create<ILoaderState>(
  combine(INITIAL_STATE, (setState, get) => ({
    clearLoaders: () => {
      setState(INITIAL_STATE);
    },
    setLoader: (obj: LoaderSetProps) => {
      setState({ ...get(), ...obj });
    },
  }))
);

export default useLoader;

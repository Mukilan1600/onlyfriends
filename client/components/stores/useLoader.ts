import create, { State } from "zustand";
import { combine } from "zustand/middleware";

type keys = "friendRequest";

interface ILoaderState extends State {
  friendRequest: boolean;
  clearLoaders: () => void;
  setLoader: (obj: { [key in keys]: boolean }) => void;
}

const INITIAL_STATE = { friendRequest: false };

const useLoader = create<ILoaderState>(
  combine({ friendRequest: false }, (setState, getState) => ({
    clearLoaders: () => {
      setState(INITIAL_STATE);
    },
    setLoader: (obj: { [key in keys]: boolean }) => {
      setState({ ...getState(), ...obj });
    },
  }))
);

export default useLoader;

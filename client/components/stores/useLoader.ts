import create, { State } from "zustand";
import { combine } from "zustand/middleware";

interface ILoaderState extends State {
  friendRequest: boolean;
}

const INITIAL_STATE = { friendRequest: false };

const useToken = create<ILoaderState>(
  combine({ friendRequest: false }, (setState, getState) => ({
    clearLoaders: () => {
      setState(INITIAL_STATE);
    },
    setLoader: (obj: any) => {
      setState({ ...getState(), ...obj });
    },
  }))
);

export default useToken;

import create from "zustand";
import { combine } from "zustand/middleware";

const useProfile = create(combine({ user: null }, (setState) => ({
    setUser: (user: any) => setState({user})
})));

export default useProfile

import create from "zustand";
import { combine } from "zustand/middleware";

export default create(combine({ user: null }, (setState) => ({
    setUser: (user: any) => setState({user})
})));

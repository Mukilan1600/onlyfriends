import create from "zustand";
import { combine } from "zustand/middleware";

export interface IUser {
        avatarUrl: string,
        lastSeen: string,
        online: boolean,
        name: string,
        oauthId: string
}

const useProfile = create<{user: IUser}>(combine({ user: null }, (setState) => ({
    setUser: (user: any) => setState({user})
})));

export default useProfile

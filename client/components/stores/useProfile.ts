import create, { State } from "zustand";
import { combine } from "zustand/middleware";

export interface IUser {
        avatarUrl: string,
        lastSeen: string,
        online: boolean,
        name: string,
        oauthId: string
}

interface IProfile extends State {
    user: IUser
    setUser: (user: any) => void
}

const useProfile = create<IProfile>(combine({ user: null }, (setState) => ({
    setUser: (user: any) => setState({user})
})));

export default useProfile

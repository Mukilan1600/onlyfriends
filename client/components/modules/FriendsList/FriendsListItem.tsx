import React from 'react'
import { IUser } from '../../stores/useProfile'

export interface IFriendsListItem {
    user: IUser,
    chat: string;
}

const FriendsListItem: React.FC<IFriendsListItem> = ({user, chat}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <img src={user.avatarUrl} alt="user" height="50px"/>
            <div>
                <p>{user.name}</p>
                <p>Online: {user.online?'true': 'false'}</p>
            </div>
        </div>
    )
}

export default FriendsListItem

import React from 'react'

export interface IFriendsListItem {
    user: {
        avatarUrl: string,
        lastSeen: string,
        online: boolean,
        name: string,
        oauthId: string
    },
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

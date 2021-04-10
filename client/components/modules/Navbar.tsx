import React from 'react'
import useProfile from '../stores/useProfile'

export default function Navbar() {
    const { user } = useProfile();
    console.log(user);
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div></div>
            <div>{user?.name}</div>
        </div>
    )
}

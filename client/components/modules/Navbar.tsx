import React from 'react'
import useProfile from '../stores/useProfile'
import Link from 'next/link'
import { useRouter } from 'next/router';
import useToken from '../stores/useToken';

export default function Navbar() {
    const { user } = useProfile();
    const router = useRouter();
    
    const onLogout = () => {
        useToken.getState().clearTokens();
        router.push(`${process.env.NEXT_PUBLIC_SERVER}/api/auth/logout`)
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Link href="/home">Logo</Link>
            <div>
            <div>{user?.name}</div>
            <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

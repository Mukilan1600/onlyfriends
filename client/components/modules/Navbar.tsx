import React from 'react'
import useProfile from '../stores/useProfile'
import Link from 'next/link'

export default function Navbar() {
    const { user } = useProfile();
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Link href="/home">Logo</Link>
            <div>{user?.name}</div>
        </div>
    )
}

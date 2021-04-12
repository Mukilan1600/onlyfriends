import React from 'react'
import styles from './Navbar.module.css'

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
        <div className={styles.navbarLayout}>
            <Link href="/home"><p className={styles.navbarLogoText}>Only Friends</p></Link>
            <div className={styles.navbarOptions}>
                <div className={styles.profileDetails}>
                    <img src={user.avatarUrl} className={styles.profileImage} alt="profile" height="22" width="22"></img>
                    <p className={styles.profileName}>{user?.name}</p>
                </div>
                {/** @Mukilan1600 replace with notifications icon */}
                <button onClick={onLogout} style={{marginLeft: '66px'}}>Logout</button>
            </div>
        </div>
    )
}

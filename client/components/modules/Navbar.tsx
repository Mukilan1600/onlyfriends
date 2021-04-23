import React, { useState } from "react";
import styles from "./Navbar.module.css";

import useProfile from "../stores/useProfile";
import Link from "next/link";
import { useRouter } from "next/router";
import useToken from "../stores/useToken";
import ProfileModal from "./Modal/ProfileModal";
import NavbarProfileModal from "./NavbarProfileModal";

export default function Navbar() {
  const { user } = useProfile();
  const router = useRouter();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const onLogout = () => {
    useToken.getState().clearTokens();
    router.push(`${process.env.NEXT_PUBLIC_SERVER}/api/auth/logout`);
  };

  const onProfileToggle = () => {
    setProfileModalOpen((profileModalOpen) => !profileModalOpen);
  };

  return (
    <div className={styles.navbarLayout}>
      <Link href="/home">
        <p className={styles.navbarLogoText} title="Only friends">
          Only Friends
        </p>
      </Link>
      <div className={styles.navbarOptions}>
        <div className={styles.profileDetails} onClick={onProfileToggle}>
          <img
            src={user.avatarUrl}
            className={styles.profileImage}
            alt="profile"
            height="22"
            width="22"
          ></img>
          <p className={styles.profileName}>{user?.name}</p>
        </div>
      </div>
      <ProfileModal open={profileModalOpen}>
        <NavbarProfileModal />
      </ProfileModal>
    </div>
  );
}

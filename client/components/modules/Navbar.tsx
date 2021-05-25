import React, { useState } from "react";
import styles from "./Navbar.module.css";

import useProfile from "../stores/useProfile";
import Link from "next/link";
import ProfileModal from "./Modal/ProfileModal";
import NavbarProfileModal from "./NavbarProfileModal";
import GithubLogo from "../statics/icons/GithubLogo";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user } = useProfile();
  const router = useRouter();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
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
          <img src={user.avatarUrl} className={styles.profileImage} alt="profile" height="22" width="22"></img>
          <p className={styles.profileName}>{user?.name}</p>
        </div>
        {router.pathname !== "/home" && (
          <a href="https://github.com/Mukilan1600/onlyfriends" target="_blank" style={{ marginLeft: "30px" }}>
            <GithubLogo />
          </a>
        )}
      </div>
      <ProfileModal open={profileModalOpen} onClose={setProfileModalOpen.bind(this, false)}>
        <NavbarProfileModal />
      </ProfileModal>
    </div>
  );
}

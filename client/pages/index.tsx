import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../components/providers/WebSocketProvider";
import GithubLogo from "../components/statics/icons/GithubLogo";
import GoogleLogoIcon from "../components/statics/icons/GoogleLogoIcon";
import HeroSectionIllustration from "../components/statics/icons/HeroSectionIllustration";
import OnlyFriendsLogo from "../components/statics/icons/OnlyFriendsLogo";
import useSaveQueryParamsToken from "../components/stores/useSaveQueryParamsToken";
import styles from "../styles/index.module.css";

const Login: React.FC = () => {
  useSaveQueryParamsToken();
  const { socketStatus } = useContext(WebSocketContext);
  const router = useRouter();
  useEffect(() => {
    if (socketStatus === "connected") router.push("/home");
  }, [socketStatus]);
  return (
    <div className={styles.loginpage}>
      <div className={styles.hero}>
        <div className={styles.heroimg}>
          <HeroSectionIllustration />
        </div>
      </div>
      <div className={styles.rightpage}>
        <div className={styles.logoandtag}>
          <div>
            <div className={styles.logo}>
              <OnlyFriendsLogo />
            </div>
            <p className={styles.tag}> Connect better</p>
          </div>
        </div>
        <div className={styles.buttoncontainer}>
          <a
            href={`${process.env.NEXT_PUBLIC_SERVER}/api/auth/oauth`}
            className={styles.button}
          >
            <div className={styles.googlelogo}>
              <GoogleLogoIcon />
            </div>
            Login with google
          </a>
        </div>
        <div className={styles.githublink}>
          <div className={styles.githublogo}>
            <GithubLogo />
          </div>
          <a
            href="https://github.com/Mukilan1600/onlyfriends"
            target="blank"
            className={styles.githubtext}
          >
            Yes, we are Open Source
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

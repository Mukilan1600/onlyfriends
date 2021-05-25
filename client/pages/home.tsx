import Link from "next/link";
import React from "react";
import styled from "styled-components";
import NavbarAndFriendsList from "../components/modules/Wrappers/NavbarAndFriendsList";
import EmailIcon from "../components/statics/icons/EmailIcon";
import GithubLogo from "../components/statics/icons/GithubLogo";
import LinkedInIcon from "../components/statics/icons/LinkedInIcon";
import { PageComponenet } from "../types";

const HomePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  
  h1{
    margin: "50px 0px";
    font-size: 48px;
  }
  p{
    width: 50%;
    font-size: 18px;
  }

  a{
    margin: 0px 7px;
  }
`

const Home: PageComponenet = () => {
  return (
    <NavbarAndFriendsList>
      <HomePageWrapper>
        <h1>Welcome to OnlyFriends!</h1>
        <p>Get started by adding your friends! or add me with my username: “mukilan”</p>
        <div style={{height: '1px', width: '80%', background: '#C4C4C4',marginTop: "70px"}}/>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end',width: '80%',marginTop: '27px'}}>
          <a href="https://github.com/Mukilan1600/onlyfriends" target="_blank"><GithubLogo /></a>
          <a href="https://www.linkedin.com/in/mukilan-ik-8a99091ab/" target="_blank"><LinkedInIcon /></a>
          <a href="mailto:ak-muki@hotmail.com"><EmailIcon /></a>
        </div>
      </HomePageWrapper>
    </NavbarAndFriendsList>
  );
};
Home.noRedirect = true;
export default Home;

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import NavbarAndFriendsList from "../../components/modules/Wrappers/NavbarAndFriendsList";
import CheckValidChat from "../../components/modules/Wrappers/CheckValidChat";

const Chat: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    console.log(router.query);
  }, [router.query]);
  return (
    <NavbarAndFriendsList>
      <CheckValidChat>{router.query.id}</CheckValidChat>
    </NavbarAndFriendsList>
  );
};

export default Chat;

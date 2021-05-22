import { useRouter } from "next/router";
import React, { useEffect } from "react";
import CallBody from "../components/modules/Call/CallBody";
import Navbar from "../components/modules/Navbar";
import AuthenticatedPage from "../components/modules/Wrappers/AuthenticatedPage";
import { usePeerCallState } from "../components/providers/PeerCallWrapper";

const call: React.FC = () => {
  const { callStatus } = usePeerCallState();
  const router = useRouter();
  useEffect(() => {
    if (callStatus === "idle") router.push("/home");
  }, [callStatus]);

  return (
    <AuthenticatedPage>
      <Navbar />
      <CallBody />
    </AuthenticatedPage>
  );
};

export default call;

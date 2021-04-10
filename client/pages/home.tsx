import React from "react";
import AuthenticatedPage from "../components/modules/AuthenticatedPage";
import Navbar from "../components/modules/Navbar";

const Home: React.FC = () => {
  return (
    <AuthenticatedPage>
      <Navbar />
      Hello
    </AuthenticatedPage>
  );
};

export default Home;

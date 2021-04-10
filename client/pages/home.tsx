import React from "react";
import AuthenticatedPage from "../components/modules/Wrappers/AuthenticatedPage";
import Navbar from "../components/modules/Navbar";
import Layout from "../components/modules/Wrappers/Layout";
import FriendsList from "../components/modules/FriendsList/FriendsList";

const Home: React.FC = () => {
  return (
    <AuthenticatedPage>
      <Navbar />
      <Layout>
        <FriendsList />
        <div>Main</div>
      </Layout>
    </AuthenticatedPage>
  );
};

export default Home;

import React from "react";
import AuthenticatedPage from "../components/modules/Wrappers/AuthenticatedPage";
import Navbar from "../components/modules/Navbar";
import Layout from "../components/modules/Wrappers/Layout";

const Home: React.FC = () => {
  return (
    <AuthenticatedPage>
      <Navbar />
      <Layout>
        <div>Friends</div>
        <div>Main</div>
      </Layout>
    </AuthenticatedPage>
  );
};

export default Home;

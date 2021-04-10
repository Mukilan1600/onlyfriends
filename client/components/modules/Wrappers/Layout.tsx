import React from "react";

const Layout: React.FC = (props) => {
  return <div style={{ display: "flex" }}>{props.children}</div>;
};

export default Layout;

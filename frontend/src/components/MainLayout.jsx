import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
// import Footer from "./Footer";
import { useState } from "react";

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ marginLeft: collapsed ? 30 : 70 }}>
        {/* Fixed Navbar */}
        <Navbar />

        {/* Main Content */}
        <Content
          style={{marginBottom: "24px", // Make sure the footer is below the content
            marginTop: "64px", // Make sure the content is below the navbar
            minHeight: "calc(100vh - 64px)", // Take full height minus navbar
            transition: "margin-left 0.3s ease", // Smooth content shift
          }}
        >
          <Outlet />
        </Content>

        {/* Footer */}
        {/* <Footer /> */}
      </Layout>
    </Layout>
  );
};

export default MainLayout;

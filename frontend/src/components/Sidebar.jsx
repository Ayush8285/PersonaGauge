/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, SettingOutlined, FileOutlined, QuestionCircleOutlined, } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MdOutlineFeedback, MdFeedback} from "react-icons/md";
import { FaCircleInfo,  FaPhone } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoDocument, IoSettings  } from "react-icons/io5";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  // Handle hover state to control collapsing/expanding
  const handleMouseEnter = () => setCollapsed(false);
  const handleMouseLeave = () => setCollapsed(true);
  const location = useLocation();

  const menuItems = [
    {
      key: "1",
      icon: <FaHome />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "2",
      icon: <IoDocument />,
      label: <Link to="/uploadcv">Upload CV</Link>,
    },

    //jab user quiz submit kr de tho ak menu item ana chahye jispa result page show hoga
    //  usi  user ka liye sirf jisne submit ki hogi quiz  


    // {
    //   key: "3",
    //   icon: <QuestionCircleOutlined />,
    //   label: <Link to="/quiz">Quiz</Link>,
    // },
    {
      key: "4",
      icon: <MdFeedback />,
      label: <Link to="/feedback">Feedback</Link>
    },
    {
      key: "5",
      icon: <FaCircleInfo />,
      label: <Link to="/about">About Us</Link>
    },
    {
      key: "6",
      icon: <FaPhone />,
      label: <Link to="/contact">Contact Us</Link>
    },
    {
      key: "7",
      icon: <IoSettings  />,
      label: <Link to="/settings">Settings</Link>,
    },
    
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={200}
      className="transition-all duration-500 ease-in-out"  // Adjusted transition duration
      onMouseEnter={handleMouseEnter}  // Expands the sidebar on hover
      onMouseLeave={handleMouseLeave} // Collapses the sidebar when hover ends
      style={{
        position: "fixed",
        top: "64px", // Sidebar below the navbar
        left: 0,
        zIndex: 10,
        backgroundColor: "rgb(0, 21, 41)", // Sidebar background color
        minHeight: "calc(100vh - 65px)", // Ensures sidebar takes full screen height
        overflow: "hidden", // Prevents content from overflowing
        borderTopRightRadius: "10px", // Rounded top-right edge
        borderBottomRightRadius: "10px", // Rounded bottom-right edge
      }}
    >
      <div
        style={{
          height: "100%", // Ensures the sidebar content fills the entire height
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Ensures space even with no items
        }}
      >
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} style={{ flex: 1 }} />
      </div>
    </Sider>
  );
};

export default Sidebar;

import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const LogoutButton = () => {
  const handleLogout = () => {
    console.log("User Logged Out");
    // Add Logout Logic (Redux/Context/LocalStorage clear)
  };

  return (
    <Button 
      type="primary" 
      danger 
      icon={<LogoutOutlined />} 
      onClick={handleLogout} 
      className="flex items-center"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;

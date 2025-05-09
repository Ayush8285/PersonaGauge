import { Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice"; // Import logout action

const LogoutButton = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    message.success("Logged out successfully!");
    
   window.location.href = "/";
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

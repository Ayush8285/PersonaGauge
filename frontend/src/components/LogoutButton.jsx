import { Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice"; // Import logout action
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    sessionStorage.removeItem("accessToken"); // Remove token from storage
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    message.success("Logged out successfully!");
    navigate("/login"); // Redirect to login
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

import { Typography, Space, Layout, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Access Redux state
import LogoutButton from "./LogoutButton";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Get user from Redux store


  //esma abhi yha pa sirf ya check ho rha ha ki user ha abhi mujhe esma ya bhi check karwana ha
  //ki user na cv and quiz bhi submit kr di ho jab user details dekhaye da
  const handleUserDetailsClick = () => {
    if (!user ) {
      message.warning("Please upload your CV first before accessing user details.");
      return;
    }
    navigate(`/user/${user.id}`); // Redirect to user details page
  };

  return (
    <Header
      style={{
        backgroundColor: "#1f2937", // Tailwind's bg-gray-900
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        height: 64,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50, // Ensure it stays above other components
      }}
    >
      {/* Left: Dashboard Title */}
      <Text strong style={{ fontSize: 18, color: "white" }}>
        PersonaGauge
      </Text>

      {/* Right: User Info & Logout */}
      <Space size="large">
        {/* User Details Button */}
        <Button type="primary" onClick={handleUserDetailsClick}>
          User Details
        </Button>
        <LogoutButton />
      </Space>
    </Header>
  );
};

export default Navbar;

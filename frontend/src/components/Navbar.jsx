import { Typography, Space , Layout } from "antd";
import LogoutButton from "./LogoutButton";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
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
        <LogoutButton />
      </Space>
    </Header>
  );
};

export default Navbar;

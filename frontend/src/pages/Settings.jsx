import { useState } from "react";
import { Card, Typography, Switch, Input, Button, Divider, Form } from "antd";
import { SaveOutlined, UserOutlined, NotificationOutlined, SkinOutlined } from "@ant-design/icons";
import { IoSettings } from "react-icons/io5";

const { Title, Paragraph } = Typography;

const Settings = () => {
  const [theme, setTheme] = useState(false); // Dark theme toggle state
  const [notifications, setNotifications] = useState(true); // Notifications toggle state
  const [username, setUsername] = useState(""); // User's username
  const [email, setEmail] = useState(""); // User's email

  // Handle theme change
  const handleThemeChange = (checked) => {
    setTheme(checked);
    document.body.style.backgroundColor = checked ? "#121212" : "#ffffff";
    document.body.style.color = checked ? "#ffffff" : "#000000";
  };

  // Handle notifications change
  const handleNotificationsChange = (checked) => {
    setNotifications(checked);
  };

  // Handle saving changes (for now it just logs them)
  const handleSave = () => {
    console.log("Settings Saved:", { theme, notifications, username, email });
    // You can replace this with actual backend calls to save the settings
  };

  return (
    <div className="settings-container" style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        {/* Icon and Title in same line using Flexbox */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <IoSettings style={{ fontSize: "30px", color: "#1890ff", marginRight: "8px" }} />
          <Title level={2} style={{ margin: 0 }}>Settings</Title>
        </div>

        <Paragraph>Update your settings below to customize your experience.</Paragraph>

        <Divider />

        {/* Update User Info */}
        <Title level={4}>User Information</Title>
        <Form>
          <Form.Item label="Username" required>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              prefix={<UserOutlined />}
              placeholder="Enter your username"
            />
          </Form.Item>

          <Form.Item label="Email" required>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
            />
          </Form.Item>
        </Form>

        <Divider />

        {/* Theme Settings */}
        <Title level={4}>Appearance</Title>
        <div>
          <Paragraph>Enable Dark Theme</Paragraph>
          <Switch
            checked={theme}
            onChange={handleThemeChange}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            icon={<SkinOutlined />}
          />
        </div>

        <Divider />

        {/* Notification Settings */}
        <Title level={4}>Notifications</Title>
        <div>
          <Paragraph>Enable Email Notifications</Paragraph>
          <Switch
            checked={notifications}
            onChange={handleNotificationsChange}
            checkedChildren="On"
            unCheckedChildren="Off"
            icon={<NotificationOutlined />}
          />
        </div>

        <Divider />

        {/* Save Settings Button */}
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            size="large"
            onClick={handleSave}
            style={{ marginTop: "20px" }}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;

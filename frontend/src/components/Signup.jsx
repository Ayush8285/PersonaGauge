import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/slices/authSlice";
import {
  Button,
  Input,
  message,
  Form,
  Spin,
  Typography,
  Card,
  Space,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { SiGnuprivacyguard } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const SignUp = () => {
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      message.success("Signup successful!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]); // Navigate when token is updated

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      message.error("All fields are required.");
      return;
    }
    dispatch(signup(form));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        padding: "0 20px",
      }}
    >
      <Card
        style={{
          margin: "30px",
          width: 400,
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <SiGnuprivacyguard style={{ fontSize: "50px", color: "#1890ff" }} />
        <Title level={2} style={{ marginBottom: "20px" }}>
          Sign Up
        </Title>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          style={{ width: "100%" }}
        >
          <Form.Item
            label="Username"
            name="name"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                backgroundColor: "#4CAF50",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <Spin />
              ) : (
                <>
                  <SiGnuprivacyguard style={{ marginRight: "8px" }} /> Sign Up
                </>
              )}
            </Button>
          </Form.Item>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          <div style={{ marginTop: "20px" }}>
            <Space>
              <p>Already have an account?</p>
              <Button type="link" onClick={() => navigate("/login")}>
                Login
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { Button, Input, message, Form, Spin, Typography, Card, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { IoLogIn } from "react-icons/io5"; // Import icon

const { Title } = Typography;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
      if (isAuthenticated) {
        message.success("Login successful!");
        navigate("/");
      }
    }, [isAuthenticated, navigate]); // Navigate when token is updated

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      message.error("All fields are required.");
      return;
    }
    dispatch(login(form));
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
          width: 400,
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <IoLogIn style={{ fontSize: "50px", color: "#1890ff" }} />
        <Title level={2} style={{ marginBottom: "20px" }}>Login</Title>

        <Form layout="vertical" onFinish={handleSubmit} style={{ width: "100%" }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            >
              {loading ? <Spin /> : <><IoLogIn style={{ marginRight: "8px" }} /> Login</>}
            </Button>
          </Form.Item>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{typeof error === "string" ? error : JSON.stringify(error)}</p>}

          <div style={{ marginTop: "20px" }}>
            <Space>
              <p>Don&apos;t have an account?</p>
              <Button type="link" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

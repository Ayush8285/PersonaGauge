import { Layout, Typography, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Paragraph } = Typography;

const FooterComponent = () => {
  const navigate = useNavigate();

  return (
    <Layout.Footer
      style={{
        position: "relative",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgb(0, 21, 41)", // Tailwind's bg-gray-900
        color: "white",
        padding: "2px",
      }}
    >
      <div className="container">
        <div className="footer-links" style={{ textAlign: "center", marginBottom: "0.5px" }}>
          <Space size="large">
            <Button
              type="link"
              className="text-gray-400 hover:text-white transition-all"
              onClick={() => navigate("/terms")}
            >
              Terms of Service
            </Button>
            <Button
              type="link"
              className="text-gray-400 hover:text-white transition-all"
              onClick={() => navigate("/privacy")}
            >
              Privacy Policy
            </Button>
            <Button
              type="link"
              className="text-gray-400 hover:text-white transition-all"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </Button>
          </Space>
        </div>

        <div className="copyright" style={{ textAlign: "center" }}>
          <Paragraph className="text-sm" style={{ color: "white" }}>
            © 2025 Your Company. All rights reserved.
          </Paragraph>
        </div>
      </div>
    </Layout.Footer>
  );
};

export default FooterComponent;

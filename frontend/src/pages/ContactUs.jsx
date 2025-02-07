import { Card, Typography, Space, Divider } from "antd";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const { Title, Text } = Typography;

const ContactUs = () => {
  return (
    <div className="contact-container" style={{ padding: "50px", maxWidth: "700px", margin: "auto" }}>
      {/* Header Section */}
      <Space align="center" style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <FaPhone style={{ fontSize: "36px", color: "#1890ff" }} />
        <Title level={2} style={{ margin: 0 }}>Contact Us</Title>
      </Space>

      <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: "30px" }}>
        We’re here to help! Reach out to us through any of the following ways.
      </Text>

      {/* Contact Information Card */}
      <Card style={{ borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
        
        {/* Email Section */}
        <Space direction="horizontal" style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <FaEnvelope style={{ fontSize: "20px", color: "#1890ff" }} />
          <Text strong>Email:</Text>
          <Text>
            <a href="personagauge@gmail.com">personagauge@gmail.com</a>
          </Text>
        </Space>

        <Divider />

        {/* Phone Section */}
        <Space direction="horizontal" style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <FaPhone style={{ fontSize: "20px", color: "#1890ff" }} />
          <Text strong>Phone:</Text>
          <Text>+91 9898989898</Text>
        </Space>

        <Divider />

        {/* Office Location */}
        <Space direction="horizontal" style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <FaMapMarkerAlt style={{ fontSize: "20px", color: "#1890ff" }} />
          <Text strong>Address:</Text>
          <Text>Ghaziabad</Text>
        </Space>

        <Divider />

        {/* Office Hours */}
        <Space direction="horizontal" style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <FaClock style={{ fontSize: "20px", color: "#1890ff" }} />
          <Text strong>Working Hours:</Text>
          <Text>Not Fixed</Text>
        </Space>

        <Divider />

        {/* Social Media Links */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Text strong>Follow us on:</Text>
          <Space size="large" style={{ marginLeft: "10px" }}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook style={{ fontSize: "24px", color: "#4267B2" }} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter style={{ fontSize: "24px", color: "#1DA1F2" }} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin style={{ fontSize: "24px", color: "#0077B5" }} />
            </a>
          </Space>
        </div>

      </Card>
    </div>
  );
};

export default ContactUs;

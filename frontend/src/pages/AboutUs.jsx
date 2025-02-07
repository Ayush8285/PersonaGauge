import { Card, Typography, Space } from "antd";
import { FaCircleInfo } from "react-icons/fa6";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div className="about-container" style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <Space align="center" style={{ marginBottom: "20px" }}>
        <FaCircleInfo style={{ fontSize: "30px", color: "#1890ff" }} />
        <Title level={2}>About Us</Title>
      </Space>

      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={3}>Welcome to PersonaGauge</Title>
        <Paragraph>
          PersonaGauge is a cutting-edge application designed to help individuals understand their personality
          traits and find the best career opportunities suited to their skills. By combining quiz-based analysis,
          advanced AI technology, and personalized recommendations, we aim to empower people in their professional journey.
        </Paragraph>

        <Title level={4}>Our Mission</Title>
        <Paragraph>
          Our mission is to provide users with a deeper understanding of their strengths and preferences,
          enabling them to make informed decisions about their careers and personal growth.
        </Paragraph>

        <Title level={4}>Our Team</Title>
        <Paragraph>
          Our team consists of passionate professionals who are committed to bringing the best personality insights
          to users. With expertise in data science, AI, psychology, and design, we aim to create the most accurate
          and user-friendly experience possible.
        </Paragraph>

        <Title level={4}>Contact Us</Title>
        <Paragraph>
          Have questions or feedback? Feel free to <a href="/contact">reach out</a> to us. We would love to hear from you!
        </Paragraph>
      </Card>
    </div>
  );
};

export default AboutUs;

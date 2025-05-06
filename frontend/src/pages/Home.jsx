/* eslint-disable no-unused-vars */
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Menu, Button, Card, Typography, Row, Col } from "antd";
import {
  TwitterOutlined,
  FacebookOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import "antd/dist/reset.css";

// Importing images for services
import feature from "../assets/images/personality.jpg";
import about from "../assets/images/big_image.jpg";
import contact from "../assets/images/contact1.jpg";
import contentImage from "../assets/images/background.png";
import cvAnalysisImage from "../assets/images/cv11.jpg";
import personalityQuizImage from "../assets/images/quiz.jpg";
import jobRoleImage from "../assets/images/job_role_match1.jpeg";
import resultVisualizationImage from "../assets/images/result.png";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  const location = useLocation();

  const [activeKey, setActiveKey] = useState("services");
  const handleMenuClick = (e) => {
    setActiveKey(e.key);
  };

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      {/* Navbar */}
      <Header className="bg-[#0d1b2a] sticky top-0 z-50 p-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-[#00b4d8]">PersonaGauge</div>

          <Menu
            mode="horizontal"
            theme="dark"
            className="flex-1 justify-center"
            onClick={handleMenuClick}
            selectedKeys={[activeKey]}
          >
            <Menu.Item
              key="services"
              className={`menu-link ${
                activeKey === "services" ? "text-[#00b4d8] " : "text-white"
              }`}
            >
              <a
                href="#services"
                className="transition duration-300 transform hover:text-[#00b4d8] hover:scale-105"
              >
                Services
              </a>
            </Menu.Item>
           <Menu.Item
              key="features"
              className={`menu-link ${
                activeKey === "features" ? "text-[#00b4d8]" : "text-white"
              }`}
            >
              <a
                href="#features"
                className="transition duration-300 transform hover:text-[#00b4d8] hover:scale-105"
              >
                Features
              </a>
            </Menu.Item>
            <Menu.Item
              key="about"
              className={`menu-link ${
                activeKey === "about" ? "text-[#00b4d8]" : "text-white"
              }`}
            >
              <a
                href="#about"
                className="transition duration-300 transform hover:text-[#00b4d8] hover:scale-105"
              >
                About
              </a>
            </Menu.Item>
            
             <Menu.Item
              key="contact"
              className={`menu-link ${
                activeKey === "contact" ? "text-[#00b4d8]" : "text-white"
              }`}
            >
              <a
                href="#contact"
                className="transition duration-300 transform hover:text-[#00b4d8] hover:scale-105"
              >
                Contact Us
              </a>
            </Menu.Item>
          </Menu>

          <div className="flex gap-4">
            <Link to="/login">
              <Button
                ghost
                className="text-[#00b4d8] border-[#00b4d8] transition-all duration-300 transform hover:bg-[#00b4d8] hover:text-white hover:scale-105"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                type="primary"
                className="bg-[#00b4d8] border-[#00b4d8] transition-all duration-300 transform hover:bg-[#009bbf] hover:text-white hover:scale-105"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </Header>

      <Content>
        {/* Header Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          style={{
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            backgroundImage: `url(${contentImage})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            objectFit: "contain",
            color: "white",
            padding: "0 20px",
          }}
        >
          <Title
            level={1}
            style={{ color: "white", fontSize: "48px", marginBottom: "20px" }}
          >
            Discover Your Ideal Career & Personality
          </Title>
          <Paragraph
            style={{ color: "white", fontSize: "18px", maxWidth: "600px" }}
          >
            With PersonaGauge, transform your CV and quiz responses into
            personalized career guidance and personality insights.
          </Paragraph>
        </motion.section>

        {/* Services Section */}
        <motion.section
          id="services"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          style={{ padding: "80px 40px", backgroundColor: "#f0f2f5" }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#0077b6" }}>
            Our Services
          </Title>
          <Row gutter={[24, 24]} justify="center" style={{ marginTop: "40px" }}>
            <Col xs={24} sm={12} lg={12} xl={12}>
              <Card
                hoverable
                style={{
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flex: 1, position: "relative", height: "300px" }}>
                  <img
                    alt="CV Analysis"
                    src={cvAnalysisImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <Title level={3} style={{ fontSize: "20px" }}>
                    CV Analysis
                  </Title>
                  <Paragraph style={{ fontSize: "16px" }}>
                    We analyze your resume to detect skills and match you with
                    ideal job roles.
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={12} xl={12}>
              <Card
                hoverable
                style={{
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flex: 1, position: "relative", height: "300px" }}>
                  <img
                    alt="Personality Quiz"
                    src={personalityQuizImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <Title level={3} style={{ fontSize: "20px" }}>
                    Personality Quiz
                  </Title>
                  <Paragraph style={{ fontSize: "16px" }}>
                    Answer insightful questions and get detailed personality
                    predictions.
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={12} xl={12}>
              <Card
                hoverable
                style={{
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flex: 1, position: "relative", height: "300px" }}>
                  <img
                    alt="Job Role Matching"
                    src={jobRoleImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <Title level={3} style={{ fontSize: "20px" }}>
                    Job Role Matching
                  </Title>
                  <Paragraph style={{ fontSize: "16px" }}>
                    Our AI recommends roles that fit your skills and traits.
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={12} xl={12}>
              <Card
                hoverable
                style={{
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flex: 1, position: "relative", height: "300px" }}>
                  <img
                    alt="Result Visualization"
                    src={resultVisualizationImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <Title level={3} style={{ fontSize: "20px" }}>
                    Result Visualization
                  </Title>
                  <Paragraph style={{ fontSize: "16px" }}>
                    Understand your results better through clear and interactive
                    charts.
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          style={{ padding: "80px 40px", backgroundColor: "white" }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#3a0ca3" }}>
            Why Choose Us?
          </Title>

          <Row
            gutter={40}
            align="middle"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            {/* Left Column: Image */}
            <Col xs={24} sm={12} lg={12} xl={12}>
              <img
                src={feature}
                alt="Why Choose Us"
                style={{ width: "80%", height: "auto", borderRadius: "8px" }}
              />
            </Col>

            {/* Right Column: Features Content */}
            <Col xs={24} sm={12} lg={12} xl={12}>
              <ul
                style={{
                  maxWidth: "800px",
                  margin: "20px auto 0",
                  fontSize: "18px",
                  listStyleType: "disc",
                  paddingLeft: "20px",
                }}
              >
                <li>
                  Cutting-edge AI for precise personality and career analysis
                </li>
                <li>Secure and fast resume processing</li>
                <li>Beautiful visual feedback and predictions</li>
                <li>Tailored experiences based on user input</li>
                <li>Expertly designed user interface for easy navigation</li>
                <li>
                  Comprehensive career recommendations for long-term growth
                </li>
                <li>Continuous improvements based on user feedback</li>
              </ul>
            </Col>
          </Row>
        </motion.section>

        {/* About Section */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          style={{ padding: "80px 40px", backgroundColor: "#edf2fb" }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#0077b6" }}>
            About Us
          </Title>

          <Row
            gutter={40}
            align="middle"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <Col xs={24} sm={12} lg={12} xl={12}>
              <Paragraph style={{ fontSize: "18px", textAlign: "left" }}>
                PersonaGauge is a next-gen platform built with AI and machine
                learning to empower individuals by analyzing their unique
                strengths. We help users unlock career opportunities through
                data-driven insights.
              </Paragraph>
              <Paragraph style={{ fontSize: "18px", textAlign: "left" }}>
                Our platform uses advanced algorithms to predict the best job
                roles based on individual profiles. Whether you&apos;re a fresh
                graduate or an experienced professional, PersonaGauge will guide
                you through personalized career recommendations, skills
                improvement, and more.
              </Paragraph>
              <Paragraph style={{ fontSize: "18px", textAlign: "left" }}>
                With a comprehensive approach, we aim to help users discover
                their ideal job roles, boost their personal growth, and build
                the future they aspire to.
              </Paragraph>
            </Col>

            <Col xs={24} sm={12} lg={12} xl={12}>
              <img
                src={about}
                alt="About Us"
                style={{ width: "80%", height: "auto", borderRadius: "8px" }}
              />
            </Col>
          </Row>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          style={{ padding: "80px 40px", backgroundColor: "white" }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#3a0ca3" }}>
            Contact Us
          </Title>

          <Row gutter={24} justify="center" style={{ marginTop: "40px" }}>
            {/* Left side: Image */}
            <Col xs={24} sm={12} lg={12} xl={12}>
              <img
                alt="Contact Us Image"
                src={contact}
                style={{
                  width: "80%",
                  height: "auto",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </Col>

            {/* Right side: Contact content */}
            <Col xs={24} sm={12} lg={12} xl={12}>
              <div
                style={{
                  maxWidth: "600px",
                  margin: "20px auto 0",
                  textAlign: "center",
                  marginTop: "100px",
                }}
              >
                <Paragraph>Have any questions or need help?</Paragraph>

                {/* Email Address */}
                <Paragraph>
                  Email us at{" "}
                  <a
                    href="mailto:personagauge@gmail.com"
                    style={{ color: "#0077b6", textDecoration: "underline" }}
                  >
                    personagauge@gmail.com
                  </a>
                </Paragraph>

                {/* Phone Number */}
                <Paragraph>
                  Call us at{" "}
                  <a
                    href="tel:+91 9898989898"
                    style={{ color: "#0077b6", textDecoration: "underline" }}
                  >
                    +91 9898989898
                  </a>
                </Paragraph>

                {/* Optional: Social Media Links */}
                <Paragraph>Follow us on social media:</Paragraph>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                  }}
                >
                  <a
                    href="https://twitter.com/personagauge"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterOutlined
                      style={{ fontSize: "24px", color: "#0077b6" }}
                    />
                  </a>
                  <a
                    href="https://facebook.com/personagauge"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookOutlined
                      style={{ fontSize: "24px", color: "#0077b6" }}
                    />
                  </a>
                  <a
                    href="https://linkedin.com/company/personagauge"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinOutlined
                      style={{ fontSize: "24px", color: "#0077b6" }}
                    />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </motion.section>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#dbe9f4",
          color: "#333",
          padding: "24px",
        }}
      >
        &copy; {new Date().getFullYear()} PersonaGauge. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default Home;

import { useState } from "react";
import { Input, Button, Form, message, Typography, Space } from "antd";
import { FaPhone } from "react-icons/fa6";
import axios from "axios";

const { Title } = Typography;

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !messageContent) {
      message.error("Please fill in all fields");
      return;
    }

    const contactData = {
      name: name,
      email: email,
      message: messageContent,
    };

    try {
      const response = await axios.post("http://localhost:8000/contact-us/", contactData);
      if (response.status === 201) {
        message.success("Your message has been sent successfully!");
        // Clear the form
        setName("");
        setEmail("");
        setMessageContent("");
      }
    } catch (error) {
      console.error("Error submitting message:", error);
      message.error("Failed to send your message. Please try again.");
    }
  };

  return (
    <div className="contact-container" style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <Space align="center" style={{ marginBottom: "20px" }}>
        <FaPhone style={{ fontSize: "30px", color: "#1890ff" }} />
        <Title level={2}>Contact Us</Title>
      </Space>

      <Form layout="vertical">
        <Form.Item label="Name">
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </Form.Item>
        <Form.Item label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </Form.Item>
        <Form.Item label="Message">
          <Input.TextArea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Enter your message"
            rows={4}
          />
        </Form.Item>
        <Button type="primary" onClick={handleSubmit}>Send Message</Button>
      </Form>
    </div>
  );
};

export default ContactUs;

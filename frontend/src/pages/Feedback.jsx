import { useState } from "react";
import { Input, Button, Form, message } from "antd";
import { MdFeedback } from "react-icons/md";
import axios from "axios";

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !messageContent) {
      message.error("Please fill in all fields");
      return;
    }

    const feedbackData = {
      name: name,
      email: email,
      message: messageContent,
    };

    try {
      const response = await axios.post("http://localhost:8000/submit-feedback/", feedbackData);  // backend url
      if (response.status === 201) {
        message.success("Feedback submitted successfully!");
        // Clear the form
        setName("");
        setEmail("");
        setMessageContent("");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      message.error("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="feedback-container" style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      {/* Icon and Title in the same line */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <MdFeedback style={{ fontSize: "30px", marginRight: "8px", color: "#1890ff" }} />
        <h2 style={{ margin: 0 }}>Submit Your Feedback</h2>
      </div>

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
            placeholder="Enter your feedback message"
            rows={4}
          />
        </Form.Item>
        <Button type="primary" onClick={handleSubmit}>Submit Feedback</Button>
      </Form>
    </div>
  );
};

export default Feedback;

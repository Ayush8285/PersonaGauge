import { useState, useEffect } from "react";
import { Card, Typography, Button, Divider, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Results = () => {
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  // Simulate fetching the answers passed from the quiz page
  useEffect(() => {
    const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
    setAnswers(userAnswers);
  }, []);

  const handleGoHome = () => {
    navigate("/"); // Redirect to the home page
  };

  return (
    <div className="p-6" style={{ maxWidth: "800px", margin: "auto", paddingTop: "40px" }}>
      <Card>
        <Title level={2} className="text-center">Your Quiz Results</Title>
        <Paragraph className="text-center">
          Here&apos;s what we found based on your quiz answers.
        </Paragraph>
      </Card>

      <Divider />

      {/* Display the answers */}
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={4}>Your Answers:</Title>
        <div>
          {answers.map((answer, index) => (
            <Paragraph key={index} style={{ fontSize: "16px" }}>
              <strong>Q{index + 1}:</strong> {answer}
            </Paragraph>
          ))}
        </div>

        {/* Based on the answers, you can perform analysis and show a result */}
        <Space direction="vertical" style={{ marginTop: "20px", width: "100%" }}>
          <Title level={5}>Result Summary:</Title>
          <Paragraph>
            Based on your answers, we suggest you explore roles in {answers[2]} and {answers[3]} fields.
          </Paragraph>
        </Space>
      </Card>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Button type="primary" size="large" onClick={handleGoHome}>
          Go to Home Page
        </Button>
      </div>
    </div>
  );
};

export default Results;

import { useState, useEffect } from "react";
import { Button, Radio, Card, Space, Typography, Divider, message } from "antd";
import questions from "../data/questions.json";  // Import the questions from JSON file
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset the answers when the page is loaded or refreshed
    setAnswers([]);
    setCurrentQuestionIndex(0);
  }, []);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      message.error("Please select an answer to proceed.");
      return;  // Prevent going to next question without selecting an answer
    }

    setAnswers([...answers, selectedAnswer]);  // Store the answer
    setSelectedAnswer(null);  // Reset selected answer

    // Move to the next question or finish quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Final page or navigate to results page
      message.success("Quiz completed! Thank you for your answers.");
      // Save answers in localStorage to pass to results page
      localStorage.setItem("userAnswers", JSON.stringify([...answers, selectedAnswer]));
      navigate("/results");
    }
  };

  return (
    <div className="p-6" style={{ maxWidth: "800px", margin: "auto", paddingTop: "40px" }}>
      <Card>
        <Title level={2} className="text-center">Personality Quiz</Title>
        <Paragraph className="text-center">
          Answer the following questions to understand your ideal job and personality traits.
        </Paragraph>
      </Card>

      <Divider />

      {/* Quiz Content */}
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={4}>{questions[currentQuestionIndex].question}</Title>
        <Radio.Group onChange={handleAnswerChange} value={selectedAnswer}>
          <Space direction="vertical">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Radio key={index} value={option}>{option}</Radio>
            ))}
          </Space>
        </Radio.Group>
        
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            onClick={handleNextQuestion}
            style={{ width: "100%" }}
          >
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;

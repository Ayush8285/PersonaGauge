import { useState, useEffect } from "react";
import { Button, Radio, Card, Space, Typography, Divider, message } from "antd";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions.json";  // Questions JSON

const { Title, Paragraph } = Typography;

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const userId = "user123"; // Replace with actual user ID (from auth)

  useEffect(() => {
    setAnswers([]); // Reset answers on page load
    setCurrentQuestionIndex(0);
  }, []);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      message.error("Please select an answer to proceed.");
      return;
    }

    setAnswers([...answers, { question: questions[currentQuestionIndex].question, answer: selectedAnswer }]);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      message.success("Quiz completed! Submitting your answers...");
      submitQuiz([...answers, { question: questions[currentQuestionIndex].question, answer: selectedAnswer }]);
    }
  };

  const submitQuiz = async (responses) => {
    try {
      const response = await fetch("http://localhost:8000/api/quiz/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, responses }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Quiz submitted successfully!", data);
        navigate("/result");
      } else {
        console.error("Error submitting quiz:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="p-6" style={{ maxWidth: "800px", margin: "auto", paddingTop: "40px" }}>
      <Card>
        <Title level={2} className="text-center">Personality Quiz</Title>
        <Paragraph className="text-center">Answer the following questions to understand your ideal job and personality traits.</Paragraph>
      </Card>

      <Divider />

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
          <Button type="primary" size="large" onClick={handleNextQuestion} style={{ width: "100%" }}>
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;

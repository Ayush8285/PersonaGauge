/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Card, Typography, Button, Divider, Space } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Using Chart.js for graph
import { Chart as ChartJS } from "chart.js/auto"; // Importing chart.js

const { Title, Paragraph } = Typography;

const Results = () => {
  const [answers, setAnswers] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [graphData, setGraphData] = useState(null);
  const navigate = useNavigate();

  // Fetch data from the backend API
  useEffect(() => {
    axios
      .get("http://localhost:8000/results/") // Replace with your backend URL
      .then((response) => {
        const data = response.data;
        setAnswers(data.quiz_answers);
        setAnalysis(data.analysis_summary);
        setGraphData(data.graph_data);
      })
      .catch((error) => {
        console.error("There was an error fetching the results!", error);
      });
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

        {/* Analysis Summary */}
        <Space direction="vertical" style={{ marginTop: "20px", width: "100%" }}>
          <Title level={5}>Result Summary:</Title>
          <Paragraph>{analysis}</Paragraph>
        </Space>

        {/* Graph Display */}
        {graphData && (
          <div style={{ marginTop: "30px" }}>
            <Title level={5}>Graphical Representation:</Title>
            <Bar
              data={{
                labels: graphData.labels,
                datasets: [
                  {
                    label: "Category Distribution",
                    data: graphData.values,
                    backgroundColor: ["#FF5733", "#33FF57", "#3357FF"],
                    borderColor: "#000",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        )}
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

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Card, Typography, Button, Divider, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Using Chart.js for graph
import { Chart as ChartJS } from "chart.js/auto"; // Importing chart.js

const { Title, Paragraph } = Typography;

const Results = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  // Fetch data from the backend API
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/ml/predict/${localStorage.getItem("user_id")}`) // backend URL
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the results!", error);
      });
  }, []);

  const handleGoHome = () => {
    navigate("/"); // Redirect to the home page
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { username, personality, job_role } = userData;

  // Prepare personality distribution data
  const personalityChartData = {
    labels: Object.keys(personality.distribution),
    datasets: [
      {
        label: "Personality Traits",
        data: Object.values(personality.distribution),
        backgroundColor: "#33FF57",
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };

  // Prepare job role distribution data
  const jobChartData = {
    labels: Object.keys(job_role.distribution),
    datasets: [
      {
        label: "Job Role Confidence",
        data: Object.values(job_role.distribution),
        backgroundColor: "#3357FF",
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6" style={{ maxWidth: "900px", margin: "auto", paddingTop: "40px" }}>
      <Card
        style={{
          borderRadius: "12px",
          padding: "5px",
          backgroundColor: "#f0f2f5", // Light background for the card
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title
          level={2}
          className="text-center"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Your Personality & Career Prediction
        </Title>
        <Divider style={{ borderColor: "#ddd" }} />

        {/* User Name & Results */}
        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={4} style={{ fontSize: "20px", fontWeight: "500" }}>
            User: <span style={{ color: "#F66666" }}>{user.name}</span>
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              fontWeight: "400",
              color: "#333",
              lineHeight: "1.8",
            }}
          >
            <strong>Predicted Personality:</strong>{" "}
            <span
              style={{
                color: "#33FF57", // Highlight personality label with green
                fontWeight: "bold",
                backgroundColor: "#D4F8E0", // Light background for contrast
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {personality.label} ({personality.confidence.toFixed(2)}%)
            </span>
          </Paragraph>
          <Paragraph
            style={{
              fontSize: "18px",
              fontWeight: "400",
              color: "#333",
              lineHeight: "1.8",
            }}
          >
            <strong>Best-Fit Job Role:</strong>{" "}
            <span
              style={{
                color: "#3357FF", // Highlight job role label with blue
                fontWeight: "bold",
                backgroundColor: "#D4E3F8", // Light background for contrast
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {job_role.label} ({job_role.confidence.toFixed(2)}%)
            </span>
          </Paragraph>
        </Space>
      </Card>

      <Divider />

      {/* Personality Chart */}
      <Card style={{ borderRadius: "10px", marginBottom: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={4}>Personality Distribution</Title>
        <Bar
          data={personalityChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                min: 0,
                max: 60,
                ticks: {
                  stepSize: 6,
                },
              },
            },
          }}
        />
      </Card>

      {/* Job Role Chart */}
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={4}>Job Role Confidence</Title>
        <Bar
          data={jobChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 10,
                },
              },
            },
          }}
        />
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

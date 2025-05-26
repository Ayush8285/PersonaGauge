
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Typography, Button, Divider, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const { Title, Paragraph } = Typography;

const AllResults = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const { user_id, cv_id, quiz_id } = useParams(); // get IDs from route
  const user = useSelector((state) => state.auth.user);
  

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/ml/predictions/${user_id}/${cv_id}/${quiz_id}/`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching prediction data!", error);
      });
      // console.log("Fetching from:", `http://127.0.0.1:8000/api/ml/predictions/${user_id}/${cv_id}/${quiz_id}/`);

  }, [user_id, cv_id, quiz_id]);

  const handleGoHome = () => {
    navigate("/");
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { personality_prediction, job_role_prediction } = userData;

  const personalityChartData = {
    labels: Object.keys(personality_prediction.distribution),
    datasets: [
      {
        label: "Personality Traits",
        data: Object.values(personality_prediction.distribution),
        backgroundColor: "#33FF57",
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };

  const jobChartData = {
    labels: Object.keys(job_role_prediction.distribution),
    datasets: [
      {
        label: "Job Role Confidence",
        data: Object.values(job_role_prediction.distribution),
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
          backgroundColor: "#f0f2f5",
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

        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={4} style={{ fontSize: "20px", fontWeight: "500" }}>
            User: <span style={{ color: "#F66666" }}>{user?.name || "User"}</span>
          </Title>

          <Paragraph style={{ fontSize: "18px", fontWeight: "400", lineHeight: "1.8" }}>
            <strong>Predicted Personality:</strong>{" "}
            <span
              style={{
                color: "#33FF57",
                fontWeight: "bold",
                backgroundColor: "#D4F8E0",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {personality_prediction.label} ({personality_prediction.confidence.toFixed(2)}%)
            </span>
          </Paragraph>

          <Paragraph style={{ fontSize: "18px", fontWeight: "400", lineHeight: "1.8" }}>
            <strong>Best-Fit Job Role:</strong>{" "}
            <span
              style={{
                color: "#3357FF",
                fontWeight: "bold",
                backgroundColor: "#D4E3F8",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {job_role_prediction.label} ({job_role_prediction.confidence.toFixed(2)}%)
            </span>
          </Paragraph>
        </Space>
      </Card>

      <Divider />

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

export default AllResults;





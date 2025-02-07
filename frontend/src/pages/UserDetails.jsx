import { useState, useEffect } from "react";
import { Card, Typography, Spin, Alert, Row, Col } from "antd";
import { useSelector } from "react-redux";

const { Title, Paragraph } = Typography;

const UserDetails = () => {
  // const [userData, setUserData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("user_id");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) throw new Error("User ID not provided.");

        // // Fetch user details (username, email)
        // const userResponse = await fetch(`http://localhost:8000/api/auth/user/details/${userId}/`);
        // if (!userResponse.ok) throw new Error("Failed to fetch user details.");
        // const userInfo = await userResponse.json();

        // setUserData(userInfo);

        // Fetch quiz answers
        const quizResponse = await fetch(`http://localhost:8000/api/quiz/get/${userId}/`);
        if (!quizResponse.ok) throw new Error("Failed to fetch quiz data.");
        const quizData = await quizResponse.json();
        setQuizData(quizData.responses);

        // Fetch CV data
        const cvResponse = await fetch(`http://localhost:8000/api/cv/get-cv/${userId}/`);
        if (!cvResponse.ok) throw new Error("Failed to fetch CV data.");
        const cvData = await cvResponse.json();
        setCvData(cvData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <Card style={{ maxWidth: "900px", margin: "auto", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      {/* User Details Section */}
      <Title level={2} className="text-center">User Details</Title>
      {user && (
        <Card style={{ marginBottom: "20px", background: "#f0f2f5" }}>
          <Paragraph><strong>Username:</strong> {user?.name}</Paragraph>
          <Paragraph><strong>Email:</strong> {user?.email}</Paragraph>
        </Card>
      )}

      {/* Two-Column Layout for CV & Quiz Data */}
      <Row gutter={24}>
        {/* CV Data Section */}
        <Col span={12}>
          <Card title="Uploaded CV" bordered={true} style={{ height: "100%" }}>
            {cvData ? (
              <Paragraph>
                <strong>Filename:</strong> {cvData.filename} <br />
                <strong>Extracted Text:</strong> {cvData.extracted_text ? cvData.extracted_text.substring(0, 300) + "..." : "No text extracted"}
              </Paragraph>
            ) : (
              <Paragraph>No CV data found.</Paragraph>
            )}
          </Card>
        </Col>

        {/* Quiz Data Section */}
        <Col span={12}>
          <Card title="Quiz Answers" bordered={true} style={{ height: "100%" }}>
            {quizData && quizData.length > 0 ? (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {quizData.map((item, index) => (
                  <li key={index} style={{ marginBottom: "15px", padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <Paragraph><strong>Q{index + 1}: </strong>{item.question}</Paragraph>
                    <Paragraph><strong>A: </strong>{item.answer}</Paragraph>
                  </li>
                ))}
              </ul>
            ) : (
              <Paragraph>No quiz data found.</Paragraph>
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default UserDetails;

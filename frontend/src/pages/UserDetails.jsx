import { useState, useEffect } from "react";
import { Card, Typography, Spin, Alert, Row, Col, Button, Modal, message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const UserDetails = () => {
  const [quizData, setQuizData] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [cvVisible, setCvVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("user_id");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) throw new Error("User ID not provided.");

        // Fetch quiz answers
        const quizResponse = await fetch(
          `http://localhost:8000/api/quiz/get/${userId}/`
        );
        if (!quizResponse.ok) throw new Error("Failed to fetch quiz data.");
        const quizData = await quizResponse.json();
        setQuizData(quizData.responses);

        // Fetch CV metadata
        const metaResponse = await fetch(
          `http://localhost:8000/api/cv/view-file-details/${userId}/`
        );
        if (!metaResponse.ok) throw new Error("Failed to fetch CV metadata.");
        const metaData = await metaResponse.json();

        // Fetch CV blob
        const cvResponse = await fetch(
          `http://localhost:8000/api/cv/get-cv/${userId}`
        );
        if (!cvResponse.ok) throw new Error("Failed to fetch CV file.");
        const blob = await cvResponse.blob();
        const fileUrl = URL.createObjectURL(blob);

        // Set both URL and filename
        setCvData({ url: fileUrl, filename: metaData.filename });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <Spin size="large" />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <Card
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Title level={2} className="text-center">
        User Details
      </Title>

      {/* User Info */}
      {user && (
        <Card style={{ marginBottom: "20px", background: "#f0f2f5" }}>
          <p>
            <strong>Username:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </Card>
      )}

      <Row gutter={24}>
        {/* CV Section */}
        <Col span={12}>
          <Card title="Uploaded CV" bordered={true} style={{ height: "100%" }}>
            {cvData ? (
              <>
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  File Name:{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {cvData.filename}
                  </span>
                </p>

                {/* Small embedded preview */}
                <div
                  onClick={() => setCvVisible(true)}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    overflow: "hidden",
                    height: "350px",
                    position: "relative",
                  }}
                >
                  <iframe
                    src={cvData.url}
                    title="CV Thumbnail"
                    width="100%"
                    height="100%"
                    style={{
                      pointerEvents: "none", // prevent iframe interaction; user clicks outer div
                      border: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.4)",
                      color: "#fff",
                      textAlign: "center",
                      padding: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Click to enlarge
                  </div>
                </div>

                {/* Modal Preview */}
                <Modal
                  open={cvVisible}
                  title="CV Preview"
                  onCancel={() => setCvVisible(false)}
                  footer={null}
                  width="50%"
                  style={{ top: 40 }}
                >
                  <iframe
                    src={cvData.url}
                    title="CV Full Preview"
                    width="100%"
                    height="500px"
                    style={{ border: "none" }}
                  />
                </Modal>
              </>
            ) : (
              <div>
                <p>No CV uploaded.</p>
                <Button type="primary" onClick={() => message.warning("Please upload your CV first.")}>
                  Upload CV
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Quiz Section */}
        <Col span={12}>
          <Card title="Quiz Answers" bordered={true} style={{ height: "100%" }}>
            {quizData && quizData.length > 0 ? (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {quizData.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <p>
                      <strong>Q{index + 1}: </strong>
                      {item.question}
                    </p>
                    <p>
                      <strong>A: </strong>
                      {item.answer}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p>No quiz data found.</p>
                <Button type="primary" onClick={() => message.warning("Please complete the quiz first.")}>
                  Complete Quiz
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Link to Results Page */}
<Row style={{ marginTop: 20 }} justify="center" align="middle" className="text-center">
  <Col span={24}>
    <Button
      type="primary"
      onClick={() => navigate("/dashboard/result")}
      disabled={!cvData || !quizData}
      style={{
        width: "200px",
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#1f2937", // Tailwind's bg-gray-900
        borderColor: "#1f2937", // Tailwind's bg-gray-900
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      {cvData && quizData ? "Go to Results" : "Please Upload CV and Answer Quiz"}
    </Button>
  </Col>
</Row>

    </Card>
  );
};

export default UserDetails;

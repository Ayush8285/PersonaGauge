import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Spin, Alert } from "antd";

const { Title, Paragraph } = Typography;

const UserDetails = () => {
  const { userId } = useParams(); // Get user ID from route params
  const [quizData, setQuizData] = useState(null);
  // const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) throw new Error("User ID not provided.");

        // Fetch quiz answers
        const quizResponse = await fetch(`http://localhost:8000/api/quiz/get/user123/`);
        if (!quizResponse.ok) {
          throw new Error(`Quiz API Error: ${quizResponse.status} ${quizResponse.statusText}`);
        }
        const quizData = await quizResponse.json();
        if (quizData.error) throw new Error(quizData.error);
        setQuizData(quizData.responses);

        // Fetch CV data
        // const cvResponse = await fetch(`http://localhost:8000/api/cv/get-cv/user123/`);
        // if (!cvResponse.ok) {
        //   throw new Error(`CV API Error: ${cvResponse.status} ${cvResponse.statusText}`);
        // }
        // const cvData = await cvResponse.json();
        // if (cvData.error) throw new Error(cvData.error);
        // setCvData(cvData);

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
    <Card style={{ maxWidth: "800px", margin: "auto", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Title level={2} className="text-center">User Details</Title>

    {/* //   {/* Display CV Data */}
    {/* //   <Title level={3}>Uploaded CV</Title>
    //   {cvData ? ( */}
    {/* //     <Paragraph>
    //       <strong>Filename:</strong> {cvData.filename} <br />
    //       <strong>Extracted Text:</strong> {cvData.extracted_text ? cvData.extracted_text.substring(0, 300) + "..." : "No text extracted"}
    //     </Paragraph>
    //   ) : (
    //     <Paragraph>No CV data found.</Paragraph>
    //   )} */} */

      {/* Display Quiz Data */}
      <Title level={3}>Quiz Answers</Title>
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
  );
};

export default UserDetails;

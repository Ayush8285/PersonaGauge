import { useState, useEffect } from "react";
import { Card, Typography, Spin, Alert, Row, Col, Button, Modal } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const UserDetails = () => {
  const [quizData, setQuizData] = useState([]);
  const [cvData, setCvData] = useState([]);
  const [cvPreview, setCvPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("user_id");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) throw new Error("User ID not provided.");

        // Fetch quiz submissions
        const quizResponse = await fetch(
          `http://localhost:8000/api/quiz/get/${userId}/`
        );
        if (!quizResponse.ok) throw new Error("Failed to fetch quiz data.");
        const quizRaw = await quizResponse.json();
        // quizRaw.submissions is an array of submissions, each has responses array
        // Reverse to get latest first
        setQuizData(quizRaw.submissions.reverse());

        // Fetch CV metadata list
        const metaResponse = await fetch(
          `http://localhost:8000/api/cv/view-file-details/${userId}/`
        );
        if (!metaResponse.ok) throw new Error("Failed to fetch CV metadata.");
        const metaList = await metaResponse.json();
        const reversedMetaList = metaList.reverse();

        // Fetch CV files (blobs) and create URLs
        const cvFiles = await Promise.all(
          reversedMetaList.map(async (meta) => {
            const response = await fetch(
              `http://localhost:8000/api/cv/get-cv/${userId}/${meta._id}`
            );
            if (!response.ok) return null;
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            return { url, filename: meta.filename, id: meta._id };
          })
        );
        setCvData(cvFiles.filter(Boolean));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="max-w-xl mx-auto mt-10"
      />
    );

  const pairedLength = Math.max(quizData.length, cvData.length);

  return (
    <Card
      style={{ maxWidth: "1000px", margin: "auto", padding: "20px" }}
      className="my-8  shadow-lg rounded-lg bg-gradient-to-r from-teal-100 via-cyan-100 to-green-100"
    >
      <Title
        level={1}
        className="text-center  mb-10 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-teal-600 to-green-700 cursor-pointer 
          hover:scale-110 transition-transform duration-300
          animate-pulse-slow"
        style={{ animationDuration: "4s" }}
      >
        User Details
      </Title>

      {/* Debug horizontal line */}
      <div className="flex justify-center my-8">
        <div className="w-full max-w-4xl h-1 bg-gradient-to-r from-teal-300 via-cyan-700 to-teal-300 rounded-full shadow-md" />
      </div>

      {user && (
        <Card
          className="mb-8 p-6 rounded-lg shadow-md bg-white hover:bg-cyan-50 transition-colors duration-300 cursor-pointer"
          onClick={() => alert(`Username: ${user.name}\nEmail: ${user.email}`)}
        >
          <p className="text-lg font-semibold text-gray-800 mb-2 hover:text-gray-900">
            Username:{" "}
            <span className="font-normal text-blue-500">{user.name}</span>
          </p>
          <p className="text-lg font-semibold text-gray-800 mb-2 hover:text-gray-900">
            Email:{" "}
            <span className="font-normal text-blue-500">{user.email}</span>
          </p>
        </Card>
      )}

      <div className=" my-8"></div>

      {pairedLength === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card
            className="bg-white border border-dashed border-teal-300 text-center p-10 rounded-lg shadow-sm"
            hoverable
          >
            <p className="text-xl text-teal-600 font-semibold">
              No CV uploaded yet
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please upload your CV to see details here.
            </p>
          </Card>
          <Card
            className="bg-white border border-dashed border-green-300 text-center p-10 rounded-lg shadow-sm"
            hoverable
          >
            <p className="text-xl text-green-600 font-semibold">
              No Quiz submitted yet
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please complete the quiz to see your answers here.
            </p>
          </Card>
        </div>
      ) : (
        Array.from({ length: pairedLength }, (_, i) => {
          const cv = cvData[i];
          const quiz = quizData[i];

          return (
            <div key={i}>
              <Card
                title={`Submission #${i + 1}`}
                bordered
                hoverable
                className="mb-6 transition-shadow duration-300 hover:shadow-xl rounded-lg"
                headStyle={{ color: "#0d9488", fontWeight: "bold" }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    {cv ? (
                      <>
                        <p className="font-semibold text-cyan-700">
                          File Name:{" "}
                          <span className="font-normal text-gray-800">
                            {cv.filename}
                          </span>
                        </p>
                        <div
                          onClick={() => setCvPreview(cv.url)}
                          className="cursor-pointer border border-teal-300 rounded-md overflow-hidden relative h-[300px] mt-2 hover:shadow-lg transition-shadow duration-300"
                          title="Click to enlarge CV preview"
                        >
                          <iframe
                            src={cv.url}
                            title={`CV Preview ${i}`}
                            width="100%"
                            height="100%"
                            style={{ pointerEvents: "none", border: "none" }}
                          />
                          <div className="absolute bottom-0 left-0 w-full bg-teal-600 bg-opacity-70 text-white text-center p-1 select-none">
                            Click to enlarge
                          </div>
                        </div>
                      </>
                    ) : (
                      <Card
                        className="mt-2 border-dashed border-2 border-teal-300 text-center p-6 rounded-lg"
                        hoverable
                      >
                        <p className="text-teal-600 font-semibold">
                          No CV uploaded for this submission.
                        </p>
                      </Card>
                    )}
                  </Col>

                  <Col span={12}>
                    {quiz ? (
                      <Card
                        type="inner"
                        title="Quiz Answers"
                        headStyle={{
                          backgroundColor: "#e0f2fe",
                          color: "#0d9488",
                        }}
                        className=" overflow-auto max-h-[335px]"
                      >
                        {quiz.responses.map((item, idx) => (
                          <div
                            key={idx}
                            className="mb-3 pb-2 border-b border-cyan-200"
                          >
                            <p className="font-semibold text-cyan-700">
                              Q{idx + 1}:{" "}
                              <span className="font-normal text-gray-800">
                                {item.question}
                              </span>
                            </p>
                            <p className="font-semibold text-cyan-700">
                              A:{" "}
                              <span className="font-normal text-gray-800">
                                {item.answer}
                              </span>
                            </p>
                          </div>
                        ))}
                      </Card>
                    ) : (
                      <Card
                        className="mt-2 border-dashed border-2 border-green-300 text-center p-6 rounded-lg"
                        hoverable
                      >
                        <p className="text-green-600 font-semibold">
                          No quiz submitted for this submission.
                        </p>
                      </Card>
                    )}
                  </Col>
                </Row>
                <Row justify="center" align="middle" className="mt-8">
                  <Col span={24} className="text-center">
                    <Button
                      type="primary"
                      onClick={() => navigate(`/dashboard/allresults/${userId}/${cv.id}/${quiz._id}`)}
                      disabled={cvData.length === 0 || quizData.length === 0}
                      className="w-48 py-2 text-lg bg-cyan-900 border-cyan-900 rounded-lg shadow-md hover:bg-cyan-800 hover:border-cyan-800"
                    >
                      {cvData.length > 0 && quizData.length > 0
                        ? "View Results"
                        : "Please Upload CV and Answer Quiz"}
                    </Button>
                  </Col>
                </Row>
              </Card>
              <div className="flex justify-center my-8"></div>
            </div>
             
          );
        })
      )}

      <Modal
        visible={!!cvPreview}
        title="CV Preview"
        footer={null}
        onCancel={() => setCvPreview(null)}
        width="80%"
        bodyStyle={{ height: "80vh" }}
        centered
      >
        <iframe
          src={cvPreview}
          title="CV Preview Modal"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </Modal>
    </Card>
  );
};

export default UserDetails;

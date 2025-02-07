/* eslint-disable no-unused-vars */
import { Button, Card, Typography, Space } from "antd";
import { UploadOutlined, QuestionCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <div>Loading...</div>; // Avoid rendering if user is null
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-teal-500 p-8 flex flex-col items-center justify-center text-center">
      {/* Hero Section */}
      <div className="mb-16 max-w-screen-lg mx-auto text-white">
        <Title level={2} className="text-4xl font-extrabold mb-4 leading-tight">
          Unlock Your True Potential with Tailored Job Recommendations
        </Title>
        <Paragraph className="text-lg mb-6">
          Whether you&apos;re a fresh graduate or looking to make a career shift, our AI-powered platform helps you find the best job roles based on your CV and personality traits.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          className="rounded-full py-2 px-8 text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          onClick={() => navigate("/uploadcv")}
        >
          Get Started
        </Button>
      </div>

      {/* Features Section */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        {/* CV Analysis Card */}
        <Card
          hoverable
          className="text-center transition-transform duration-300 transform hover:scale-105 shadow-lg w-full sm:w-80 md:w-96"
          onClick={() => navigate("/uploadcv")}
        >
          <UploadOutlined className="text-5xl text-blue-600 mb-4 transition-all duration-300" />
          <Title level={4} className="text-xl font-semibold text-gray-800">CV Analysis</Title>
          <Paragraph className="text-md text-gray-600">
            Upload your CV and let our AI extract your key skills to match the best-fit job roles in the industry.
          </Paragraph>
        </Card>

        {/* Personality Quiz Card */}
        {/* <Card
          hoverable
          className="text-center transition-transform duration-300 transform hover:scale-105 shadow-lg w-full sm:w-80 md:w-96"
        >
          <QuestionCircleOutlined className="text-5xl text-green-600 mb-4 transition-all duration-300" />
          <Title level={4} className="text-xl font-semibold text-gray-800">Personality Quiz</Title>
          <Paragraph className="text-md text-gray-600">
            Take our scientifically-designed personality quiz to discover your strengths, weaknesses, and ideal job fit.
          </Paragraph>
        </Card> */}

        {/* Career Insights Card */}
        <Card
          hoverable
          className="text-center transition-transform duration-300 transform hover:scale-105 shadow-lg w-full sm:w-80 md:w-96"
          onClick={() => navigate("/result")}
        >
          <BarChartOutlined className="text-5xl text-yellow-600 mb-4 transition-all duration-300" />
          <Title level={4} className="text-xl font-semibold text-gray-800">Career Insights</Title>
          <Paragraph className="text-md text-gray-600">
            Get personalized career suggestions based on your personality and skills, and take the next step toward a fulfilling career.
          </Paragraph>
        </Card>
      </div>

      {/* Call to Action Section */}
      <div className="text-center bg-white py-12 px-4 rounded-lg shadow-lg max-w-screen-md mx-auto mb-16">
        <Title level={3} className="text-3xl font-bold mb-4 text-gray-800">
          Ready to take the first step in your career journey?
        </Title>
        <Paragraph className="text-lg mb-6 text-gray-700">
          We’re here to help you get the right opportunities based on your skills and personality. Join thousands of users who have already unlocked their potential!
        </Paragraph>
        <Button
          type="primary"
          size="large"
          className="rounded-full py-2 px-8 text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
          onClick={() => navigate("/uploadcv")}
        >
          Start Now
        </Button>
      </div>
    </div>
  );
};

export default Home;

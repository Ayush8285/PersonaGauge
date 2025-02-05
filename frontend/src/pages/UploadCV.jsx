/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Upload, Button, message, Space, Progress, Typography, Card, Row, Col, Divider } from "antd";
import { UploadOutlined, FileDoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const UploadCV = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = () => {
    if (fileList.length === 0) {
      message.error("Please upload your CV.");
      return;
    }

    setUploading(true);
    let uploadProgress = 0;
    
    // Simulating file upload progress
    const interval = setInterval(() => {
      uploadProgress += 10;
      setProgress(uploadProgress);

      if (uploadProgress >= 100) {
        clearInterval(interval);
        message.success("CV uploaded successfully!");
        setUploading(false);
        navigate("/quiz");
      }
    }, 500); // Simulating upload progress every 500ms
  };

  const handleRemove = () => {
    setFileList([]);
  };

  return (
    <div className="p-6" style={{ maxWidth: "800px", margin: "auto", paddingTop: "40px" }}>
      {/* Hero Section */}
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={2} className="text-center">Upload Your CV</Title>
        <Paragraph className="text-center">
          Upload your CV, and then proceed to take the quiz to get tailored job suggestions based on your skills and personality.
        </Paragraph>
      </Card>

      <Divider style={{ margin: "40px 0" }} />

      {/* Upload Section */}
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Upload
          action="/upload" // Your upload endpoint
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false} // Prevent auto-upload
          accept=".pdf, .doc, .docx, .txt" // File types allowed
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} size="large" block style={{ borderRadius: "8px" }}>
            Click to Upload Your CV
          </Button>
        </Upload>

        {/* File List */}
        {fileList.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Title level={5}>Uploaded File:</Title>
            <div>
              <FileDoneOutlined style={{ marginRight: "10px" }} />
              <span>{fileList[0].name}</span>
              <Button 
                type="link" 
                onClick={handleRemove} 
                style={{ float: "right" }}
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div style={{ marginTop: "20px" }}>
            <Progress percent={progress} status="active" />
            <Space>
              <span style={{ fontSize: "14px" }}>Uploading...</span>
            </Space>
          </div>
        )}

        {/* Submit Button */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleSubmit} 
            loading={uploading}
            disabled={uploading || fileList.length === 0}
            style={{ borderRadius: "8px", width: "200px" }}
          >
            Submit CV
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UploadCV;

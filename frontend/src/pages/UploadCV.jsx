/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Upload, Button, message, Space, Progress, Typography, Card, Divider } from "antd";
import { UploadOutlined, FileDoneOutlined } from "@ant-design/icons";
import { IoDocument } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { setCvId } from "../redux/slices/cvSlice";
import axios from "axios";

const { Title, Paragraph } = Typography;

const UploadCV = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId); 
  const dispatch = useDispatch();


  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error("Please upload your CV.");
      return;
    }
  
    setUploading(true);
    setProgress(10); // Initial progress
  
    const formData = new FormData();
    formData.append("cv", fileList[0].originFileObj);
    formData.append("user_id", userId); // Include user_id in the request
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/cv/upload-cv/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          },
        }
      );
  
      if (response.status === 200) {
        message.success("CV uploaded successfully!");
        setProgress(100);
        
        // ✅ Store cvId in Redux
        dispatch(setCvId(response.data._id));

        setTimeout(() => {
          navigate("/dashboard/quiz");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.error || "Invalid CV. Please upload a proper CV.");
      } else {
        message.error("Error uploading CV. Please try again.");
      }
  
      // 🔄 Reset state on error
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setFileList([]);
      }, 1500); // Let the error message display briefly
      
    }
  };
  

  const handleRemove = () => {
    setFileList([]);
  };

  return (
    <div className="p-6" style={{ maxWidth: "800px", margin: "auto", paddingTop: "40px" }}>
      {/* Hero Section */}
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
          <IoDocument style={{ fontSize: "30px", marginRight: "8px", color: "#1890ff" }} />
          <Title level={2}>Upload Your CV</Title>
        </div>
        <Paragraph className="text-center">
          Upload your CV, and then proceed to take the quiz to get tailored job suggestions based on your skills and personality.
        </Paragraph>
      </Card>

      <Divider style={{ margin: "40px 0" }} />

      {/* Upload Section */}
      <Card style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Upload
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false} // Prevent auto-upload
          accept=".pdf, .doc, .docx, .txt"
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

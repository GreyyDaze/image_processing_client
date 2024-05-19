import React, { useState, useEffect } from "react";
import { Layout, Menu, Upload, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { SiProcessingfoundation } from "react-icons/si";
import { IoColorFilterSharp } from "react-icons/io5";
import { GiChemicalDrop } from "react-icons/gi";
import axios from "axios";
import "./App.css";

const { Title, Paragraph } = Typography;
const { Header, Content, Sider } = Layout;
const { Dragger } = Upload;

const App = () => {
  const [selectedKey, setSelectedKey] = useState("1");
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const menuItems = [
    { key: "1", label: "Lowpass Gaussian Filter" },
    { key: "2", label: "Lowpass Butterworth Filter" },
    { key: "3", label: "HighPass Laplacian Filter" },
    { key: "4", label: "Histogram Matching" },
  ];

  useEffect(() => {
    fetchProcessedImage();
  }, [selectedKey]);

  const fetchProcessedImage = () => {
    axios
      .get(`http://localhost:5000/processed_images/${selectedKey}`)
      .then((response) => {
        const { original_image, processed_image } = response.data;
        setOriginalImage(`data:image/png;base64,${original_image}`);
        setProcessedImage(`data:image/png;base64,${processed_image}`);
      })
      .catch((error) => {
        console.error("Error fetching processed image:", error);
      });
  };

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    fetchProcessedImage();
  };

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
      processImage(file);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`http://localhost:5000/process/${selectedKey}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((response) => {
        const processedImageUrl = URL.createObjectURL(response.data);
        setProcessedImage(processedImageUrl);
      })
      .catch((error) => {
        console.error("Error processing image:", error);
      });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300}>
        <Typography style={{ padding: "24px" }}>
          <Title
            level={5}
            style={{
              color: "#fff",
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SiProcessingfoundation
              style={{ marginRight: "8px", color: "darkorchid" }}
              size={20}
            />
            Image Processing Dashboard
          </Title>
        </Typography>
        <Typography
          style={{
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingTop: "2px",
          }}
        >
          <Paragraph
            style={{
              color: "#fff",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IoColorFilterSharp
              style={{ marginRight: "8px", color: "darkorchid" }}
              size={20}
            />
            Filters
          </Paragraph>
        </Typography>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            paddingLeft: "14px",
            paddingRight: "14px",
            paddingBottom: "24px",
          }}
        />
      </Sider>
      <Layout
        style={{ padding: "0 24px 10px", background: "#fff", width: "100%" }}
      >
        <Header
          style={{ background: "#fff", padding: 0, marginBottom: "10px" }}
        >
          <Typography style={{ padding: "16px", marginTop: "15px" }}>
            <Title
              level={3}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0",
              }}
            >
              <GiChemicalDrop
                style={{ marginRight: "10px", color: "darkorchid" }}
                size={30}
              />
              Creative Image Processing Lab
            </Title>
          </Typography>
        </Header>
        <Content
          style={{
            marginLeft: "16px",
            marginRight: "16px",
            marginBottom: "14px",
            marginTop: "7px",
            width: "100%",
          }}
        >
          <Dragger
            customRequest={handleUpload}
            showUploadList={false}
            style={{ marginBottom: "14px", maxWidth: "80%", minWidth: "980px" }}
            height={200}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Click to upload or drag and drop</p>
            <p className="ant-upload-hint">
              SVG, PNG, JPG or GIF (MAX. 800×400px)
            </p>
          </Dragger>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <h3 style={{ textAlign: "center" }}>Original Image</h3>
              {originalImage && (
                <img
                  src={originalImage}
                  alt="Original"
                  style={{
                    maxWidth: "100%",
                    width: "400px",
                    height: "260px",
                    borderRadius: "10px",
                    objectFit: "fill",
                  }}
                />
              )}
            </div>
            <div>
              <h3 style={{ textAlign: "center" }}>Processed Image</h3>
              {processedImage && (
                <img
                  src={processedImage}
                  alt="Processed"
                  style={{
                    maxWidth: "100%",
                    width: "400px",
                    height: "260px",
                    borderRadius: "10px",
                  }}
                />
              )}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./DocumentForm.module.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const { Option } = Select;

const DocumentForm = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    async function checkUserId() {
      const userId = await cookies.get("user-id");
      if (!userId) {
        navigate("/");
        console.log("User Id not found");
      }
    }
    checkUserId();
  }, []);

  const onFinish = async (values) => {
    const userId = await cookies.get("user-id");
    console.log(userId);
    console.log(values.title, values.category, pdfFile, coverImage);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("userId", userId);
    formData.append("category", values.category);
    formData.append("pdf", pdfFile);
    formData.append("coverImage", coverImage);

    try {
      const response = await axios.post(
        "http://macolx.com/resource-hub-server/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success(response.data.message);
      navigate("/main");
      // const interval = setInterval(() => {
      //   navigate("/main");
      //   console.log("Hello World");
      // }, 1000);
      // clearInterval(interval);
    } catch (error) {
      message.error("Error uploading files");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  const handlePdfChange = ({ file }) => {
    if (file.status === "done" || file.status === "uploading") {
      setPdfFile(file.originFileObj);
    }
  };

  const handleCoverImageChange = ({ file }) => {
    if (file.status === "done" || file.status === "uploading") {
      setCoverImage(file.originFileObj);
    }
  };

  const beforeUploadPDF = (file) => {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
      message.error("You can only upload PDF files!");
    }
    return isPDF;
  };

  const beforeUploadImage = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        name="documentForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input placeholder="Enter the document title" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select placeholder="Select a category">
            <Option value="category1">Category 1</Option>
            <Option value="category2">Category 2</Option>
            <Option value="category3">Category 3</Option>
            <Option value="category4">Category 4</Option>
            <Option value="category5">Category 5</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="pdf"
          label="Upload PDF"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
          rules={[{ required: true, message: "Please upload the PDF!" }]}
        >
          <Upload
            name="pdf"
            beforeUpload={beforeUploadPDF}
            maxCount={1}
            onChange={handlePdfChange}
            listType="text"
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
          >
            <Button icon={<UploadOutlined />}>Click to upload PDF</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="coverImage"
          label="Upload Cover Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
          rules={[
            { required: true, message: "Please upload the cover image!" },
          ]}
        >
          <Upload
            name="coverImage"
            beforeUpload={beforeUploadImage}
            maxCount={1}
            onChange={handleCoverImageChange}
            listType="picture"
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
          >
            <Button icon={<UploadOutlined />}>
              Click to upload cover image
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DocumentForm;

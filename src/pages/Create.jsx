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
    formData.append("division", values.division);
    formData.append("pdf", pdfFile);
    formData.append("coverImage", coverImage);

    try {
      const response = await axios.post(
        "https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/upload",
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
            <Option value="Policy">Policy</Option>
            <Option value="Guidelines">Guidelines</Option>
            <Option value="Strategic Plan">Strategic Plan</Option>
            <Option value="Manual">Manual</Option>
            <Option value="Financing">Financing</Option>
            <Option value="Policy & Strategy">Policy & Strategy</Option>
            <Option value="Policy & Guidelines">Policy & Guidelines</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="division"
          label="Division"
          rules={[{ required: true, message: "Please select a division!" }]}
        >
          <Select placeholder="Select a division">
            <Option value="Family Health Division">
              Family Health Division
            </Option>
            <Option value="Finance Division">Finance Division</Option>
            <Option value="Health Promotion Division">
              Health Promotion Division
            </Option>
            <Option value="Health Administration and Support Service Division">
              Health Administration and Support Service Division
            </Option>
            <Option value="Health Resource Development Division">
              Health Resource Development Division
            </Option>
            <Option value="Institution Care Division">
              Institution Care Division
            </Option>
            <Option value="Internal Audit Division">
              Internal Audit Division
            </Option>
            <Option value="Office of Director General">
              Office of Director General
            </Option>
            <Option value="Policy, Planning, Monitoring and Evaluation Divison">
              Policy, Planning, Monitoring and Evaluation Divison
            </Option>
            <Option value="Public Health Division">
              Public Health Division
            </Option>
            <Option value="Research and Development Division">
              Research and Development Division
            </Option>
            <Option value="Supplies, Stores and Drugs Management Division">
              Supplies, Stores and Drugs Management Division
            </Option>
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

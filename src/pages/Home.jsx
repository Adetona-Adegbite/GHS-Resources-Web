import React, { useEffect, useState } from "react";
import { Button, Input, Spin, Modal, Form, message } from "antd";
import styles from "./Home.module.css";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaDownLong } from "react-icons/fa6";
import Cookies from "universal-cookie";

export default function Home() {
  const cookies = new Cookies();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

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

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true);
      try {
        const response = await fetch(
          "https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/files"
        );
        const data = await response.json();
        setItems(data);
      } catch (e) {
        message.error(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  const loadMoreData = () => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setItems(items.concat(items.slice(items.length, items.length + 10)));
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredData = items.filter((item) =>
      item.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log("filtered data: ", filteredData);
    setItems(filteredData.slice(0, 10));
  };

  const showModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (modalType === "delete") {
      setLoadingDelete(true);
      try {
        await fetch(
          `https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/files/${selectedItem.id}`,
          {
            method: "DELETE",
          }
        );
        setItems(items.filter((item) => item.id !== selectedItem.id));
        message.success("Item deleted successfully");
      } catch (error) {
        message.error("Failed to delete item");
      } finally {
        setLoadingDelete(false);
        setIsModalVisible(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDownload = (item) => {
    const link = document.createElement("a");
    link.href = `https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/download/${item.file_path
      .split("/")
      .pop()}`;
    link.download = item.title;
    link.click();
  };

  const handleEdit = async (values) => {
    setLoadingUpdate(true);
    try {
      await fetch(
        `https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/files/${selectedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      setItems(
        items.map((item) =>
          item.id === selectedItem.id ? { ...item, ...values } : item
        )
      );
      message.success("Item updated successfully");
    } catch (error) {
      message.error("Failed to update item");
    } finally {
      setLoadingUpdate(false);
      setIsModalVisible(false);
    }
  };

  const loadMore =
    !loading && items.length > 0 ? (
      <div className={styles.loadMore}>
        <Button onClick={loadMoreData}>Load more</Button>
      </div>
    ) : null;

  return (
    <div className={styles.page}>
      <Input.Search
        placeholder="Search items"
        enterButton={false}
        className={styles.search}
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className={styles.list}>
        {loading ? (
          <div className={styles.loading}>
            <Spin />
          </div>
        ) : items.length > 0 ? (
          <>
            {items.map((item) => (
              <div key={item.id} className={styles.listItem}>
                <img
                  src={`https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/${item.cover_image_path}`}
                  alt={item.title}
                  className={styles.image}
                />
                <h3 className={styles.title}>{item.title}</h3>
                <div className={styles.actions}>
                  <FaDownLong onClick={() => handleDownload(item)} />
                  <MdEdit onClick={() => showModal("edit", item)} />
                  <FaRegTrashCan
                    color="red"
                    onClick={() => showModal("delete", item)}
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className={styles.noResultsFound}>No results found</p>
        )}
        {loading && (
          <div className={styles.loading}>
            <Spin />
          </div>
        )}
      </div>
      {loadMore}
      <Modal
        title={modalType === "delete" ? "Confirm Delete" : "Edit Item"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          modalType === "delete" ? (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                danger
                onClick={handleOk}
                loading={loadingDelete}
              >
                Delete
              </Button>
            </>
          ) : null
        }
      >
        {modalType === "delete" ? (
          <p>Are you sure you want to delete this item?</p>
        ) : (
          <Form
            layout="vertical"
            initialValues={selectedItem}
            onFinish={handleEdit}
          >
            <Form.Item name="title" label="Title">
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loadingUpdate}>
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}

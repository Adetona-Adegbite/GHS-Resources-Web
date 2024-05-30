import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import styles from "./Login.module.css";
import WelcomeScreenButton from "../components/WelcomeScreenButton";
import Cookies from "universal-cookie";
import image from "../assets/app-assets/Logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cookies = new Cookies();

  async function loginHandler() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:2024/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      cookies.set("user-id", JSON.stringify(data.user.id));
      navigate("/main");
    } catch (error) {
      message.error("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.page}>
        <img src={image} className={styles.logo} />

        <h1 className={styles.headerText}>Hello There 👋</h1>
        <p className={styles.descriptionText}>
          Please enter your email and password to sign in
        </p>
        <div
          className={`${styles.inputBoxContainer} ${styles.inputBoxContainerMarginTop}`}
        >
          <input
            type="email"
            id="email"
            placeholder="enter your email"
            className={styles.inputBoxInputBox}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputBoxContainer}>
          <input
            type="password"
            id="password"
            placeholder="enter password"
            className={styles.inputBoxInputBox}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <WelcomeScreenButton
          onClick={loginHandler}
          bgColor="#3BC14A"
          text={loading ? <Spin /> : "Sign In"}
          disabled={loading}
        />
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

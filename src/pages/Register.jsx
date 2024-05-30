import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import styles from "./Register.module.css";
import WelcomeScreenButton from "../components/WelcomeScreenButton";
import image from "../assets/app-assets/Logo.png";

export default function Register() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailChangeHandler = (event) => {
    setEmail(event.target.value.toLowerCase());
  };

  const emailPasswordTriggerHandler = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:2024/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      setEmailSent(true);
      message.success(
        "Email sent successfully. Check your inbox for the password."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      message.error("Unexpected error occurred: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.page}>
        <img src={image} className={styles.logo} />
        <h1 className={styles.headerText}>Create an Account 🔐</h1>
        <p className={styles.descriptionText}>
          Enter a valid email address. An email will be sent to that address
          containing your login password.
        </p>
        {emailSent ? (
          <p className={styles.confirmationText}>
            An email has been sent to your address containing your password. Use
            the password to log in with your email.
          </p>
        ) : (
          <>
            <div className={styles.inputBoxContainer}>
              <input
                type="email"
                id="email"
                className={styles.inputBoxInput}
                value={email}
                onChange={emailChangeHandler}
                placeholder="Enter valid email"
              />
            </div>
            <WelcomeScreenButton
              onClick={emailPasswordTriggerHandler}
              bgColor="#3BC14A"
              text={loading ? <Spin /> : "Create Account"}
              disabled={loading}
            />
          </>
        )}
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

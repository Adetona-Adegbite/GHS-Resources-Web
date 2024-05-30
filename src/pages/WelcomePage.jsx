import React, { useEffect } from "react";
import styles from "./WelcomePage.module.css";
import WelcomeScreenButton from "../components/WelcomeScreenButton";
import image from "../assets/app-assets/library-image.jpg";
import { useNavigate } from "react-router-dom";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  return (
    <div className={styles.screen}>
      <div className={styles.page}>
        <div className={styles.imageContainer}>
          <img className={styles.image} src={image} alt="Library" />
          <div className={styles.gradient}></div>
        </div>
        <h1 className={styles.welcomeText}>
          Welcome to
          <span className={styles.brandText}> GHS resource Hub👋</span>
        </h1>
        <p className={styles.descriptionText}>
          The GHS Resource Hub is an application designed to provide easy access
          to a wide range of resources for the staff of the Ghana Health
          Services.
        </p>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <WelcomeScreenButton
            onClick={() => navigate("/register")}
            bgColor="#3BC14A"
            text="Get Started"
          />
          <WelcomeScreenButton
            onClick={() => navigate("/login")}
            bgColor="#76787D"
            text="I already have an account"
          />
        </div>
      </div>
    </div>
  );
}

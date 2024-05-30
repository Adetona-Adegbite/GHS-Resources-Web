import React from "react";
import styles from "./WelcomeScreenButton.module.css";

export default function WelcomeScreenButton({ onClick, bgColor, text }) {
  return (
    <button
      className={styles.welcomeButton}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

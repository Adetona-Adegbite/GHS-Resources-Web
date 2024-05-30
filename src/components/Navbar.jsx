import { Link } from "react-router-dom";
import image from "../assets/app-assets/Logo.png";
import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <img src={image} />
      <Link to="/main">Dashboard</Link>
      <Link to="create">Post</Link>
    </div>
  );
}

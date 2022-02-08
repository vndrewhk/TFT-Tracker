import HeaderRoutes from "./HeaderRoutes";
import { Typography } from "@mui/material";
import styles from "./header.module.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";


const Header = () => {
  return (
    <div className={styles.header}>
      Text
      <HeaderRoutes></HeaderRoutes>
    </div>
  );
};

export default Header;

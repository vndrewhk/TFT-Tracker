import HeaderRoutes from "./HeaderRoutes";
import { Typography } from "@mui/material";
import styles from "./header.module.css";
import Link from "next/link";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <Link href="/" passHref>
        <Typography variant="h3">Home</Typography>
      </Link>
      <HeaderRoutes></HeaderRoutes>
    </div>
  );
};

export default Header;

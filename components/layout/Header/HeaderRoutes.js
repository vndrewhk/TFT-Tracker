import Button from "@mui/material/Button";
import styles from "./header-routes.module.css";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FolderIcon from "@mui/icons-material/Folder";

const HeaderRoutes = () => {
  return (
    <div>
      <Button
        sx={{
          "&:hover": {
            color: "rgb(214, 214, 214)",
            backgroundColor: "#3d9185",
          },
          color: "rgb(0,0,0)",
          fontFamily:
            'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;',
          backgroundColor: "#1ad1b9",
        }}
        variant="contained"
      >
        <FolderIcon className={styles["route-button"]} /> Portfolio
      </Button>

      <Button
        sx={{
          "&:hover": {
            color: "rgb(214, 214, 214)",
            backgroundColor: "#3d9185",
          },
          color: "rgb(0,0,0)",
          fontFamily:
            'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;',
          backgroundColor: "#1ad1b9",
        }}
        variant="contained"
      >
        <AccountCircleIcon className={styles["route-button"]} /> About Me
      </Button>

      <Button
        sx={{
          "&:hover": {
            color: "rgb(214, 214, 214)",
            backgroundColor: "#3d9185",
          },
          color: "rgb(0,0,0)",
          fontFamily:
            'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;',
          backgroundColor: "#1ad1b9",
        }}
        variant="contained"
      >
        <ConnectWithoutContactIcon className={styles["route-button"]} /> Contact
        Me
      </Button>
    </div>
  );
};

export default HeaderRoutes;

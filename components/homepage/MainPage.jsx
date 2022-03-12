import HeaderRoutes from "../layout/Header/HeaderRoutes";
import styles from "./MainPage.module.css";

const MainPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.searchBar}>
        <HeaderRoutes></HeaderRoutes>
      </div>
    </div>
  );
};

export default MainPage;

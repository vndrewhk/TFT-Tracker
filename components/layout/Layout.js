import MainNavigation from "./MainNavigation";
import HeaderRoutes from "./Header/HeaderRoutes";
import Header from "./Header/Header";

const Layout = (props) => {
  return (
    <>
      <Header></Header>

      {props.children}
    </>
  );
};

export default Layout;

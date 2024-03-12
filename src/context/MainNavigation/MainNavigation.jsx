import { useContext } from "react";
import LoginNavigation from "../../components/Screens/LoginNavigation";
import SideBarResponsable from "../../components/Screens/Responsable/SideBar/SideBarResponsable";
import { useLogin } from "../LoginPovider/LoginProvider";
import EncargadoNavigation from "../../components/Screens/Encargado/EncargadoNavigation";
import EmpleadoNavigation from "../../components/Screens/Empleado/EmpleadoNavigation";

const MainNavigation =()=>{
    const { isLoggedIn, profile } = useLogin();

  let navigationContent = <LoginNavigation />;
  console.log(isLoggedIn)
  if (isLoggedIn) {
      if (profile == "Responsable") {
          navigationContent = <SideBarResponsable />;
        }
        if (profile === "Administrador" || profile === "Encargado") {
            navigationContent = <EncargadoNavigation />;
        }
        if (profile== "Empleado") {
            navigationContent = <EmpleadoNavigation />;
        }
    }
    console.log(navigationContent)

  return navigationContent;
}

export default MainNavigation;
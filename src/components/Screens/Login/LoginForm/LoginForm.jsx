import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Button from "../../../UI/Button";
import InputText from "../../../UI/InputText";
import Popup from "../../../UI/PopUps/PopUp";
import login, { cerrarTareasYAgendas, getTokenUsuario } from "../../../../api/conections";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "../Login";
import ErrorPopup from "../../../UI/PopUps/ErrorPopUp";
import { getToken } from "../../../Notifications/Notification";
import Notification from "../../../Notifications/Notification";
import { useLogin } from "../../../../context/LoginPovider/LoginProvider";
import { Image } from "react-native-elements";


const LoginForm = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('');

  const [popupVisible, setPopupVisible] = useState(false);
  const [activityIndicatorVisible, setActivityIndicatorVisible] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const { setIsLoggedIn } = useLogin();
  const { setProfile } = useLogin();

  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closErrorPopup = () => {
    setErrorPopupVisible(false);
  }





  const verificarSesion = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const resultado = await getTokenUsuario(user.passKey);

      if (resultado.status === 200) {
        setUserName("");
        setPass("");        
        setIsLoggedIn(true);
        setProfile(user.rol);       
        //if (user.rol === "Administrador" || user.rol === "Encargado") {
          //navigation.navigate("InicioEncargado", {});
        //}

      } else {
        AsyncStorage.clear();
      }
    } catch {
      
    }
  }
  useEffect(() => {
    verificarSesion();
    verificarTokenNotificaciones();
  }, []);

  const verificarTokenNotificaciones = async () => {
    try {
      Notification();
    } catch {
    
    }
  }

  const ingresar = async () => {
    if (userName.length == 8 && userName !== "" && pass !== "") {
      try {
        setActivityIndicatorVisible(true);
        //const { cedUsuario, rol, fechaExpiracion, passKey, persona } = await login(userName, pass);

        const tokenDispositivo = await getToken();

        const respuestaLogin = await login(userName, pass, tokenDispositivo);
        if (respuestaLogin == "Primer login") {
          navigation.navigate("NewPass", {});
        }

        const user = {
          cedUsuario: respuestaLogin.cedUsuario, rol: respuestaLogin.rol,
          fechaExpiracion: respuestaLogin.fechaExpiracion, passKey: respuestaLogin.passKey, persona: respuestaLogin.persona
        };

        await AsyncStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
        setProfile(user.rol);
        if (user.rol == "Administrador" || user.rol == "Encargado") {
          cerrarTareasYAgendas(user.passKey);
        }
        //setMensaje(JSON.stringify(user.ci));
        /*if (user.rol == "Administrador" || user.rol == "Encargado") {
          navigation.navigate("InicioEncargado", {});
        } else if (user.rol == "Responsable") {
          navigation.navigate("SideBarResponsable", {});
        } else if (user.rol == "Empleado") {
          navigation.navigate("InicioEmpleado", {});
        }*/

      } catch (error) {
      
        errorPopup();
      }
      setActivityIndicatorVisible(false);
    } else {
    
      errorPopup();
    }
  };

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <Login>

      <View>
        <Image source={require('../../../Imgs/logo.jpg')}
          style={styles.logoImage} />
        <View style={{ marginVertical: 15 }}>

          <InputText
            value={userName}
            onChangeText={(userName) => setUserName(userName)}
            text={'11111111'}
            placeholder={'Usuario'}
            backgroundColor="#FFFFFF"
            textColor="#000000"
          />
          <InputText
            value={pass}
            onChangeText={(pass) => setPass(pass)}
            placeholder={'Contraseña'}
            backgroundColor="#FFFFFF"
            textColor="#000000"
            secureTextEntry={true}
          />
        </View>
        <Button
          title="Ingresar"
          onPress={ingresar}
          backgroundColor="#FC4F4F"
          textColor="#000000"
        />
        <Popup
          visible={popupVisible}
          onClose={closePopup}
          title="Atención"
          content="Debe realizar el cambio de contraseña debido a que es la primera vez que inicia sesión en la aplicación"
        />
        <ErrorPopup
          visible={errorPopupVisible}
          onClose={closErrorPopup}
          content={"Verifique datos"}
        />
        <ActivityIndicator color="#FC4F4F" animating={activityIndicatorVisible} size="large" />
      </View>
    </Login>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000000',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 20,
  },
  logoImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderBottomWidth: 4,
    borderRightWidth: 3,
    borderColor: '#666666',
    marginTop: 20
  },
});

export default LoginForm;

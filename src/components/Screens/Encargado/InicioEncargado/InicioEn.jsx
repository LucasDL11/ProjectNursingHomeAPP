import React, { useState } from "react";
import { StyleSheet, View } from 'react-native';
import ContainerView from "../../../UI/ContainerView";
import Button from "../../../UI/Button";
import Popup from "../../../UI/PopUps/PopUp";
import { useLogin } from "../../../../context/LoginPovider/LoginProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logOff } from "../../../../api/conections";
const InicioEnca = ({ navigation }) => {
  const { setIsLoggedIn, setProfile } = useLogin();
  const [popupVisible, setPopupVisible] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navegarEmpleados = () => {
    navigation.navigate('Empleados');
  };

  const navegarResidentes = () => {
    navigation.navigate('Residentes');
  };

  const navegarResponsable = () => {
    navigation.navigate('Responsables');
  };

  const navegarTareas = () => {
    navigation.navigate('MenuTareas');
  };

  const navegarAgenda = () => {
    navigation.navigate('MenuAgendas');
  };

  const navegarInsumos = () => {
    //navigation.navigate('Insumos');
  };


  const navegarSolicitudes = () => {
    navigation.navigate('MenuSolicitudes');
  };

  const navegarNotificacion = () => {
    navigation.navigate('Notificacion');

  }
  const openPopup = () => {
    setMensaje("Desea cerrar sesión?")
    setPopupVisible(true);
  };
  const onHandleCerrar = () => {
    setPopupVisible(false);
  }
  const closePopup = () => {
    cerrarSesion();
    setPopupVisible(false);
  };

  const cerrarSesion = async () => {
    setIsLoggedIn(false);
    setProfile({});
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const response = await logOff(user.passKey, user.cedUsuario);
    } catch {      
    }
    AsyncStorage.clear();    
  };

  const setOptions = () => {
    navigation.setOptions({
      AgendarVisita: { screen: 'AgendarVisita' },
      ActividadesDiarias: { screen: 'ActividadesDiarias' },
      SolicitudUsuario: { screen: 'SolicitudUsuario' },
      MisVisitas: { screen: 'MisVisitas' }
    });
  };

  return (
    <ContainerView>
      <View style={styles.container}>
        <View style={{ width: 300, height: 500, justifyContent: "space-between", marginBottom:50 }}>
        
          <Button
            title={"Empleados"}
            onPress={navegarEmpleados}
            backgroundColor="#FC4F4F"
            textColor="#000000" />


          <Button
            title={"Residentes"}
            onPress={navegarResidentes}
            backgroundColor="#FC4F4F"
            textColor="#000000" />


          <Button
            title={"Familiares"}
            onPress={navegarResponsable}
            backgroundColor="#FC4F4F"
            textColor="#000000" />


          <Button
            title={"Tareas"}
            onPress={navegarTareas}
            backgroundColor="#FC4F4F"
            textColor="#000000" />


          <Button
            title={"Agenda"}
            onPress={navegarAgenda}
            backgroundColor="#FC4F4F"
            textColor="#000000" />

{/*           <Button
            title={"Insumos (No disponible)"}
            onPress={navegarInsumos}
            backgroundColor="#FC4F4F"
            textColor="#000000" /> */}
          <Button
            title={"Solicitudes de usuario"}
            onPress={navegarSolicitudes}
            backgroundColor="#FC4F4F"
            textColor="#000000" />

          <Button
            title={"Notificar emergencia"}
            onPress={navegarNotificacion}
            backgroundColor="#FC4F4F"
            textColor="#000000" />


{/*           <Button
            title={"Salir"}
            onPress={openPopup}
            backgroundColor="#FC4F4F"
            textColor="#000000" /> */}

        </View>
      </View>
      <Popup
          visible={popupVisible}
          onClose={closePopup}
          title=""
          content={mensaje}
          b2OnClose={onHandleCerrar}
          b2Text="Rechazar"
        />
    </ContainerView>
  );
};
/*
const Button = ({ title, onPress, img }) => {
  return (
    <TouchableOpacity style={styles.boton} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
      <Image source={img} style={styles.imagen} />
    </TouchableOpacity>
  );
};
*/
const styles = StyleSheet.create({
  boton: {
    width: 325,
    height: 50,
    borderRadius: 10,
    marginVertical: 7.5,
    marginHorizontal: 10,
    backgroundColor: "rgba(252, 79, 79, 1)",
    alignItems: 'center',
  },
  imagen: {
    width: 75,
    height: 75,
    resizeMode: 'cover',
    marginRight: -50,
  },
  text: {
    color: '#000000',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    text: {
      color: '#000000',
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingBottom: 20,
    },
  },
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default InicioEnca;

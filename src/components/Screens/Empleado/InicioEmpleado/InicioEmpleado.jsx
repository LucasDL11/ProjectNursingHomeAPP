import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import ContainerView from "../../../UI/ContainerView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logOff } from "../../../../api/conections";
import Popup from "../../../UI/PopUps/PopUp";
import { useLogin } from "../../../../context/LoginPovider/LoginProvider";
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const InicioEmpleado = ({ navigation }) => {


  const [popupVisible, setPopupVisible] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const { setIsLoggedIn, setProfile } = useLogin();
  const navegarDisponibles = () => {
    navigation.navigate('Disponibles');
  };

  const navegarAsignadas = () => {
    navigation.navigate('Asignadas');
  };

  const navegarCrear = () => {
    navigation.navigate('Agregar Tarea');
  };

  const navegarAgendas = () => {
    navigation.navigate('Agendas activas');
  };
  const navegarNotificacion = () => {
    navigation.navigate('Notificación');
  };
  const openPopup = () => {
    setMensaje("¿Desea cerrar sesión?")
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
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const response = await logOff(user.passKey, user.cedUsuario);
      setIsLoggedIn(false);
      setProfile({});

      await AsyncStorage.clear();
    } catch {
    
    }    

  };

  return (
    <ContainerView>
      <View style={{ marginBottom: 50 }}>

        <ScrollView>

          <View style={[styles.container, { marginTop: 35 }]}>
            <View style={styles.lineArround}>
              <View style={styles.textContainer}>
                <Text style={styles.textContainer.text}>Tareas</Text>
              </View>
              <View style={styles.row}>
                <HalfButtons title={"Disponibles"} onPress={navegarDisponibles} />
                <HalfButtons title={"Crear"} onPress={navegarCrear} />
              </View>
              <Button title={"Asignadas"} onPress={navegarAsignadas} />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.lineArround}>
              <View style={styles.textContainer}>
                <Text style={styles.textContainer.text}>Agendas</Text>
              </View>
              <Button title={"Disponibles"} onPress={navegarAgendas} />
            </View>
          </View>
{/*           <View style={styles.container}>
            <View style={styles.lineArround}>
              <View style={styles.textContainer}>
                <Text style={styles.textContainer.text}>Actividades diarias</Text>
              </View>
              <Button title={"Actividades (no disponible)"} />
            </View>
          </View> */}
          <View style={styles.container}>
            <View style={styles.lineArround}>
              <View style={styles.textContainer}>
                <Text style={styles.textContainer.text}>Notificar Emergencia</Text>
              </View>
              <Button title={"Notificar Emergencia"} onPress={navegarNotificacion} />
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.lineArround}>
              <View style={styles.textContainer}>
                <Text style={styles.textContainer.text}>Salir</Text>
              </View>
              <Button title={"Salir"} onPress={openPopup} />
            </View>
          </View>
          <Popup
            visible={popupVisible}
            onClose={closePopup}
            title={mensaje}
            content={""}
            b2OnClose={onHandleCerrar}
            b2Text="Rechazar"
          />
        </ScrollView>
      </View>
    </ContainerView>

  );
};

const HalfButtons = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={[styles.halfBoton, { width: screenWidth * 0.4, height: screenHeight * 0.10 }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={[styles.boton, { width: screenWidth * 0.8, height: screenHeight * 0.13 }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#D21312",
    backgroundColor: "rgba(252, 79, 79, 1)",
    alignItems: 'center',
    justifyContent: "center"
  },
  halfBoton: {
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 5,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#D21312",
    backgroundColor: "rgba(252, 79, 79, 1)",
    alignItems: 'center',
    justifyContent: "center"
  },
  textContainer: { //texto de arriba a la izq
    borderWidth: 2,
    borderRadius: 20,
    padding: 3,
    position: "absolute",
    top: -33,
    left: 10,
    zIndex: 2,
    backgroundColor: "rgba(232, 175, 137,1)",
    text: {
      color: '#000000',
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  },
  text: {
    color: '#000000',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 40,
  },
  lineArround: {
    borderWidth: 2,
    borderRadius: 20,
    position: "relative",
    padding: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default InicioEmpleado;

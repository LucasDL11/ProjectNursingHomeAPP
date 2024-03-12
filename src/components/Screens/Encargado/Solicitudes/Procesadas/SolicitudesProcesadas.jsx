import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../../../UI/PopUps/PopUp";
import { getSolicitudesUsuarioPorEstado, getSolicitudesUsuarioProcesadas } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";

const SolicitudesProcesadas = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarSolicitudes();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const [popupVisible, setPopupVisible] = useState(false);
  const [descripcionSolicitud, setDescripcionSolicitud] = useState("");
  const [solicitudes, setSolicitudes] = useState([]);
  const [tituloPopUp, settituloPopUp] = useState("");
  const [mensaje, setMensaje] = useState('');
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closErrorPopup = () => {
    setErrorPopupVisible(false);
  }
  const openPopup = (descripcion) => {
    settituloPopUp("Solicitud para el residente " + descripcion?.nombresResidente + " " + descripcion?.apellidosResidente + " " + descripcion.cedResidente)
    setDescripcionSolicitud(descipcionSolicitud(descripcion));
    setPopupVisible(true);
  };

  const descipcionSolicitud = (item) => {
    return (
      <View>
        <View style={styles.datosContainer}>

          <View style={[styles.dattaContainer, { paddingRight: 15 }]}>

            <Text style={styles.boldText}>Cedula: </Text>
            <Text style={styles.boldText}>Nombre: </Text>
            <Text style={styles.boldText}>Apellido: </Text>
            <Text style={styles.boldText}>Fecha de nacimiento: </Text>
            <Text style={styles.boldText}>Telefono: </Text>
            <Text style={styles.boldText}>Domicilio: </Text>
            <Text style={styles.boldText}>Sexo: </Text>
            <Text style={styles.boldText}>Parentesco: </Text>
          </View>
          <View style={styles.dattaContainer}>
            <Text>  {item?.cedSolicitado} </Text>
            <Text>  {item?.nombres} </Text>
            <Text>  {item?.apellidos} </Text>
            <Text>  {item.fechaNacimiento?.substring(0, 10) ?? ""} </Text>
            <Text>  {item?.telefono} </Text>
            <Text>  {item?.direccion} </Text>
            <Text>  {item?.sexo} </Text>
            <Text>  {item?.nombreParentesco} </Text>
          </View>

        </View>
      </View>
    )
  }

  const closePopup = () => {
    setPopupVisible(false);
  };
  const cargarSolicitudes = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      const datos = await getSolicitudesUsuarioProcesadas(passKey);
      setSolicitudes(datos);
    } catch (error) {
      setMensaje("Error al cargar solicitudes, intente más tarde");
      errorPopup();
    }
  };
  useEffect(() => {
    cargarSolicitudes();
  }, []);


  return (
    <ContainerView>
      {solicitudes.length > 0 ?
        <View style={styles.innerContainer}>

          <FlatList refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
            data={solicitudes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.container}
                onPress={() => openPopup(item)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.text}>{item.nombres} {item.apellidos}</Text>
                  <Image source={require("../../../../Imgs/lupa.png")} style={styles.lupa} />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?.idSolicitudUsuario}
          />
        </View>
        :
        <View style={styles.container}>
          <Text style={styles.text}> Actualmente no hay solicitudes procesadas </Text>
        </View>
      }
      <Popup
        visible={popupVisible}
        onClose={closePopup}
        title={tituloPopUp}
        content={descripcionSolicitud}
      />
      <ErrorPopup
        visible={errorPopupVisible}
        onClose={closErrorPopup}
        content={mensaje}
      />
    </ContainerView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FF6666" //'#FC4F4F'
  },
  innerContainer: {
    backgroundColor: 'rgba(255,255,255, 0.60)',
    padding: 18,
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 180
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lupa: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  datosContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    height: 300,
  },
  dattaContainer: {
    alignSelf: 'stretch',
    flexDirection: "column",
    justifyContent: "space-between",
    height: 200
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 15
  },
});

export default SolicitudesProcesadas;

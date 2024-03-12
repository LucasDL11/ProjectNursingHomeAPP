import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { asignarTarea, getTareasSinAsignar } from "../../../../api/conections";
import Popup from "../../../UI/PopUps/PopUp";
import ContainerView from "../../../UI/ContainerView";
import ErrorPopup from "../../../UI/PopUps/ErrorPopUp";
import dividirFechaYHora, { formatoCedula } from "../../../UI/Utils/utils";

const screenHeight = Dimensions.get('window').height;
const lineSize = screenHeight * 0.1;

const Disponibles = () => {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarTareas();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const [popupVisible, setPopupVisible] = useState(false);

  const [tareas, setTareas] = useState([]);
  const [popupMsjVisible, setPopupMsjVisible] = useState(false);
  const [tituloPopUp, settituloPopUp] = useState("");
  const [contentPopUp, setContentPopUp] = useState("");
  const [tareaSeleccionada, setTareaSeleccionada] = useState([]);


  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [Mensaje, setMensaje] = useState('')

  const openPopup = (item) => {

    settituloPopUp(item?.nombreTarea);
    setContentPopUp(descipcionDeTarea(item));
    setTareaSeleccionada(item);
    setPopupVisible(true);

  };
  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closeErrorPopup = () => {
    setErrorPopupVisible(false);
  }
  const closePopup = () => {

    setPopupVisible(false);
  };

  const closePopupMsj = () => {
    setPopupMsjVisible(false);
  }


  const descipcionDeTarea = (item) => {
    
    return (
      <View style={styles.popupcontainer}>

        <Text style={styles.subtitle.text}>Descipción: </Text>
        <Text >{item.descripcion}</Text>
        {item.cedulaResidente && (
          <View>
            <Text style={styles.subtitle.text}>Residente relacionado: </Text>
            <Text>{item.nombresResidente} {item.apellidosResidente}</Text>
          </View>
        )}

      </View>
    );
  };

  const cargarTareas = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      await getTareasSinAsignar(passKey, "Empleado")
        .then(datos => {          
          const orderDatta = datos.slice().sort((a, b) => new Date(a.diaDeTarea) - new Date(b.diaDeTarea));
          setTareas(orderDatta);
        });
    } catch (error) {
      setMensaje("Error al listar tareas, intentelo más tarde");
      errorPopup();
    }
  };
  useEffect(() => {
    cargarTareas();
  }, []);

  const tareaAsignar = async () => {

    const userString = await AsyncStorage.getItem("user");
    const user = JSON.parse(userString);
    const ced = user.cedUsuario;
    const passKey = user.passKey;

    if (tareaSeleccionada != []) {
      asignarTarea(passKey, ced, tareaSeleccionada.idTarea)
        .then(datos => {
          if (datos.status === 200) {
            setMensaje("Tarea asignada correctamente");
            const nuevasTareas = tareas.filter(o => o.idTarea !== tareaSeleccionada.idTarea)
            setTareas(nuevasTareas);
            closePopup();
            setPopupMsjVisible(true);
          } else {
            setMensaje("Algo ha salido mal, intentelo más tarde");
            errorPopup();
          }
        })
    } else {
      setMensaje("Algo ha salido mal, intentelo más tarde");
      errorPopup();
    }

  }




  return (
    <ContainerView>
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>

        <View style={[styles.innerContainer, { marginBottom: lineSize }]}>
          {tareas.length > 0 ? <FlatList refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
            data={tareas}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.container}
                onPress={() => openPopup(item)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.text}>{dividirFechaYHora(item?.diaDeTarea)?.hora} - {item.nombreTarea}</Text>
                  {/* <Text style={styles.text}></Text> */}
                  <Image source={require("../../../Imgs/lupa.png")} style={styles.lupa} />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?.idTarea}
          />

            :
            <View style={styles.container}>
              <Text style={styles.text}> Actualmente no hay tareas disponibles </Text>
            </View>
          }


          <Popup
            visible={popupVisible}
            onClose={tareaAsignar}
            bText={' Asignarme '}
            title={tituloPopUp}
            content={contentPopUp}
            b2OnClose={closePopup}
            b2Text={'Cerrar'}
          />

          <Popup
            visible={popupMsjVisible}
            onClose={closePopupMsj}
            title=""
            content={Mensaje}
          />
          <ErrorPopup
            visible={errorPopupVisible}
            onClose={closeErrorPopup}
            content={Mensaje}
          />
        </View>
      </View>
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
    backgroundColor: 'rgba(255, 255, 255,0.7)',
    padding: 18,
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 180
  },
  title: {
    text: {
      paddingTop: 10,
      color: '#000000',
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingBottom: 20,
    },
  },
  subtitle: {
    text: {
      paddingTop: 10,
      color: '#000000',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'left',
      paddingBottom: 20,
    },
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dates: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: 60,
    paddingBottom: 10,
    paddingTop: 20
  },
  imagen: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    marginRight: -50,
  },
  lupa: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  popupcontainer: {
    paddingTop: 10,
    width: 350,
    marginBottom: 10,
  }
});

export default Disponibles;

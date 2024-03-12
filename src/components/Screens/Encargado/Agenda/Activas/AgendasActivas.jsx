import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../../../UI/PopUps/PopUp";
import { getAgendasPorEstado } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import dividirFechaYHora, { formatoCedula } from "../../../../UI/Utils/utils";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";

const AgendasActivas = () => {
  const [descripcionAgenda, setDescripcionAgenda] = useState("");
  const [agendas, setAgendas] = useState([]);
  const [tituloPopUp, settituloPopUp] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarAgendas();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const openPopup = (descripcion) => {
    settituloPopUp(descripcion.nombreResidente + " - " + formatoCedula(descripcion.cedResidente))
    setDescripcionAgenda(descipcionAgenda(descripcion));
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };
  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closeErrorPopup = () => {
    setErrorPopupVisible(false);
  }
  const descipcionAgenda = (item) => {
    return (
      <View style={styles.popupcontainer}>
        <Text>{dividirFechaYHora(item?.fechaYHora)?.fecha} / {dividirFechaYHora(item?.fechaYHora)?.hora}hs</Text>
        <Text style={styles.subtitle}>Motivo de visita:</Text>

        <Text>{item?.motivoDeVisita}</Text>

        {item.visitantesAgenda && item.visitantesAgenda.length > 0 && (
          <View>
            <Text style={styles.subtitle} >Visitantes:</Text>
            {item.visitantesAgenda.map((visitante, index) => (
              <Text key={index}>{visitante.nombres} {visitante.apellidos}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const cargarAgendas = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      const datos = await getAgendasPorEstado(passKey, "Aprobada");
      const orderDatta = datos.slice().sort((a,b)=> new Date(a.fechaYHora)-new Date(b.fechaYHora));
      setAgendas(orderDatta);
    } catch (error) {
      setMensaje("Error al cargar agendas, intentelo más tarde");
      errorPopup();
    }
  };
  useEffect(() => {
    cargarAgendas();
  }, []);


  return (
    <ContainerView>
      <View style={{flex:1, justifyContent:'flex-start'}}>
        {agendas.length > 0 ?

      <View style={[styles.innerContainer]}>
          <FlatList refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
            data={agendas}
            renderItem={({ item }) => (
              <TouchableOpacity
              style={styles.container}
                onPress={() => openPopup(item)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                  <Text style={styles.text}>{dividirFechaYHora(item?.fechaYHora)?.hora}</Text>
                  <Text style={styles.text}>{item.apellidoResidente}</Text>

                  <Image source={require("../../../../Imgs/lupa.png")} style={styles.lupa} />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?.idAgenda}
            />
        </View>
          :
          <View style={styles.container}>
            <Text style={styles.text}> Actualmente no hay agendas disponibles </Text>
          </View>
        }
        <Popup
          visible={popupVisible}
          onClose={closePopup}
          title={tituloPopUp}
          content={descripcionAgenda}
          outClose={true}
        />
        <ErrorPopup
          visible={errorPopupVisible}
          onClose={closeErrorPopup}
          content={mensaje}
          />

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
    backgroundColor: 'rgba(255,255,255, 0.60)',
    padding: 18,
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 50
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
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: 'bold',
    paddingTop: 7,
    fontSize: 18,
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

export default AgendasActivas;

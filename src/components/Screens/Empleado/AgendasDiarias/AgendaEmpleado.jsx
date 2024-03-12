import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../../UI/PopUps/PopUp";
import { finalizarAgenda, getAgendasDelDia, getAgendasPorEstado } from "../../../../api/conections";
import ContainerView from "../../../UI/ContainerView";
import dividirFechaYHora, { formatoCedula } from "../../../UI/Utils/utils";
import TextArea from "../../../UI/TextArea";
import { CheckBox } from 'react-native-elements';
import ErrorPopup from "../../../UI/PopUps/ErrorPopUp";


const AgendasEmpleado = () => {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarAgendas();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMsjVisible, setPopupMsjVisible] = useState(false);
  const [popupObsVisible, setPopupObsVisible] = useState(false);
  const [descripcionAgenda, setDescripcionAgenda] = useState("");
  const [agendas, setAgendas] = useState([]);
  const [tituloPopUp, settituloPopUp] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [agendaAAprobar, setAgendaAAprobar] = useState('');
  const [visitado, setVisitado] = useState(false);

  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const openPopup = (item) => {
    settituloPopUp("Visita a" + "\n" + item.nombreResidente + " " + item.apellidoResidente)
    setDescripcionAgenda(descipcionAgenda(item));
    setAgendaAAprobar(item.idAgenda);
    setPopupVisible(true);
  };
  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closErrorPopup = () => {
    setErrorPopupVisible(false);
  }

  const closePopup = () => {
    setDescripcionAgenda('');
    setPopupVisible(false);
  };

  const closeMsjPopup = () => {

    setPopupMsjVisible(false);
  };

  const openObsPopup = () => {

    closePopup();
    settituloPopUp('Concluir visita');
    setObservaciones('');
    setPopupObsVisible(true);
  }

  const closeObsPopup = () => {
    setPopupObsVisible(false);

  };

  const handleVisitado = () => {
    setVisitado(!visitado); // Cambiar el estado a lo opuesto del estado actual
  };
  const terminarAgenda = async () => {

    //-----------------> lógica para enviar la observacion y terminar la agenda
    //                      (poné validaciones y si podes un mensajito)
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      if (agendaAAprobar != 0 && observaciones != '') {
        const datos = await finalizarAgenda(passKey, ced, agendaAAprobar, observaciones, visitado);
        if (datos.status === 200) {
          closeObsPopup();
          closePopup();
          const nuevasAgendas = agendas.filter(o => o.idAgenda !== agendaAAprobar)
          setAgendas(nuevasAgendas);
          setMensaje('Agenda terminada con exito');
          setPopupMsjVisible(true);
          //cargarAgendas();
        } else {
          setMensaje('Ocurrió un error intente más tarde')
          errorPopup();
        }
      } else {
        setMensaje('Verifique datos')
        errorPopup();
      }
    } catch (error) {
      setMensaje('Ocurrió un error intente más tarde')
      errorPopup();
    }
  }

  const descipcionAgenda = (item) => {
    return (
      <View style={styles.popupcontainer}>
        <Text style={styles.subtitle}>{dividirFechaYHora(item?.fechaYHora)?.fecha} / {dividirFechaYHora(item?.fechaYHora)?.hora}hs</Text>
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
      const datos = await getAgendasDelDia(passKey);      
      const orderDatta = datos.slice().sort((a, b) => new Date(a.fechaYHora) - new Date(b.fechaYHora));
      setAgendas(orderDatta);
    } catch (error) {
      setMensaje('Verifique datos')
      errorPopup();
    }
  };
  useEffect(() => {
    cargarAgendas();
  }, []);


  return (
    <ContainerView>
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>

        <View style={styles.innerContainer}>
          {agendas.length > 0 ?
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
                    <Text style={styles.text}>{dividirFechaYHora(item?.fechaYHora)?.hora}hs - {item.apellidoResidente}</Text>
                    <Text style={styles.text}></Text>
                    <Image source={require("../../../Imgs/lupa.png")} style={styles.lupa} />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item?.idAgenda}
            />
            :
            <View style={styles.container}>
              <Text style={styles.text}> Actualmente no hay agendas disponibles </Text>
            </View>
          }

          <Popup
            visible={popupVisible}
            onClose={closePopup}
            bText={' Cerrar '}
            title={tituloPopUp}
            content={descripcionAgenda}
            b2OnClose={openObsPopup}
            b2Text={'Culminar'}
          />

          <Popup
            visible={popupObsVisible}
            onClose={closeObsPopup}
            bText={' Cancelar '}
            title={tituloPopUp}
            component={
              <View>
                <TextArea
                  placeholder={"Indique observaciones de la visita....."}
                  textColor="#000000"
                  backgroundColor="#FFFFFF"
                  value={observaciones}
                  onChangeText={(obs) => setObservaciones(obs)}
                  numeroDeLineas={8}
                />
                <View style={{ paddingBottom: 15, paddingTop: 20 }}>

                  <CheckBox
                    title="Visitado"
                    checked={visitado}
                    onPress={handleVisitado}
                    uncheckedColor="#000000"
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderWidth: 0 }}
                    textStyle={{ fontSize: 16, color: "#000000" }}
                  />

                </View>
              </View>}
            b2OnClose={terminarAgenda}
            b2Text={'Culminar'}
          />
          <Popup
            visible={popupMsjVisible}
            onClose={closeMsjPopup}
            title=""
            content={mensaje}
          />
        </View>

        <ErrorPopup
          visible={errorPopupVisible}
          onClose={closErrorPopup}
          content={mensaje}
        />
      </View>
    </ContainerView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#FF6666" //'#FC4F4F'
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255,0.7)',
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: 'bold',
    paddingTop: 7,
    fontSize: 18,
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

export default AgendasEmpleado;

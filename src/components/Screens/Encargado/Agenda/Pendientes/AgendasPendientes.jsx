import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../../../UI/PopUps/PopUp";
import { getAgendasPorEstado, EvaluarAgenda } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import dividirFechaYHora from "../../../../UI/Utils/utils";
import TextArea from "../../../../UI/TextArea";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";


const AgendasPendientes = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupRechazoVisible, setRechazoPopupVisible] = useState(false);
  const [descripcionAgenda, setDescripcionAgenda] = useState("");
  const [tituloAgenda, setTituloAgenda] = useState("");
  const [agendas, setAgendas] = useState([]);
  const [agendaAAprobar, setAgendaAAprobar] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [normalPopUpVisible, setNormalPopUpVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarAgendas();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  const primerPalabra = (palabra) => {
    const partes = palabra.split(" ");
    return partes[0];
  }

  const openPopup = (item) => {
    setDescripcionAgenda(descipcionAgenda(item));
    setTituloAgenda("Visita a " + item.nombreResidente + " " + item.apellidoResidente)
    setAgendaAAprobar(item.idAgenda);
    setPopupVisible(true);
  };

  const openRechazarPopUp = () => {
    setDescripcionAgenda('');
    setRechazoPopupVisible(true);
  }
  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closErrorPopup = () => {
    setErrorPopupVisible(false);
  }

  const openNormalPopUp = () => {
    setNormalPopUpVisible(true);
  }
  const closeNormalPopUp = () => {
    setNormalPopUpVisible(false);
    setMensaje('');
    setAgendaAAprobar('');
    canceloPop();
    setMotivoRechazo('');
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
        )
        }
      </View>
    )
  }

  const canceloPop = () => {
    setPopupVisible(false);
    setRechazoPopupVisible(false);
  }

  const closePopup = () => {
    aprobarAgenda();
    setAgendaAAprobar('');
    setPopupVisible(false);
  };

  const onHandleRechazar = () => {
    rechazarAgenda();
    setPopupVisible(false);
  }

  useEffect(() => {
    cargarAgendas();
  }, []);

  const cargarAgendas = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      const datos = await getAgendasPorEstado(passKey, "Pendiente de Aprobación");
      const orderDatta = datos.slice().sort((a,b)=> new Date(a.fechaYHora)-new Date(b.fechaYHora));
      setAgendas(orderDatta);
    } catch (error) {
      setMensaje("Error al cargar agendas, intentelo más tarde");
      errorPopup();
    }
  };
  const aprobarAgenda = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      if (agendaAAprobar !== 0 && agendaAAprobar !== '') {
        const datos = await EvaluarAgenda(passKey, agendaAAprobar, "Aprobada", "Aprobar");
        if (datos.status === 200) {
          const agendasFiltradas = agendas.filter(o => o.idAgenda !== agendaAAprobar)
          setAgendas(agendasFiltradas);
          setMensaje("Agenda aprobada con éxito");
          openNormalPopUp();
        } else {
          setMensaje("Error al aprobar agenda");
          errorPopup();
        }
      } else {
        setMensaje("Verifique datos");
        errorPopup();
      }

    } catch (error) {
      setMensaje("Error al intentar aprobar agenda");
      errorPopup();
    }
  };

  const rechazarAgenda = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      if (agendaAAprobar !== 0 && agendaAAprobar !== '' && motivoRechazo !== '') {
        const datos = await EvaluarAgenda(passKey, agendaAAprobar, "Rechazada", motivoRechazo);
        if (datos.status === 200) {
          const agendasFiltradas = agendas.filter(o => o.idAgenda !== agendaAAprobar)
          setAgendas(agendasFiltradas);
          setMensaje("Agenda rechazada con éxito");
          openNormalPopUp();
        } else {
          setMensaje("Error al rechazar agenda");
          errorPopup();
        }
      } else {
        setMensaje("Verifique datos");
        errorPopup();
      }
    } catch (error) {
      setMensaje("Error al rechazar agenda");
      errorPopup();
    }
  };

  return (
    <ContainerView >

      {agendas.length > 0 ?
        <View style={styles.innerContainer}>

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
                  <Text style={styles.text}>{dividirFechaYHora(item?.fechaYHora)?.fecha} / {dividirFechaYHora(item?.fechaYHora)?.hora}hs</Text>
                  <Text style={styles.text}>{primerPalabra(item?.apellidoResidente)}</Text>
                  <Image source={require("../../../../Imgs/lupa.png")} style={styles.lupa} />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?.idAgenda}
          />
        </View>
        :
        <View style={styles.container}>
          <Text style={styles.text}> Actualmente no hay agendas pendientes </Text>
        </View>
      }
      <Popup
        visible={popupVisible}
        onClose={closePopup}
        title={tituloAgenda}
        content={descripcionAgenda}
        b2OnClose={openRechazarPopUp}
        b2Text="Rechazar"
      />
      <Popup
        visible={popupRechazoVisible}
        bText="Cancelar"
        onClose={canceloPop}
        title={tituloAgenda}
        component={
          <View>
            <TextArea
              placeholder={"Indique motivo de Rechazo....."}
              textColor="#000000"
              backgroundColor="#FFFFFF"
              value={motivoRechazo}
              onChangeText={(motivoRechazo) => setMotivoRechazo(motivoRechazo)}
              numeroDeLineas={5}
            />
          </View>}
        b2OnClose={onHandleRechazar}
        b2Text="Rechazar"
      />
      <ErrorPopup
        visible={errorPopupVisible}
        onClose={closErrorPopup}
        content={mensaje}
      />

      <Popup
        visible={normalPopUpVisible}
        onClose={closeNormalPopUp}
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
    marginTop: 5,
    marginBottom: 50
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
  dates: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: 60,
    paddingBottom: 10,
    paddingTop: 20
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

export default AgendasPendientes;

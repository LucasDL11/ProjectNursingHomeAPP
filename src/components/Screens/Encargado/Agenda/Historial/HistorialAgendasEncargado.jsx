import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../../../UI/PopUps/PopUp";
import { getAgendasEntreFechas } from "../../../../../api/conections";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ContainerView from "../../../../UI/ContainerView";
import dividirFechaYHora, { formatoCedula } from "../../../../UI/Utils/utils";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";

const HistorialAgendasEncargado = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [descripcionAgenda, setDescripcionAgenda] = useState("");
  const [tituloPopUp, settituloPopUp] = useState("");
  const [agendas, setAgendas] = useState([]);
  const [isDateTimePickerDesdeVisible, setIsDateTimePickerDesdeVisible] = useState(false);
  const [isDateTimePickerHastaVisible, setIsDateTimePickerHastaVisible] = useState(false);
  const [selectedDateDesde, setSelectedDateDesde] = useState(null);
  const [selectedDateHasta, setSelectedDateHasta] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const compareDates = (dateString) => {
    const providedDate = new Date(dateString);
    const currentDate = new Date();

    if (providedDate < currentDate) {
      return false;
    } else {
      return true;
    }
  };
  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closeErrorPopup = () => {
    setErrorPopupVisible(false);
  }
  const openPopup = (descripcion) => {
    settituloPopUp(descripcion.nombreResidente + " - " + formatoCedula(descripcion.cedResidente))

    setDescripcionAgenda(handleDescripcion(descripcion));
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleDescripcion = (item) => {

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
        {item?.observacion && (
          <View>
            <Text style={styles.subtitle} >Observaciones:</Text>
            <Text>{item.observacion}</Text>
          </View>
        )}
        {item?.cedPersonal && (
          <View>
            <Text style={styles.subtitle} >Personal a cargo:</Text>
            <Text>{item.cedPersonal}</Text>
          </View>
        )}
      </View>
    )
  }

  useEffect(() => {
    const cargarAgendas = async () => {
      if (selectedDateDesde && selectedDateHasta) {
        try {
          const userString = await AsyncStorage.getItem("user");
          const user = JSON.parse(userString);
          const ced = user.cedUsuario;
          const passKey = user.passKey;

          const dateDesde = dividirFechaYHora(selectedDateDesde.toISOString()).fecha;
          const dateHasta = dividirFechaYHora(selectedDateHasta.toISOString()).fecha;
          const datos = await getAgendasEntreFechas(passKey, dateDesde, dateHasta);
          const orderDatta = datos.slice().sort((a, b) => new Date(a.fechaYHora) - new Date(b.fechaYHora));
          setAgendas(orderDatta);
        } catch (error) {
          setMensaje("Error al cargar agendas, intentelo más tarde");
          errorPopup();
        }
      } else {
        setAgendas([]);
      }
    };

    cargarAgendas();
  }, [selectedDateDesde, selectedDateHasta]);

  const showDateTimePickerDesde = () => {
    setIsDateTimePickerDesdeVisible(true);
  };

  const showDateTimePickerHasta = () => {
    setIsDateTimePickerHastaVisible(true);
  };

  const hideDateTimePickerDesde = () => {
    setIsDateTimePickerDesdeVisible(false);
  };

  const hideDateTimePickerHasta = () => {
    setIsDateTimePickerHastaVisible(false);
  };

  const selectDateDesde = (date) => {
    setSelectedDateDesde(date);
    hideDateTimePickerDesde();
  };

  const selectDateHasta = (date) => {
    setSelectedDateHasta(date);
    hideDateTimePickerHasta();
  };

  return (
    <ContainerView>


      <View style={styles.dates}>

        <View style={{ flexDirection: "column" }}>

          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 30 }}>Fecha desde:</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Fecha hasta:</Text>

        </View>

        <View style={{ flexDirection: "column", paddingRight: 60 }}>

          <TouchableOpacity onPress={showDateTimePickerDesde} style={{ marginBottom: 20 }}>
            <Image source={require("../../../../Imgs/calendario2.png")} style={styles.imagen} />
          </TouchableOpacity>

          <TouchableOpacity onPress={showDateTimePickerHasta}>
            <Image source={require("../../../../Imgs/calendario2.png")} style={styles.imagen} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "column" }}>

          <Text style={{ fontSize: 20, marginBottom: 30 }}>
            {selectedDateDesde ? dividirFechaYHora(selectedDateDesde.toISOString()).fecha : ''}
          </Text>
          <Text style={{ fontSize: 20 }}>
            {selectedDateHasta ? dividirFechaYHora(selectedDateHasta.toISOString()).fecha : ''}
          </Text>


        </View>

      </View>


      {(selectedDateDesde && selectedDateHasta) ? (
        <View style={styles.innerContainer}>

          <FlatList
            data={agendas}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.container}
                onPress={() => openPopup(item)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.text}>{dividirFechaYHora(item?.fechaYHora)?.fecha} | {item.nombreResidente} </Text>

                  <Image source={require("../../../../Imgs/lupa.png")} style={styles.lupa} />
                </View>
                <Text
                  style={[
                    (item?.visitado === false || item?.visitado == null) && compareDates(item?.fechaYHora) ?
                      styles.estado.pendiente
                      : item.visitado === true && !compareDates(item?.fechaYHora) ?
                        styles.estado.realizada : styles.estado.incumplida,
                  ]}
                >
                  {(item?.visitado === false || item?.visitado == null) && compareDates(item?.fechaYHora) ?
                    "Pendiente" :
                    item.visitado === true && !compareDates(item?.fechaYHora) ?
                      "Realizada" : "Incumplida"
                  }
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?.idAgenda}
          />
        </View>
      ) : <View style={{ height: 400 }}></View>}

      <Popup
        visible={popupVisible}
        onClose={closePopup}
        title={tituloPopUp}
        content={descripcionAgenda}
      />
      <DateTimePickerModal
        isVisible={isDateTimePickerDesdeVisible}
        mode="date"
        onConfirm={selectDateDesde}
        onCancel={hideDateTimePickerDesde}
      />
      <DateTimePickerModal
        isVisible={isDateTimePickerHastaVisible}
        mode="date"
        onConfirm={selectDateHasta}
        onCancel={hideDateTimePickerHasta}
      />
      <ErrorPopup
        visible={errorPopupVisible}
        onClose={closeErrorPopup}
        content={mensaje}
      />
    </ContainerView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#FF6666", //'#FC4F4F'
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "#D21312"
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
  dates: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingBottom: 10,
    marginTop: 150,
    backgroundColor: 'rgba(255, 255, 255,0.7)',
    borderRadius: 15
  },
  imagen: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    marginRight: -50,
  },
  lupa: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255,0.7)',
    padding: 18,
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 180
  },
  estado: {
    realizada: {
      color: '#CCEEBC',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    incumplida: {
      color: '#7E1717',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      textShadowColor: "#000000",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 2,
    },
    pendiente: {
      color: '#DFEC12',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    }
  },
  popupcontainer: {
    paddingTop: 10,
    width: 350,
    marginBottom: 10,
  },
  subtitle: {
    fontWeight: 'bold',
    paddingTop: 7,
    fontSize: 18,
  },
}
);

export default HistorialAgendasEncargado;

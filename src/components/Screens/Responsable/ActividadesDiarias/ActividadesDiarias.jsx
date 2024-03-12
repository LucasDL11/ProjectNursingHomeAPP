import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../../UI/PopUps/PopUp";
import { getActividadesDiariasByResponsable, getActividadesDiariasByFechaYResponsable } from "../../../../api/conections";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ContainerView from "../../../UI/ContainerView";
import ErrorPopup from "../../../UI/PopUps/ErrorPopUp";
import dividirFechaYHora from "../../../UI/Utils/utils";

const screenHeight = Dimensions.get('window').height;
const lineSize = screenHeight * 0.1;

const ActDiarias = () => {
  const [mensaje, setMensaje] = useState('');
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closeErrorPopup = () => {
    setErrorPopupVisible(false);
  }
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarActividades();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const [popupVisible, setPopupVisible] = useState(false);
  const [descripcionActividad, setDescripcionActividad] = useState("");
  const [actividades, setActividades] = useState([]);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);



  const currentDate = new Date();
  const formattedDate = dividirFechaYHora(currentDate.toISOString()).fecha;

  const openPopup = (descripcion) => {
    setDescripcionActividad(descripcion);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };
  const cargarActividades = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      if (selectedDate) {
        const date = dividirFechaYHora(selectedDate.toISOString()).fecha;
        const datos = await getActividadesDiariasByFechaYResponsable(passKey, ced, date);
        const orderDatta = datos.slice().sort((a, b) => new Date(a.fechaActividad) - new Date(b.fechaActividad));
        setActividades(orderDatta);
      } else {
        const datos = await getActividadesDiariasByResponsable(passKey, ced);
        setActividades(datos);
      }
    } catch (error) {
      setMensaje("Error al cargar actividades, intente más tarde");
      errorPopup();
    }
  };
  useEffect(() => {
    cargarActividades();
  }, [selectedDate]);

  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    hideDateTimePicker();
  };

  return (
    <ContainerView style={{ marginBottom: lineSize }}>

      <View style={{flex: 1, justifyContent: 'flex-start'}}>

      <View style={styles.dates}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}> Fecha: </Text>
          <Text style={{ fontSize: 20 }}>
            {selectedDate ? dividirFechaYHora(selectedDate.toISOString()).fecha : formattedDate}
          </Text>
        </View>
        <TouchableOpacity style={{ flexDirection: "row" }} onPress={showDateTimePicker}>
          <Image source={require("../../../Imgs/calendario2.png")} style={styles.imagen} />
        </TouchableOpacity>
      </View>
      {actividades.length > 0 ?
      <View style={styles.innerContainer}>
        <FlatList refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={actividades}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={styles.container}
          onPress={() => openPopup(item.descripcionActividad)}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.text}>{item.nombreActividad}</Text>
                <Text style={styles.text}>{dividirFechaYHora(item.fechaActividad).hora}</Text>
                <Image source={require("../../../Imgs/lupa.png")} style={styles.lupa} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.idTarea}
          />
      </View>
          :
          <View style={[styles.container, { marginTop: 5 }]}>
          <Text style={styles.text}> No hay actividades para mostrar </Text>
        </View>
      }
      <Popup
        visible={popupVisible}
        onClose={closePopup}
        title=""
        content={descripcionActividad}
        backColor={'rgba(255, 255, 255,0.8)'}
        />
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="date"
        onConfirm={selectDate}
        onCancel={hideDateTimePicker}
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
    backgroundColor: 'rgba(255, 255, 255,0.7)',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 120
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
});

export default ActDiarias;

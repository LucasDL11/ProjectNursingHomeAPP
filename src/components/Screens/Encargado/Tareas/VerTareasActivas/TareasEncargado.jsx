import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTareasByFecha, getTareasSinAsignar } from "../../../../../api/conections";
import Popup from "../../../../UI/PopUps/PopUp";
import ContainerView from "../../../../UI/ContainerView";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dividirFechaYHora, { formatoCedula } from "../../../../UI/Utils/utils";

const screenHeight = Dimensions.get('window').height;
const lineSize = screenHeight * 0.1;


const TareasEncargado = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    cargarTareas();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const [popupVisible, setPopupVisible] = useState(false);
  const [descripcionTarea, setDescripcionTarea] = useState("");
  const [tareas, setTareas] = useState([]);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());



  const currentDate = new Date();
  const formattedDate = dividirFechaYHora(currentDate.toISOString()).fecha;


  const descipcionDeTarea = (item) => {
    return (
      <View style={styles.popupcontainer}>
        <Text>Creada: {dividirFechaYHora(item?.diaDeTarea)?.fecha} / {dividirFechaYHora(item?.diaDeTarea)?.hora}hs</Text>
        <Text style={styles.subtitle}>Tarea:</Text>
        <Text>{item?.nombreTarea}</Text>
        {item.fin && (
          <View>
            <Text style={styles.subtitle}>Culminada: {dividirFechaYHora(item?.fin)?.fecha} / {dividirFechaYHora(item?.fin)?.hora}hs</Text>
          </View>
        )}
        <Text style={styles.subtitle}>Documento de quien creó la tarea:</Text>
        <Text>{formatoCedula(item?.cedulaPersonal)}</Text>
        <Text style={styles.subtitle}>Descripción:</Text>
        <Text>{formatoCedula(item?.descripcion)}</Text>
        {item.cedulaResidente && (
          <View>
            <Text style={styles.subtitle} >Residente asociado:</Text>
            <Text>{formatoCedula(item?.cedulaResidente)}</Text>
          </View>
        )}
        {item.personalAsociado && item.personalAsociado.length > 0 && (
          <View>
            <Text style={styles.subtitle} >Personal:</Text>
            {item.personalAsociado.map((personal, index) => (
              <Text key={index}>{personal.nombres} {personal.apellidos}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };


  const openPopup = (descripcion) => {
    //setDescripcionTarea(descripcion);
    setDescripcionTarea(descipcionDeTarea(descripcion));

    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };
  const cargarTareas = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = JSON.parse(userString);
      const ced = user.cedUsuario;
      const passKey = user.passKey;
      if (selectedDate) {
        const date = dividirFechaYHora(selectedDate.toISOString()).fecha;
        const datos = await getTareasByFecha(passKey, date);
        const orderDatta = datos.slice().sort((a, b) => new Date(a.diaDeTarea) - new Date(b.diaDeTarea));
        setTareas(orderDatta);
      } else {
        const datos = await getTareasSinAsignar(passKey, "Encargado");        
        setTareas(datos);
      }
    } catch (error) {
     
    }
  };
  useEffect(() => {


    cargarTareas();
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
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>

        <View style={styles.dates}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}> Fecha: </Text>
            <Text style={{ fontSize: 20 }}>
              {selectedDate ? dividirFechaYHora(selectedDate.toISOString()).fecha : formattedDate}
            </Text>
          </View>
          <TouchableOpacity style={{ flexDirection: "row" }} onPress={showDateTimePicker}>
            <Image source={require("../../../../Imgs/calendario2.png")} style={styles.imagen} />
          </TouchableOpacity>
        </View>
        {(tareas && tareas.length > 0) ?
          <View style={styles.innerContainer}>
            <FlatList refreshControl={
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
                    <Text style={styles.text}></Text>
                    <Image source={require("../../../../Imgs/lupa.png")} style={styles.lupa} />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item?.idTarea}
            />
            <Popup
              visible={popupVisible}
              onClose={closePopup}
              title="Descripción"
              content={descripcionTarea}
            />
          </View>
          :
          <View style={[styles.container, { marginTop: 100 }]}>
            <Text style={styles.text}> No hay tareas para mostrar </Text>
          </View>
        }
        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          mode="date"
          onConfirm={selectDate}
          onCancel={hideDateTimePicker}
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
    marginBottom: 100
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
    padding: 10,
    //backgroundColor: 'rgba(255,255,255, 0.60)',
    marginTop: 10,
    marginBottom: 5
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
  subtitle: {
    fontWeight: 'bold',
    paddingTop: 7,
    fontSize: 18,
  },
  popupcontainer: {
    paddingTop: 10,
    width: 350,
    marginBottom: 10,
  }
});

export default TareasEncargado;

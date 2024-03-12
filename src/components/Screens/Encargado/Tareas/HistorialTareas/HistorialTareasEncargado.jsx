import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../../../UI/PopUps/PopUp";
import { getTareasEntreFechas } from "../../../../../api/conections";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ContainerView from "../../../../UI/ContainerView";
import dividirFechaYHora from "../../../../UI/Utils/utils";

const HistorialTareasEncargado = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [descripcionTarea, setDescripcionTarea] = useState("");
  const [popTitle, setPopTitle] = useState("");
  const [tareas, setTareas] = useState([]);
  const [isDateTimePickerDesdeVisible, setIsDateTimePickerDesdeVisible] = useState(false);
  const [isDateTimePickerHastaVisible, setIsDateTimePickerHastaVisible] = useState(false);
  const [selectedDateDesde, setSelectedDateDesde] = useState(null);
  const [selectedDateHasta, setSelectedDateHasta] = useState(null);

  const openPopup = (item) => {
    setPopTitle(item?.nombreTarea);
    setDescripcionTarea(handlePopUpDescricion(item));
    setPopupVisible(true);
  };

  const handlePopUpDescricion = (item) => {
    return (

      <View>
        {<Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>{item?.estadoTarea?.nombreEstado ? item?.estadoTarea?.nombreEstado : "No hay estado de la tarea"}</Text>}
        <Text>Día de la tarea: {dividirFechaYHora(item?.diaDeTarea).fecha}</Text>
        <Text style={{ fontWeight: 'bold', padding: 5 }}>Descripción :</Text>
        <Text>{item.descripcion}</Text>
        {item.personalAsociado && item.personalAsociado.length > 0 && (
          <View>
            <Text style={{ fontWeight: 'bold', padding: 5 }}>Personal asociado:</Text>
            {item.personalAsociado.map((personal, index) =>
              <Text key={index}>{personal.nombres} {personal.apellidos} - {personal.cedula} </Text>)}
          </View>
        )}
      </View>
    )
  }

  const closePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const ced = user.cedUsuario;
        const passKey = user.passKey;

        if (selectedDateDesde && selectedDateHasta) {
          const dateDesde = dividirFechaYHora(selectedDateDesde.toISOString()).fecha;
          const dateHasta = dividirFechaYHora(selectedDateHasta.toISOString()).fecha;
          const datos = await getTareasEntreFechas(passKey, dateDesde, dateHasta);
          const orderDatta = datos.slice().sort((a,b)=> new Date(a.diaDeTarea)-new Date(b.diaDeTarea));
          setTareas(orderDatta);
        } else {
          // Si no se han seleccionado ambas fechas, establecemos las tareas en un arreglo vacío
          setTareas([]);
        }
      } catch (error) {
       
      }
    };

    cargarTareas();
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

      <View style={{ paddingBottom: 40 }}>

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
            {selectedDateDesde && selectedDateHasta && (
              <View>
                {/* esquema de colores ??? */}
              </View>
            )}

          </View>

        </View>
        {(selectedDateDesde && selectedDateHasta) ? (
          <View style={styles.innerContainer}>
            <FlatList
              data={tareas}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.container}
                  onPress={() => openPopup(item)}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.text}>{dividirFechaYHora(item?.diaDeTarea)?.fecha.substring(5, 10)}  {dividirFechaYHora(item?.diaDeTarea)?.hora} </Text>
                    <Text style={styles.text}>{item?.nombreTarea} </Text>
                    <Image source={require("../../../../Imgs/lupa.png")} style={styles.lupa} />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item?.idTarea}
            />
          </View>
        ) : <View style={{ height: 400 }}></View>}

        <Popup
          visible={popupVisible}
          onClose={closePopup}
          title={popTitle}
          content={descripcionTarea}
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dates: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingBottom: 10,
    marginTop: 130,
    backgroundColor: 'rgba(255,255,255, 0.60)',
    borderRadius:15
  },
  imagen: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
  lupa: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  innerContainer: {
    backgroundColor: 'rgba(255,255,255, 0.60)',
    padding: 18,
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 380
  },
});

export default HistorialTareasEncargado;

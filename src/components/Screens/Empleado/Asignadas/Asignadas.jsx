import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, RefreshControl } from "react-native";
import Button from "../../../UI/Button";
import { getPersonalAll, getAllTareasByCedPersonal, PostfinalizarTarea } from "../../../../api/conections";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContainerView from "../../../UI/ContainerView";
import dividirFechaYHora from "../../../UI/Utils/utils";
import Popup from "../../../UI/PopUps/PopUp";
import { useDispatch } from "react-redux";
import ErrorPopup from "../../../UI/PopUps/ErrorPopUp";
const Asignadas = ({ navigation }) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        cargarTareas();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    const dispatch = useDispatch();
    //const visitas = useSelector(state => state.visitas.visitas);
    const [misTareas, setTareas] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupAceptarVisible, setAceptarPopupVisible] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [idTarea, setIdTarea] = useState();
    const [descripcionTarea, setDescripcionTarea] = useState("");

    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const openPopup = () => {

        setPopupVisible(true);
    };

    const closePopup = () => {
        closeAcPopup();
        setPopupVisible(false);
        setIdTarea("");
    };

    const closeAcPopup = () => {
        setAceptarPopupVisible(false);
    };

    const openAceptarPopUp = () => {
        setAceptarPopupVisible(true);
    }

    const errorPopup = () => {
        setErrorPopupVisible(true);
    }
    const closeErrorPopup = () => {
        setErrorPopupVisible(false);
    }
    const screenHeight = Dimensions.get('window').height;
    const lineSize = screenHeight * 0.1;

    const [misTareasCopia, setTareasCopia] = useState([]);

    const tarea = async (cedulaUsuario) => {
        //cuando se apreta el boton, los comandos del popup:
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            getPersonalAll(user.passKey, cedulaUsuario)
                .then(datos => {
                    setTareas(datos)
                    setTareasCopia(datos.slice());
                });
        } catch {
            setMensaje("Error al cargar agendas");
            errorPopup();
        }
    }

    const onHandleFinalizar = (idTarea) => {
        setIdTarea(idTarea);
        openAceptarPopUp();
    }

    const aceptarFinalizar = () => {
        finalizarTarea();
    }

    const finalizarTarea = async () => {

        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const ced = user.cedUsuario;
        const passKey = user.passKey;

        const datos = await PostfinalizarTarea(passKey, idTarea, ced);
        const nuevasTareas = misTareas.filter(tarea => tarea.idTarea !== idTarea);
        setTareas(nuevasTareas);
        setMensaje(datos);
        setAceptarPopupVisible(false);
        openPopup();
        setIdTarea("");
    }

    const cargarTareas = async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const ced = user.cedUsuario;
            const passKey = user.passKey;
            const datos = await getAllTareasByCedPersonal(passKey, ced);
            const orderDatta = datos.slice().sort((a, b) => new Date(a.diaDeTarea) - new Date(b.diaDeTarea));
            setTareas(orderDatta);
        } catch (error) {
            setMensaje("Error al cargar tareas");
            errorPopup();
        }
    };
    useEffect(() => {
        cargarTareas();
    }, []);

    return (
        <ContainerView>

            <View style={styles.secondContainer}>
                {misTareas.length > 0 ?
                    <FlatList refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                        style={{ marginBottom: 40 }}
                        data={misTareas}
                        renderItem={({ item }) => (
                            <View style={styles.container} key={item.cedula}>
                                <View>
                                    <View style={{ flexDirection: "row" }}>

                                        <View >
                                            <Image source={require('../../../Imgs/libreta.png')} style={styles.image} />
                                        </View>

                                        <View style={{ maxWidth: 300, padding: 5 }}>
                                            <Text style={styles.text.header}> {item.nombreTarea}</Text>
                                            <Text style={styles.text.header}>  Hora: {dividirFechaYHora(item?.diaDeTarea).hora}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.text.resumen}>  Resumen: </Text>
                                    <View style={styles.desbordeControl}>
                                        <Text style={styles.text.rtext}>  {item.descripcion}</Text>

                                    </View>
                                </View>

                                <View>
                                    <View style={{ maxWidth: 300 }}>
                                        <Button
                                            title="Finalizar Tarea"
                                            onPress={() => onHandleFinalizar(item.idTarea)}
                                            backgroundColor="#009246"
                                            textColor="#000000"
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                    // keyExtractor={(item) => item.cedula}
                    />
                    :
                    <View style={styles.container}>
                        <Text style={styles.text.header}> Actualmente no tienes tareas asignadas </Text>
                    </View>
                }
                <Popup
                    visible={popupVisible}
                    onClose={closePopup}
                    title={mensaje}
                    content={""}
                />
                <Popup
                    visible={popupAceptarVisible}
                    onClose={aceptarFinalizar}
                    title="¿Quiere finalizar la tarea?"
                    content={""}
                    b2Text={"Cancelar"}
                    b2OnClose={closeAcPopup}
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
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        maxWidth: 700,
        backgroundColor: "rgba(252, 79, 79, 0.90)" //'#FC4F4F' 
    },
    secondContainer: {
        paddingBottom: 10,
        alignItems: 'center',
    },
    estadoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 5,
    },
    fecha: {
        textAlign: 'right',
    },
    text: {
        header: {
            color: '#000000',
            fontSize: 23,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingBottom: 10,
        },
        resumen: {
            color: '#000000',
            fontSize: 18,
            fontWeight: 'bold',
            paddingBottom: 10,
        },
        rtext: {
            fontSize: 15,
            textAlign: 'left',
            paddingBottom: 10,
        }
    },
    image: {
        width: 75,
        height: 75,
        resizeMode: 'cover',
    },
    desbordeControl: {
        maxWidth: 400,
        padding: 5
    }

});

export default Asignadas;
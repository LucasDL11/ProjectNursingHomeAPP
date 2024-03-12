import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, RefreshControl } from "react-native";
import { getAgendaByResponsable } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import dividirFechaYHora from "../../../../UI/Utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";


const MisVisitas = () => {
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
        cargarVisitas();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    const [visitas, setVisitas] = useState([]);
    const [verVisitantes, setVerVisitantes] = useState([]);

    const cargarVisitas = async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const ced = user.cedUsuario;
            const passKey = user.passKey;
            const datos = await getAgendaByResponsable(passKey, ced);
            const orderDatta = datos.slice().sort((a, b) => new Date(b.fechaYHora) - new Date(a.fechaYHora));
            setVisitas(orderDatta);
        } catch (error) {
            setMensaje("Error al cargar visitas");
            errorPopup();
        }
    }

    useEffect(() => {
        cargarVisitas();
    }, []);

    return (
        <ContainerView>
            {visitas.length > 0 ?
                <FlatList refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                    style={{ marginBottom: 40 }}
                    data={visitas}
                    renderItem={({ item }) => (
                        <View style={styles.container} key={item.idAgenda}>
                            <View style={{ flexDirection: "row" }}>
                                <View >
                                    <Image source={require('../../../../Imgs/nieta.png')} style={styles.image} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={{ textAlign: 'right' }}>Fecha: {dividirFechaYHora(item.fechaYHora).fecha}</Text>
                                        <Text style={{ textAlign: 'right' }}>Hora: {dividirFechaYHora(item.fechaYHora).hora}</Text>
                                    </View>
                                    <View style={styles.estadoContainer}>
                                        <Text style={styles.estado.realizada}>Estado: </Text>
                                        <Text
                                            style={[
                                                styles.estado.realizada,
                                                item?.estadoAgenda?.nombreEstado === "Rechazada" && styles.estado.denegada,
                                                (item?.estadoAgenda?.nombreEstado === "No realizada" || item?.estadoAgenda?.nombreEstado === "No Realizada") && styles.estado.denegada,
                                                item?.estadoAgenda?.nombreEstado === "Cancelada" && styles.estado.denegada,
                                                item?.estadoAgenda?.nombreEstado === "Aprobada" && styles.estado.aprobada,
                                                item?.estadoAgenda?.nombreEstado === "Pendiente" && styles.estado.aprobada,
                                            ]}
                                        >
                                            {item?.estadoAgenda?.nombreEstado || 'Pendiente'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>Motivo de visita: </Text>
                                <Text>{item.motivoDeVisita}</Text>
                            </View>
                            {item.observacion ?
                                <View>
                                    <Text style={styles.title.subtitle}>Observación: </Text>
                                    <Text>{item?.observacion}</Text>
                                </View>
                                :
                                <View></View>
                            }
                            {item.visitantesAgenda && item.visitantesAgenda.length > 0 && (
                                <View>
                                    {(verVisitantes == [] || verVisitantes != item.idAgenda) && (
                                        <Text
                                            style={styles.title.visitantes}
                                            onPress={() => setVerVisitantes(item.idAgenda)}
                                        >
                                            Ver visitantes
                                        </Text>)}
                                    {verVisitantes === item.idAgenda && (
                                        <View>
                                            <Text style={styles.title.subtitle} >Visitantes:</Text>
                                            {item.visitantesAgenda.map((visitante, index) => (
                                                <Text key={index}>{visitante.nombres} {visitante.apellidos}</Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                    keyExtractor={(item) => item.idAgenda}
                />
                :
                <View style={styles.container}>
                    <Text style={styles.estado.realizada}> Actualmente no hay visitas para mostrar </Text>
                </View>
            }
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
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "rgba(252, 79, 79, 0.85)" //'#FC4F4F' 
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
    title: {
        subtitle: {
            fontWeight: 'bold',
            paddingTop: 7
        },
        visitantes: {
            textAlign: 'center',
            color: 'blue',
            textDecorationLine: 'underline',
            paddingTop: 8,
            fontSize: 15
        },
        text: {
            paddingTop: 10,
            color: '#000000',
            fontSize: 40,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingBottom: 20,
        },
    },
    image: {
        width: 75,
        height: 75,
        resizeMode: 'cover',
    },
    estado: {
        realizada: {
            color: '#000000',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: 10,
            paddingBottom: 20,
        },
        aprobada: {
            color: '#557A46',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: 10,
            paddingBottom: 20,
            textShadowColor: "#000000",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 2,
        },
        denegada: {
            color: '#FE0C0C',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: 10,
            paddingBottom: 20,
            textShadowColor: "#000000",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 2,
        }
    }
});

export default MisVisitas;

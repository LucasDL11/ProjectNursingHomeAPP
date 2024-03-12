import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import Button from "../../../UI/Button";
import { getPersonalAllActivos } from "../../../../api/conections";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContainerView from "../../../UI/ContainerView";
import dividirFechaYHora, { formatoCedula } from "../../../UI/Utils/utils";
import { useLogin } from "../../../../context/LoginPovider/LoginProvider";


const Empleados = ({ navigation }) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const { isLoggedIn, profile } = useLogin();
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        cargarEmpleados();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    //const dispatch = useDispatch();
    //const visitas = useSelector(state => state.visitas.visitas);
    const [misEmpleados, setEmpleados] = useState([]);

    const [misEmpleadosCopia, setEmpleadosCopia] = useState([]);
    const empleado = async () => {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        getPersonalAllActivos(user.passKey)
            .then(datos => {
                setEmpleados(datos)
                setEmpleadosCopia(datos.slice());
            });
    }

    const agregarEmpleado = () => {

        navigation.navigate('AgregarEmpleado');
    }
    const cargarEmpleados = async () => {
        empleado();
    }
    useEffect(() => {
        cargarEmpleados();
    }, []);
    const cambiarFiltro = (filtro) => {
        setEmpleados(misEmpleadosCopia.slice());
        setEmpleados(misEmpleadosCopia.filter(d =>
            d.nombrePersona.includes(filtro) ||
            d.apellidos.includes(filtro) ||
            d.cedulaPersona.toString().includes(filtro)
        ));
    };

    const navegarDetalleEmpleado = (value) => {
        if (value != undefined) {
            navigation.navigate("DetalleEmpleado", { recibeCedula: Number(value) });
        }
    }
    return (
        <ContainerView>

            <View style={{ marginBottom: 100, marginTop: 40 }}>
                {(isLoggedIn && profile !== "Encargado") ? (
                    <View style={{ padding: 10 }}>
                        <Button
                            title="Alta empleado"
                            onPress={agregarEmpleado}
                            backgroundColor="#FF9F45"
                            textColor="#000000"
                            borderColor={"#FF8008"}
                        />
                    </View>
                )
                    :
                    <View style={{ padding: 32 }}></View>
                }
                <View style={{ padding: 6 }}>
                    <TextInput
                        title="Buscar"
                        onChangeText={cambiarFiltro}
                        backgroundColor="#FFFF"
                        textColor="#000000"
                        placeholder="   Buscar..."
                        style={{ borderRadius: 10, padding: 8 }}
                    />
                </View>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    data={misEmpleados}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.container} key={item.cedula} onPress={() => navegarDetalleEmpleado(item.cedulaPersona)}>
                            <View style={styles.datosContainer}>
                                <View>
                                    <Image source={require('../../../Imgs/empleado.png')} style={styles.image} />
                                </View>
                                <View>
                                    <Text style={styles.title.name}>{item.nombrePersona} {item.apellidos}</Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.bold}>Documento: </Text>
                                        <Text>{formatoCedula(item.cedulaPersona)}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.bold}>Fecha de ingreso: </Text>
                                        <Text>{item.fechaDeIngreso.substring(0, 10)}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.bold}>Teléfono: </Text>
                                        <Text>{item.telefono}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.bold}>Venc. carné de salud: </Text>
                                        <Text>{dividirFechaYHora(item.fechaVencimientoCarnetDeSalud).fecha}</Text>
                                    </View>

                                    {item?.carnetDeVacunas ? (
                                        <View >
                                            <Text style={styles.bold}>Tiene carné de vacunas</Text>
                                        </View>
                                    ) : (
                                        <View>
                                            <Text style={[styles.carnet.noTiene]}>NO tiene carné de vacunas</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
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
        backgroundColor: "rgba(252, 79, 79, 0.9)", //'#FC4F4F' 
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderColor: "#FF2222"
    },
    datosContainer: {
        flexDirection: "row",
        flex: 1,
        //justifyContent: "space-between",
        alignItems: "center"
    },
    fecha: {
        textAlign: 'right',
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
        name: {
            color: '#000000',
            fontSize: 16,
            fontWeight: 'bold',
        }
    },
    bold: {
        fontWeight: 'bold'
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 80,
        resizeMode: 'cover',
        marginRight:20
    },
    carnet: {
        noTiene: {
            color: '#CCEEBC',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadowColor: "#000000",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 2,
        }
    }

});

export default Empleados;

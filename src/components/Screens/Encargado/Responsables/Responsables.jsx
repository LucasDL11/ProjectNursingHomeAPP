import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import Button from "../../../UI/Button";
import { getAllResponsablesActivos } from "../../../../api/conections";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContainerView from "../../../UI/ContainerView";
import { formatoCedula } from "../../../UI/Utils/utils";
import { useLogin } from "../../../../context/LoginPovider/LoginProvider";

const Responsables = ({ navigation }) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const { isLoggedIn, profile } = useLogin();
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        cargarResponsables();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    //const dispatch = useDispatch();
    //const visitas = useSelector(state => state.visitas.visitas);
    const [misResponsables, setResponsables] = useState([]);
    const [misResponsablesCopia, setResponsablesCopia] = useState([]);
    const residente = async () => {

        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        getAllResponsablesActivos(user.passKey)
            .then(datos => {
                setResponsables(datos);
                setResponsablesCopia(datos.slice());
            });

    }
    const cambiarFiltro = (filtro) => {
        setResponsables(misResponsablesCopia.slice());
        setResponsables(misResponsablesCopia.filter(d =>
            d.nombrePersona.includes(filtro) ||
            d.apellidos.includes(filtro) ||
            d.cedulaPersona.toString().includes(filtro)
        ));
    };
    const cargarResponsables = async () => {
        residente();
    }
    useEffect(() => {



        cargarResponsables();
    }, []);
    const navegarAgregarResponsable = () => {
        navigation.navigate('AgregarResponsable')
    };

    const navegarDetalleFamiliar = (value) => {
        if (value != undefined) {
            navigation.navigate("DetalleFamiliar", { recibeCedula: Number(value) });
        }
    }
    return (
        <ContainerView>

            <View style={{ marginBottom: 100, marginTop: 40 }}>                
                {(isLoggedIn && profile !== "Encargado") ? (


                    <View style={{ padding: 10 }}>
                        <Button
                            title="Alta familiar"
                            onPress={navegarAgregarResponsable}
                            backgroundColor="#FF9F45"
                            textColor="#000000"
                            borderColor={"#FF8008"}
                        />
                    </View>
                )
                    :
                    <View style={{ padding: 32 }}></View>
                }
                <View style={{ padding: 5 }}>
                    <TextInput
                        title="Buscar"
                        onChangeText={cambiarFiltro}
                        backgroundColor="#FFFF"
                        textColor="#000000"
                        placeholder=" Buscar..."
                        style={{ borderRadius: 10, padding: 8 }}
                    />
                </View>
                <FlatList refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                    data={misResponsables}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.container} key={item.cedula} onPress={() => navegarDetalleFamiliar(item.cedulaPersona)}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ marginEnd: 10 }}>
                                    <Image source={require('../../../Imgs/nieta.png')} style={styles.image} />
                                </View>
                                <View>
                                    <View>
                                        <Text style={styles.nombre}>{item.nombrePersona} {item.apellidos}</Text>
                                    </View>

                                    <View style={styles.datosContainer}>
                                        <View>
                                            <Text>{formatoCedula(item.cedulaPersona)} </Text>
                                            <Text style={styles.bold}>Teléfono: </Text>
                                            <Text style={styles.bold}>Residente: </Text>
                                        </View>
                                        <View style={{ marginLeft: 10 }}>
                                            <Text />
                                            <Text>{item.telefono} </Text>
                                            <Text>{item?.residente?.apellidos ?? ""}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.cedulaPersona}
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
    nombre: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: 250
    },
    datosContainer: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center"
    },
    fecha: {
        textAlign: 'right',
    },
    bold: {
        fontWeight: 'bold'
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 80,
        resizeMode: 'cover',
    },
});

export default Responsables;

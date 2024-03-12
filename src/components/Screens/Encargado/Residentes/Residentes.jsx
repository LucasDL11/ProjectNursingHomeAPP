import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import Button from "../../../UI/Button";
import { getAllResidentesActivos } from "../../../../api/conections";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContainerView from "../../../UI/ContainerView";
import { formatoCedula } from "../../../UI/Utils/utils";
import { useLogin } from "../../../../context/LoginPovider/LoginProvider";

const Residentes = ({ navigation }) => {
    const [misResidentes, setResidentes] = useState([]);
    const [misResidentesCopia, setResidentesCopia] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const { isLoggedIn, profile } = useLogin();
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        cargarResidentes();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    const residente = async () => {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        getAllResidentesActivos(user.passKey)
            .then(datos => {
                setResidentes(datos);
                setResidentesCopia(datos.slice());
            });

    }
    const cambiarFiltro = (filtro) => {
        setResidentes(misResidentesCopia.slice());
        setResidentes(misResidentesCopia.filter(d =>
            d.nombrePersona.includes(filtro) ||
            d.apellidos.includes(filtro) ||
            d.cedulaPersona.toString().includes(filtro)
        ));
    };
    const cargarResidentes = async () => {
        residente();
    }
    useEffect(() => {
        cargarResidentes();
    }, []);
    const navegarAgregarResidente = () => {
        navigation.navigate('AgregarResidente')
    };
    const navegarDetalleResidente = (value) => {
        if (value != undefined) {
            navigation.navigate("DetalleResidente", { recibeCedula: Number(value) });
        }
    }
    return (
        <ContainerView>

            <View style={{ marginBottom: 100, flex: 1, justifyContent: 'flex-start' }}>
                {(isLoggedIn && profile !== "Encargado") ? (
                    <View style={{ padding: 10 }}>
                        <Button
                            title="Alta residente"
                            onPress={navegarAgregarResidente}
                            backgroundColor="#FF9F45"
                            textColor="#000000"
                            borderColor={"#FF8008"}
                        />
                    </View>
                )
                    :
                    <View style={{ padding: 40 }}></View>
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
                <View style={{ height: 540 }}>
                    <FlatList
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={misResidentes}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.container}
                                key={item.cedula}
                                onPress={() => navegarDetalleResidente(item.cedulaPersona)}
                            >
                                <View style={styles.datosContainer}>
                                    <View>
                                        <Image source={require('../../../Imgs/abuelos.png')} style={styles.image} />
                                    </View>
                                    <View>
                                        <Text style={styles.nameText}>{item.nombrePersona} {item.apellidos}</Text>
                                        <Text>{formatoCedula(item.cedulaPersona)} </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Teléfono: </Text>
                                            <Text>{item.telefono} </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Teléfono de contacto: </Text>
                                            <Text>{item?.responsable?.telefono ?? ""} </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Emergencia Móvil: </Text>
                                            <Text>{item.sociedadMedica} </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
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
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: "#FF2222"
    },
    nameText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: 300
    },
    datosContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
    },
    controlarDesborde: {
        flexWrap: "wrap"
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 80,
        resizeMode: 'cover',
    },
});

export default Residentes;

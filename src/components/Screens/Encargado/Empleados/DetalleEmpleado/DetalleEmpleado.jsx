import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addEmpleado, eliminarPersona, getDetalleEmpleadoByCedula } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import Link from "../../../../UI/Link";
import dividirFechaYHora from "../../../../UI/Utils/utils";
import { useLogin } from "../../../../../context/LoginPovider/LoginProvider";
const DetalleEmpleado = ({ navigation, route }) => {

    const screenHeight = Dimensions.get('window').height;
    const lineSize = screenHeight * 0.8;

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupEliminarEmpleadoVisible, setPopupEliminarEmpleadoVisible] = useState(false);

    const [empleado, setEmpleado] = useState([]);
    const { isLoggedIn, profile } = useLogin();
    const dispatch = useDispatch();

    const [mensaje, setMensaje] = useState('');
    //cuando se apreta el boton, los comandos del popup:



    const openPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const openPopUpEliminarEmpleado = () => {
        setPopupEliminarEmpleadoVisible(true);
    };

    const closePopUpEliminarEmpleado = () => {
        setPopupEliminarEmpleadoVisible(false);
    };

    const closePopUpEliminarEmpleadoEliminar = () => {
        eliminarEmpleado();
        setPopupEliminarEmpleadoVisible(false);
    };

    const cargarEmpleado = async () => {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const ced = user.cedUsuario;
        getDetalleEmpleadoByCedula(user.passKey, route.params.recibeCedula)
            .then(datos => {                
                setEmpleado(datos);
            });
    }
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        cargarEmpleado();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    useEffect(() => {
        cargarEmpleado();
    }, [])

    const navegarUpdateEmpleado = (value) => {
        if (value != undefined) {
            navigation.navigate("UpdateEmpleado", { recibeCedula: Number(value) });
        }
    }

    const eliminarEmpleado = async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const ced = user.cedUsuario;
            const passKey = user.passKey;
            if (empleado != null) {
                const datos = await eliminarPersona(passKey, empleado.cedulaPersona);
                if (datos.status === 200) {
                    setMensaje('Empleado dado de baja con éxito');
                    openPopup();
                } else {
                    setMensaje('Error al dar de baja');
                    openPopup();
                }
            } else {
                setMensaje('Verifique datos');
                openPopup();
            }
        } catch (error) {
            setMensaje('Verifique datos');
            openPopup();
        }
    };
    return (
        <ContainerView>

            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <View style={[styles.innerContainer, { height: lineSize }]}>



                    <View style={styles.headerContainer}>
                        <Image style={styles.headImg} source={require('../../../../Imgs/empleado.png')} />
                        <Text style={styles.titleText}>{empleado?.nombrePersona} {empleado?.apellidos}</Text>
                    </View>
                    <View style={styles.datosContainer} >
                        <ScrollView horizontal>

                            <View style={[styles.dattaContainer, { paddingRight: 15 }]}>

                                <Text style={styles.boldText}>Cedula: </Text>
                                <Text style={styles.boldText}>Fecha de nacimiento: </Text>
                                <Text style={styles.boldText}>Telefono: </Text>
                                <Text style={styles.boldText}>Domicilio: </Text>
                                <Text style={styles.boldText}>Sexo: </Text>
                                <Text style={styles.boldText}>Fecha carnet de salud: </Text>
                                {empleado?.carnetDeVacunas ? <Text style={styles.boldText}>Tiene carné de vacunas </Text> : <Text style={styles.boldText}>  NO tiene carné de vacunas </Text>}
                                {empleado.fechaVencimientoCarnetBromatologia ? <Text style={styles.boldText}>Bromatología: </Text> : <Text></Text>}
                            </View>
                            <View style={[styles.dattaContainer, { marginLeft: 10 }]}>
                                <Text>  {empleado.cedulaPersona} </Text>
                                <Text>  {empleado.fechaNacimiento?.substring(0, 10) ?? ""} </Text>
                                <Text>  {empleado.telefono} </Text>
                                <Text>  {empleado.direccion} </Text>
                                <Text>  {empleado.sexo} </Text>
                                <Text>  {empleado?.fechaVencimientoCarnetDeSalud && dividirFechaYHora(empleado?.fechaVencimientoCarnetDeSalud)?.fecha} </Text>
                                <Text></Text>
                                {empleado.fechaVencimientoCarnetBromatologia ? (<Text>  {dividirFechaYHora(empleado?.fechaVencimientoCarnetBromatologia)?.fecha} </Text>) : null}
                            </View>
                        </ScrollView>

                    </View>
                    <Text style={[styles.documentosStyle, { marginBottom: 10, marginTop: 20 }]}>Documentos</Text>

                    {(empleado?.documentos && empleado?.documentos.length > 0) ?
                        <View style={{ height: 100 }}>

                            <ScrollView horizontal>
                                <View style={{ flexDirection: 'row' }}>
                                    {empleado?.documentos?.map(d => (
                                        <Link key={d.idDocumento} url={d.rutaDocumento} texto={require("../../../../Imgs/imagen.png")} />))}

                                </View>
                            </ScrollView>
                        </View>

                        :
                        <Text style={{ paddingBottom: 40 }}>No tiene documentos actualmente</Text>
                    }

                    {(isLoggedIn && profile !== "Encargado") ? (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: 'stretch', marginTop: 10 }}>

                            <TouchableOpacity onPress={() => navegarUpdateEmpleado(empleado?.cedulaPersona)}>
                                <Image source={require("../../../../Imgs/editar.png")} style={styles.imagen} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={openPopUpEliminarEmpleado}>
                                <Image source={require("../../../../Imgs/eliminar.png")} style={styles.imagen} />
                            </TouchableOpacity>

                        </View>

                    )
                        :
                        <View style={{ padding: 30 }}></View>
                    }

                    <Popup
                        visible={popupVisible}
                        onClose={closePopup}
                        title=""
                        content={mensaje}
                    />
                    <Popup
                        visible={popupEliminarEmpleadoVisible}
                        onClose={closePopUpEliminarEmpleadoEliminar}
                        title=""
                        content={<View><Text>Desea dar de baja el empleado seleccionado?</Text></View>}
                        b2OnClose={closePopUpEliminarEmpleado}
                        b2Text="Cancelar"
                    />



                </View>
            </ScrollView>
        </ContainerView>
    )

}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        marginBottom: 40
    },
    titleText: {
        color: '#000000',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20,
        maxWidth: 300
    },
    dattaContainer: {
        alignSelf: 'stretch',
        flexDirection: "column",
        justifyContent: "space-between",
        height: 200
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 15
    },
    documentosStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19,
        paddingBottom: 20
    },
    datosContainer: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        //overflow: 'scroll'
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 18,
        borderRadius: 20,
    },
    imagen: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
    },
    headImg: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 30,
        marginRight: 5
    }
});

export default DetalleEmpleado;
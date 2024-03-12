import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { eliminarPersona, getDetalleResidenteByCedula } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";
import Link from "../../../../UI/Link";
import { useLogin } from "../../../../../context/LoginPovider/LoginProvider";
const DetalleResidente = ({ navigation, route }) => {

    const screenHeight = Dimensions.get('window').height;
    const lineSize = screenHeight * 0.8;
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupPatVisible, setPopupPatVisible] = useState(false);


    const [mensaje, setMensaje] = useState('');
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [residente, setResidente] = useState([]);
    const [popupEliminarResidenteVisible, setPopupEliminarResidenteVisible] = useState(false);

    const { isLoggedIn, profile } = useLogin();
    const dispatch = useDispatch();
    //cuando se apreta el boton, los comandos del popup:
    const openPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const closePatPopup = () => {
        setPopupPatVisible(false);
    };

    const openPopUpEliminarResidente = () => {
        setPopupEliminarResidenteVisible(true);
    };

    const patPopVisible = () => {
        setPopupPatVisible(true);
    };

    const closePopUpEliminarResidente = () => {
        setPopupEliminarResidenteVisible(false);
    };

    const closePopUpEliminarResidenteEliminar = () => {
        eliminarResidente();
        setPopupEliminarResidenteVisible(false);
    };
    const errorPopup = () => {
        setErrorPopupVisible(true);
    }
    const closErrorPopup = () => {
        setErrorPopupVisible(false);
    }
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        cargarResidente();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    const cargarResidente = async () => {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const ced = user.cedUsuario;
        getDetalleResidenteByCedula(user.passKey, route.params.recibeCedula)
            .then(datos => {
                setResidente(datos);
            });

    }
    useEffect(() => {

        cargarResidente();
    }, []);

    const navegarUpdateResidente = (value) => {
        if (value != undefined) {
            navigation.navigate("UpdateResidente", { recibeCedula: Number(value) });
        }
    }
    const eliminarResidente = async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const ced = user.cedUsuario;
            const passKey = user.passKey;
            if (residente != null) {
                const datos = await eliminarPersona(passKey, residente.cedulaPersona);
                if (datos.status === 200) {
                    setMensaje('Residente dado de baja con éxito');
                    openPopup();
                } else {
                    setMensaje('Error al dar de baja');
                    errorPopup();
                }
            } else {
                setMensaje('Verifique datos');
                errorPopup();
            }




        } catch (error) {
            setMensaje('Error al elimina residente, intentelo más tarde');
            errorPopup();
        }
    };
    return (
        <ContainerView>
            <View style={[styles.innerContainer, { height: lineSize }]}>
                <View style={{ padding: 10 }}>

                    <View style={styles.headerContainer}>
                        <Image style={styles.headImg} source={require('../../../../Imgs/nieta.png')} />
                        <Text style={styles.titleText}>{residente?.nombrePersona} {residente?.apellidos}</Text>

                    </View>

                    <View style={styles.datosContainer}>
                        <ScrollView>
                            <ScrollView horizontal>
                                <View style={[styles.dattaContainer, { paddingRight: 15 }]}>
                                    <Text style={styles.boldText}>Cédula: </Text>
                                    <Text style={styles.boldText}>Fecha de nac.: </Text>
                                    <Text style={styles.boldText}>Telefono: </Text>
                                    <Text style={styles.boldText}>Domicilio: </Text>
                                    <Text style={styles.boldText}>Sexo: </Text>
                                    <Text style={styles.boldText}>Sociedad Medica: </Text>
                                    <Text style={styles.boldText}>Emergencia Movil: </Text>
                                    <Text style={styles.boldText}>Responsable: </Text>
                                </View>

                                <View style={[styles.dattaContainer]}>
                                    <Text>  {residente?.cedulaPersona} </Text>
                                    <Text>  {residente?.fechaNacimiento?.substring(0, 10) ?? ""} </Text>
                                    <Text>  {residente?.telefono} </Text>
                                    <Text>  {residente?.direccion} </Text>
                                    <Text>  {residente?.sexo} </Text>
                                    <Text>  {residente?.sociedadMedica} </Text>
                                    <Text>  {residente?.emergenciaMovil} </Text>
                                    <Text>  {residente?.responsable?.nombrePersona} {residente?.responsable?.apellidos}</Text>

                                    {/*                                 {residente?.documentos?.map(d => (
                                <Text key={d.idDocumento} value={d.rutaDocumento}>{`${d.nombreDocumento}`}</Text>))} */}

                                </View>
                            </ScrollView>
                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: 5, marginTop: 5 }}>
                        {<Text style={styles.patologiasStyle} onPress={patPopVisible}>Patologías</Text>}
                    </View>

                    <View>
                        <Text style={styles.documentosStyle}>Documentos</Text>

                        {(residente?.documentos && residente?.documentos.length > 0) ?
                            <View style={{ height: 100 }}>
                                <ScrollView horizontal>

                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        {residente?.documentos?.map(d => (
                                            <Link key={d.idDocumento} url={d.rutaDocumento} texto={require("../../../../Imgs/imagen.png")} />))}

                                    </View>
                                </ScrollView>
                            </View>
                            :
                            <Text style={{ paddingBottom: 40 }}>No tiene documentos actualmente</Text>
                        }

                    </View>
                    {(isLoggedIn && profile !== "Encargado") ? (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: 'stretch' }}>

                            <TouchableOpacity onPress={() => navegarUpdateResidente(residente?.cedulaPersona)}>
                                <Image source={require("../../../../Imgs/editar.png")} style={styles.imagen} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={openPopUpEliminarResidente}>
                                <Image source={require("../../../../Imgs/eliminar.png")} style={styles.imagen} />
                            </TouchableOpacity>

                        </View>
                    )
                        :
                        <View style={{ padding: 30 }}></View>
                    }
                    <Popup
                        visible={popupPatVisible}
                        onClose={closePatPopup}
                        title=""
                        content={
                            <View>
                                <ScrollView>
                                    <View style={{ flexDirection: 'column' }}>
                                        {residente?.patologiasCronica?.length > 0 ? residente?.patologiasCronica?.map(pc => (
                                            <View key={pc.idPatologiaCronica} style={{ padding: 5 }}>
                                                <Text value={pc.cedulaPersona} style={{ fontSize: 16, fontWeight: 'bold' }}>{pc.nombre}</Text>
                                                <Text value={pc.cedulaPersona}>{pc?.observaciones}</Text>
                                            </View>
                                        )) :
                                            <Text> Actualmente no hay patologías registradas </Text>
                                        }
                                    </View>
                                </ScrollView>
                            </View>
                        }
                    />
                    <Popup
                        visible={popupVisible}
                        onClose={closePopup}
                        title=""
                        content={mensaje}
                    />
                    <Popup
                        visible={popupEliminarResidenteVisible}
                        onClose={closePopUpEliminarResidenteEliminar}
                        title=""
                        content={<View><Text>Desea dar de baja el residente seleccionado?</Text></View>}
                        b2OnClose={closePopUpEliminarResidente}
                        b2Text="Cancelar" />

                    <ErrorPopup
                        visible={errorPopupVisible}
                        onClose={closErrorPopup}
                        content={mensaje}
                    />

                </View>
            </View>

        </ContainerView >
    )

}
const styles = StyleSheet.create({
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 10,
        borderRadius: 20,
        marginBottom: 40
    },
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
    text: {
        color: '#000000',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 20,
    },
    dattaContainer: {
        alignSelf: 'stretch',
        flexDirection: "column",
        justifyContent: "space-between",
        height: 200
    },
    container: {
        flex: 1,
        //backgroundColor: '#FFBC80',
        justifyContent: 'center',
        alignItems: 'center',
    }, datosContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center"
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 15
    },
    headImg: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 30
    },
    imagen: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
    },
    documentosStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19,
        paddingBottom: 20
    },
    patologiasStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'blue',
        textDecorationLine: 'underline',
        fontSize: 19,
        paddingBottom: 10
    },
});

export default DetalleResidente;
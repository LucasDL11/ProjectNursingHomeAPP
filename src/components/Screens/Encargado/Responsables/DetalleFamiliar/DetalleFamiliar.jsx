import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useEffect, useState } from "react"; import { useDispatch } from "react-redux";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { eliminarPersona, getResponsableByCedula } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";
import { formatoCedula } from "../../../../UI/Utils/utils";
import Link from "../../../../UI/Link";
import { useLogin } from "../../../../../context/LoginPovider/LoginProvider";

const DetalleFamiliar = ({ navigation, route }) => {

    const screenHeight = Dimensions.get('window').height;
    const lineSize = screenHeight * 0.8;
    const [popupVisible, setPopupVisible] = useState(false);

    const { isLoggedIn, profile } = useLogin();

    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [responsable, setResponsable] = useState([]);
    const [popupEliminarResponsableVisible, setPopupEliminarResponsableVisible] = useState(false);
    const dispatch = useDispatch();
    //cuando se apreta el boton, los comandos del popup:
    const openPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const openPopUpEliminarResponsable = () => {
        setPopupEliminarResponsableVisible(true);
    };

    const closePopUpEliminarResponsable = () => {
        setPopupEliminarResponsableVisible(false);
    };

    const closePopUpEliminarResponsableEliminar = () => {
        eliminarResponsable();
        setPopupEliminarResponsableVisible(false);
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

        cargarResponsable();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    const cargarResponsable = async () => {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const ced = user.cedUsuario;

        getResponsableByCedula(user.passKey, route.params.recibeCedula)
            .then(datos => {
                
                setResponsable(datos);
            });
    }
    useEffect(() => {

        cargarResponsable();
    }, []);

    const navegarUpdateResponsable = (value) => {
        if (value != undefined) {
            navigation.navigate("UpdateResponsable", { recibeCedula: Number(value) });
        }
    }

    const eliminarResponsable = async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const ced = user.cedUsuario;
            const passKey = user.passKey;
            if (responsable != null) {
                const datos = await eliminarPersona(passKey, responsable.cedulaPersona);
                if (datos.status === 200) {
                    setMensaje('Responsable dado de baja con éxito');
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
            setMensaje('Error al eliminar responsable, intente más tarde');
            errorPopup();
        }
    };
    return (
        <ContainerView>

            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <View style={[styles.innerContainer, { height: lineSize }]}>
                    <View style={{ padding: 10 }}>

                        <View style={styles.headerContainer}>
                            <Image style={styles.headImg} source={require('../../../../Imgs/nieta.png')} />
                            <View>
                                <Text style={styles.text}>{responsable?.nombrePersona}</Text>
                                <Text style={styles.text}>{responsable?.apellidos}</Text>

                            </View>
                        </View>

                        <View style={styles.datosContainer}>
                            <ScrollView horizontal>
                                <View style={[styles.dattaContainer, { paddingRight: 15 }]}>
                                    <Text style={styles.boldText}>  Nombre: </Text>
                                    <Text style={styles.boldText}>  Apellidos: </Text>
                                    <Text style={styles.boldText}>  Cedula: </Text>
                                    <Text style={styles.boldText}>  Fecha de nacimiento: </Text>
                                    <Text style={styles.boldText}>  Telefono: </Text>
                                    <Text style={styles.boldText}>  Domicilio: </Text>
                                    <Text style={styles.boldText}>  Sexo: </Text>
                                    <Text style={styles.boldText}>  Residente: </Text>
                                    <Text style={styles.boldText}>  Parentesco: </Text>
                                    <Text style={styles.boldText}>  Curatela: </Text>
                                </View>
                                <View style={[styles.dattaContainer]}>
                                    <Text>  {responsable?.nombrePersona} </Text>
                                    <Text>  {responsable?.apellidos} </Text>
                                    <Text>  {formatoCedula(responsable?.cedulaPersona)} </Text>
                                    <Text>  {responsable?.fechaNacimiento?.substring(0, 10) ?? ""} </Text>
                                    <Text>  {responsable?.telefono} </Text>
                                    <Text>  {responsable?.direccion} </Text>
                                    <Text>  {responsable?.sexo} </Text>
                                    <Text>  {responsable?.residente?.nombrePersona} {responsable?.residente?.apellidos}</Text>
                                    <Text>  {responsable?.parentesco?.nombreParentesco} </Text>
                                    <Text > {(responsable?.curatela && responsable?.curatela == true) ? "Tiene Curatela" : "No tiene curatela"} </Text>
                                </View>
                            </ScrollView>
                        </View>

                        <View>
                            <Text style={[styles.documentosStyle, { marginBottom: 10 }]}>Documentos</Text>

                            {(responsable?.documentos && responsable?.documentos.length > 0) ?
                                <View style={{ height: 100 }}>
                                    <ScrollView horizontal>
                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                            {responsable?.documentos?.map(d => (
                                                <Link key={d.idDocumento} url={d.rutaDocumento} texto={require("../../../../Imgs/imagen.png")} />))}

                                        </View>
                                    </ScrollView>
                                </View>
                                :
                                <Text style={{ paddingBottom: 40, textAlign: 'center' }}>No tiene documentos actualmente</Text>
                            }
                        </View>

                        {(isLoggedIn && profile !== "Encargado") ? (
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: 'stretch' }}>

                                <TouchableOpacity onPress={() => navegarUpdateResponsable(responsable?.cedulaPersona)}>
                                    <Image source={require("../../../../Imgs/editar.png")} style={styles.imagen} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={openPopUpEliminarResponsable}>
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
                            visible={popupEliminarResponsableVisible}
                            onClose={closePopUpEliminarResponsableEliminar}
                            title=""
                            content={<View><Text>Desea dar de baja el responsable seleccionado?</Text></View>}
                            b2OnClose={closePopUpEliminarResponsable}
                            b2Text="Cancelar"
                        />
                    </View>
                </View>
            </ScrollView>
            <ErrorPopup
                visible={errorPopupVisible}
                onClose={closErrorPopup}
                content={mensaje}
            />
        </ContainerView>
    )

}
const styles = StyleSheet.create({
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 18,
        borderRadius: 20,
    },
    headerContainer: {
        flexDirection: "row",
        marginBottom: 40,
        maxWidth: 500
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
    },
    dattaContainer: {
        alignSelf: 'stretch',
        flexDirection: "column",
        justifyContent: "space-between",
        height: 220
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
        borderRadius: 30,
        marginRight: 5
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
});

export default DetalleFamiliar;
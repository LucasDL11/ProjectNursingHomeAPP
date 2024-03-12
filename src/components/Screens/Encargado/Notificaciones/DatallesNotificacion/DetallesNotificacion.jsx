import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react"; import { useDispatch } from "react-redux";
import Button from "../../../../UI/Button"
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDetalleResidenteByCedula, SendNotificationsEmergencia } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
const DetallesNotificacion = ({ navigation, route }) => {

    
    const [popupVisible, setPopupVisible] = useState(false);
    


    const [mensaje, setMensaje] = useState('');    
    const [residente, setResidente] = useState([]);
    const dispatch = useDispatch();

  
    const openPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };
   
    const enviarNotificaciones = async () => {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        await SendNotificationsEmergencia(user.passKey, residente.cedulaPersona
        )
            .then(datos => {
                setMensaje(datos);
                openPopup();
            });

    }

     
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



    return (
        <ContainerView>
            <View style={{alignItems:"center"}}>

                <View style={styles.innerContainer}>
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

                                    </View>
                                </ScrollView>
                            </ScrollView>
                        </View>
                        

                        <View>

                            <TouchableOpacity onPress={() => navegarUpdateResidente(residente?.cedulaPersona)}>
                                <Button
                                    title={"Notificar emergencia"}
                                    onPress={enviarNotificaciones}
                                    backgroundColor="#FC4F4F"
                                    textColor="#000000" />
                            </TouchableOpacity>

                        </View>
                        
                        <Popup
                            visible={popupVisible}
                            onClose={closePopup}
                            title=""
                            content={mensaje}
                        />
                       

                    </View>
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
        marginBottom: 40,
        maxHeight: 500, 
        maxWidth: 500
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

export default DetallesNotificacion;
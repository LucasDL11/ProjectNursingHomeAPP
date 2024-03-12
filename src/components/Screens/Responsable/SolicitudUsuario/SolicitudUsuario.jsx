import React from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import { useState } from "react";
//import { useDispatch } from "react-redux";
import Button from "../../../UI/Button"
import InputText from "../../../UI/InputText";
import Popup from "../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addSolicitudUsuario } from "../../../../api/conections";
import FechaByLabel from "../../../UI/FechaByLabel";
import ContainerView from "../../../UI/ContainerView";
import ParentescoPicker from "../../../UI/Picker/ParentescoPicker";
import validarCampos from "../../../UI/Validaciones/validaciones";
import ErrorPopup from "../../../UI/PopUps/ErrorPopUp";


const SolicitudUsuario = () => {

    const [nombres, setNombre] = useState('');
    const [apellidos, setApellido] = useState('');
    const [documento, setDocumento] = useState('');

    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');

    const [domicilio, setDomicilio] = useState('');

    const [parentesco, setParentesco] = useState('');
    const [sexo, setSexo] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [mensaje, setMensaje] = useState('');
    //const dispatch = useDispatch();
    //cuando se apreta el boton, los comandos del popup:
    const openPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const errorPopup = () => {
        setErrorPopupVisible(true);
    }
    const closErrorPopup = () => {
        setErrorPopupVisible(false);
    }

    const onPressValidarYenviar = () => {
        const mensajeVal = validarCampos(
            documento,
            nombres,
            apellidos,
            fechaNacimiento,
            telefono,
            sexo,
            parentesco,
            domicilio,
            email
        );
        if (mensajeVal === "") {
            enviarSolicitud();
            //openPopup();
        } else {
            setMensaje(mensajeVal);
            errorPopup();
        }

    }

    const enviarSolicitud = async () => {

        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const cedResponsable = user.cedUsuario;
        //Armar objeto para enviar por api         
        let solicitud = JSON.stringify({
            cedSolicitante: cedResponsable,
            cedSolicitado: Number(documento),
            nombres: nombres,
            apellidos: apellidos,
            fechaNacimiento: fechaNacimiento,
            email: email,
            telefono: telefono,
            direccion: domicilio,
            sexo: sexo,
            nombreParentesco: parentesco
        })
        addSolicitudUsuario(user.passKey, solicitud)
            .then(datos => {
                if (datos.status === 200) {
                    setMensaje('Solicitud de usuario enviada con exito. Nos comunicaremos a la brevedad');
                    openPopup();
                    limpiarCampos();
                } else {
                    setMensaje('Ha ocurrido un error')
                    errorPopup();
                }
            })
            }

    const limpiarCampos = async () => {
        setNombre('');
        setApellido('');
        setDocumento('');    
        setEmail('');
        setFechaNacimiento('');
        setTelefono('');    
        setDomicilio('');    
        setParentesco('');
        setSexo('');
    }
    return (
        <ContainerView>

            <ScrollView>

                <View style={styles.innerContainer}>

                    <View>

                        <InputText
                            style={styles.input}
                            maxLength={8}
                            value={documento}
                            onChangeText={(documento) => setDocumento(documento)}
                            placeholder={'Documento (sin puntos ni guiones)'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />


                        <InputText
                            value={nombres}
                            onChangeText={(nombres) => setNombre(nombres)}
                            placeholder={'Nombres'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />
                        <InputText
                            value={apellidos}
                            onChangeText={(apellidos) => setApellido(apellidos)}
                            placeholder={'Apellidos'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />

                        <FechaByLabel
                            dateField={fechaNacimiento}
                            onConfirmDate={setFechaNacimiento}
                        />

                        <InputText
                            value={telefono}
                            onChangeText={(telefono) => setTelefono(telefono)}
                            placeholder={'Teléfono'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />

                        <InputText
                            value={domicilio}
                            onChangeText={(domicilio) => setDomicilio(domicilio)}
                            placeholder={'Domicilio'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />

                        <InputText
                            value={sexo}
                            onChangeText={(sexo) => setSexo(sexo)}
                            placeholder={'Sexo'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />
                        <ParentescoPicker
                            value={parentesco}
                            onChange={(parentesco) => setParentesco(parentesco)}
                        />
                                                
                        <InputText
                            value={email}
                            onChangeText={(email) => setEmail(email)}
                            placeholder={'Email'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />


                        <Button
                            title="Enviar solicitud"
                            onPress={onPressValidarYenviar}
                            backgroundColor="#FC4F4F"
                            textColor="#000000"
                        />
                        <Popup
                            visible={popupVisible}
                            onClose={closePopup}
                            title=""
                            content={mensaje}
                        />

                        <ErrorPopup
                            visible={errorPopupVisible}
                            onClose={closErrorPopup}
                            content={mensaje}
                        />
                    </View>

                </View>

            </ScrollView>

        </ContainerView>
    )

}
const styles = StyleSheet.create({
    text: {
        color: '#000000',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        //backgroundColor: '#FFBC80',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 18,
        borderRadius: 20,
        paddingBottom: 20
    },
});

export default SolicitudUsuario;
import React from "react";
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from "react"; 
import Button from "../../../../UI/Button";
import InputText from "../../../../UI/InputText";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContainerView from "../../../../UI/ContainerView";
import FechaByLabel from "../../../../UI/FechaByLabel";
import ParentescoPicker from "../../../../UI/Picker/ParentescoPicker";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";
import validarCampos from "../../../../UI/Validaciones/validaciones";
import { addMisVisitantes } from "../../../../../api/conections";
import { getPersonaByCedula } from "../../../../../api/conections";

const AgregarVisitante = ({ navigation }) => {

    const [nombres, setNombre] = useState('');
    const [apellidos, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [sexo, setSexo] = useState('');
    const [parentesco, setParentesco] = useState('');

    const [popupVisible, setPopupVisible] = useState(false);
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);

    const [mensaje, setMensaje] = useState('');

    //cuando se apreta el boton, los comandos del popup:
    const openPopup = () => {
        setPopupVisible(true);
    };

    const errorPopup = () => {
        setErrorPopupVisible(true);
    }
    const closErrorPopup = () => {
        setErrorPopupVisible(false);
    }

    const agregarVisitante = () => {        
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
            guardarVisitante();
            //openPopup();
        } else {
            setMensaje(mensajeVal);
            errorPopup();
        }
    }
    const closePopup = () => {        
        setPopupVisible(false);
        navigation.navigate('InicioResponsable');        
    };

    const handleSelect = (value) => {
        setSexo(value);
    };




    const guardarVisitante = async () => {

        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const cedResponsable = user.cedUsuario;
        let visitante;
        visitante = JSON.stringify({
            cedResponsable: cedResponsable,
            cedVisitante: Number(documento),
            persona: {
                cedulaPersona: Number(documento),
                nombrePersona: nombres,
                apellidos: apellidos,
                fechaNacimiento: fechaNacimiento,
                email: email,
                telefono: telefono,
                direccion: domicilio,
                sexo: sexo
            }

        }),
        addMisVisitantes(user.passKey, visitante)
        .then(datos => {
            if (datos.status === 200) {
                setMensaje("Visitante agregado correctamente");
                openPopup();
                limpiarCampos();
           /*  } else if (datos.status === 409) {
                setMensaje("Visitante ya existente.");
                errorPopup(); */
            } else {
                setMensaje("Revise datos");
                errorPopup();
            }
        })

    }

    useEffect(() => {
        if (documento.length === 8) {
            const fetchear = async () => {
                try {
                    const userString = await AsyncStorage.getItem("user");
                    const user = JSON.parse(userString);
                    getPersonaByCedula(user.passKey, documento)
                        .then(datos => {                            
                            if (datos != "Persona no encontrada") {
                                //setDocumento(datos.cedulaPersona);
                                setNombre(datos.nombrePersona);
                                setApellido(datos.apellidos);
                                setEmail(datos.email);
                                setTelefono(datos.telefono);
                                setDomicilio(datos.direccion);
                                setFechaNacimiento(new Date(datos.fechaNacimiento));
                                handleSelect(datos.sexo);
                            }
                        })
                } catch (error) { }

            }
            fetchear();
        }
    }, [documento]);
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
                        <TextInput
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
                            value={sexo}
                            onChangeText={(sexo) => setSexo(sexo)}
                            placeholder={'Sexo'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />
                        <InputText
                            value={email}
                            onChangeText={(email) => setEmail(email)}
                            placeholder={'Email'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
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
                        <ParentescoPicker
                            value={parentesco}
                            onChange={(parentesco) => setParentesco(parentesco)}
                        />

                        <Button
                            title="Agregar"
                            onPress={agregarVisitante}
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
    input: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        fontSize: 16,
        marginTop: 10,
    },
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
        backgroundColor: 'rgba(255, 255, 255,0.7)',
        padding: 15,
        borderRadius: 20,
        paddingBottom: 30
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 10,
    },
});

export default AgregarVisitante;
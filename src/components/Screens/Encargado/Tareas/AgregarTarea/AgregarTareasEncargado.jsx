import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import Button from "../../../../UI/Button";
import InputText from "../../../../UI/InputText";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from 'react-native-elements';
import { addTarea } from "../../../../../api/conections";
import SelectResidentes from "../SelectResidentes";
import ContainerView from "../../../../UI/ContainerView";
import FechaByLabel from "../../../../UI/FechaByLabel";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";

const AgregarTareasEncargado = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [horaTarea, setHoraTarea] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [repetir, setRepetir] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null); //residente seleccionado
    const [mensaje, setMensaje] = useState('');
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);

    const errorPopup = () => {
        setErrorPopupVisible(true);
    }

    const closErrorPopup = () => {
        setErrorPopupVisible(false);
    }

    const openPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {

        setPopupVisible(false);
    };

    const handleDateChangeHoraTarea = (horaTarea) => {

        setHoraTarea(horaTarea);
    };

    const handleSelectResidente = (value) => {
        setSelectedValue(value); // Aquí actualizamos el valor seleccionado en el estado
    };

    const handleRepetir = () => {
        setRepetir(!repetir); // Cambiar el estado a lo opuesto del estado actual
    };

    const handleGuardarTarea = () => {
        if (nombre != "" && descripcion != "" && horaTarea != "") {
            guardarTarea();
        } else {
            setMensaje('Debes ingresar un nombre, hora y descripción de la tarea');
            errorPopup();
        }
    }
    const limpiarDatos = () => {
        setNombre('');
        setDescripcion('');
        setHoraTarea('');
        setRepetir(false);
        setSelectedValue(null);
    }
    const guardarTarea = async () => {
        //Armar objeto para enviar por api 
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const cedEncargado = user.cedUsuario;

        if (nombre != "" && descripcion != "" && horaTarea != "") {
            let tarea = null;
            if (selectedValue === null) {
                tarea = JSON.stringify({
                    cedulaPersonal: cedEncargado,
                    seRepite: repetir,
                    nombreTarea: nombre,
                    descripcion: descripcion,
                    diaDeTarea: horaTarea
                });

            } else {

                tarea = JSON.stringify({
                    cedulaPersonal: cedEncargado,
                    seRepite: repetir,
                    nombreTarea: nombre,
                    cedulaResidente: selectedValue,
                    descripcion: descripcion,
                    diaDeTarea: horaTarea
                });
            }
            addTarea(user.passKey, tarea, false)
                .then(datos => {
                    if (datos.status === 200) {
                        setMensaje("Tarea agregada correctamente");
                        openPopup();
                        limpiarDatos();
                    } else {
                        setMensaje("Algo ha salido mal, intentelo más tarde");
                        errorPopup();
                    }
                });
        }
    };

    return (
        <ContainerView>


            <View style={styles.innerContainer}>
                <InputText
                    value={nombre}
                    onChangeText={(nombre) => setNombre(nombre)}
                    placeholder={'Nombre'}
                    backgroundColor="#FFFFFF"
                    textColor="#000000"
                />
                <View style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#808080',
                    marginTop: 10,
                }}>
                    <TextInput
                        value={descripcion}
                        style={{padding:5, borderRadius:5}}
                        onChangeText={(descripcion) => setDescripcion(descripcion)}
                        placeholder={'Descripción'}
                        backgroundColor="#FFFFFF"
                        textColor="#000000"
                        multiline
                        numberOfLines={4}
                    />
                </View>
                <SelectResidentes onSelectResidente={handleSelectResidente} selectedValue={selectedValue} />

                <FechaByLabel
                    dateField={horaTarea}
                    onConfirmDate={(date) => handleDateChangeHoraTarea(date)}
                    placeholder='Hora a realizarse'
                    modeFormat={'datetime'}
                />
                <View style={{ paddingBottom: 15, paddingTop: 20 }}>

                    <CheckBox
                        title="Repetir"
                        checked={repetir}
                        onPress={handleRepetir}
                        uncheckedColor="#000000"
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderWidth: 0 }}
                        textStyle={{ fontSize: 16, color: "#000000" }}
                    />

                </View>
                <Button
                    title="Crear"
                    onPress={handleGuardarTarea}
                    backgroundColor="#FC4F4F"
                    textColor="#000000"
                />
                <Popup
                    visible={popupVisible}
                    onClose={closePopup}
                    title={mensaje}
                    content=""
                />
                <ErrorPopup
                    visible={errorPopupVisible}
                    onClose={closErrorPopup}
                    content={mensaje}
                />

            </View>

        </ContainerView>
    )
}

const styles = StyleSheet.create({
    innerContainer: {
        backgroundColor: 'rgba(255,255,255, 0.60)',
        padding: 18,
        borderRadius: 20,
        padding: 10,
    },
});

export default AgregarTareasEncargado;

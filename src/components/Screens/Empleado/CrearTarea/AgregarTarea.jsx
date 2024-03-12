import React from "react";
import { StyleSheet, Text, View, Alert, Dimensions, ScrollView } from 'react-native';
import { useState, useEffect, dispatch } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../../../UI/Button";
import InputText from "../../../UI/InputText";
import Popup from "../../../UI/PopUps/PopUp";
import { guardarResidentes } from "../../../../features/residentesSlice";
import { useDispatch, useSelector } from "react-redux";
import ContainerView from "../../../UI/ContainerView";
import { getAllResidentes, getAllResidentesActivos } from "../../../../api/conections";
import { Picker } from "@react-native-picker/picker";
import TextArea from "../../../UI/TextArea";
import ErrorPopup from "../../../UI/PopUps/ErrorPopUp";
import { addTarea } from "../../../../api/conections";

const AgregarTarea = () => {

    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const containerHeigth = screenHeight * 0.8;

    const [nombreTarea, setNombreTarea] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [pickResidente, setPickResidente] = useState('');
    const [selectedValue, setSelectedValue] = useState(''); //residentes

    const [popupVisible, setPopupVisible] = useState(false);
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);

    const dispatch = useDispatch();
    const [mensaje, setMensaje] = useState(["Esperando datos"]);
    const residentes = useSelector(state => state.residentes.residentes);
    useEffect(() => {
        const fetchear = async () => {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            getAllResidentesActivos(user.passKey)
                .then(datos => {
                    dispatch(guardarResidentes(datos));
                })
        }
        fetchear();
    }, []);
    // Función para manejar la selección de un botón de opción



    const HandleAgregarTarea = () => {

        if (nombreTarea != '' && descripcion != '') {
            if (pickResidente != '') {
                if (selectedValue != '') {

                    guardarTarea();

                } else {
                    setMensaje('Selecciona un residente asociado a la tarea')
                    errorPopup();
                }
            } else {
                guardarTarea();
            }
        } else {
            setMensaje("El nombre de la tarea y la descripción no pueden estar vacíos.")
            errorPopup();
        }

    }

    const limpiarDatos = () => {
        setNombreTarea('');
        setDescripcion('');
        setPickResidente('');
        setSelectedValue('');
    }

    const handleSelect = (value) => {
        setSelectedValue(value);
    };

    const closErrorPopup = () => {
        setErrorPopupVisible(false);
    }
    //cuando se apreta el boton, los comandos del popup:
    const openPopup = () => {
        setPopupVisible(true);
    };

    const errorPopup = () => {
        setErrorPopupVisible(true);
    }

    const closePopup = () => {
        setPopupVisible(false);
    };


    const guardarTarea = async () => {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const ced = user.cedUsuario;
        let tarea;
        const dateNative = new Date();
        const miDate = new Date(dateNative.getTime() - (3 * 60 * 60 * 1000));
        if (!pickResidente) {
            tarea = JSON.stringify({
                cedulaPersonal: ced,
                diaDeTarea: miDate,
                seRepite: false,
                nombreTarea: nombreTarea,
                cedulaResidente: null,
                descripcion: descripcion,

            });
        } else {
            tarea = JSON.stringify({
                cedulaPersonal: ced,
                diaDeTarea: miDate,
                seRepite: false,
                nombreTarea: nombreTarea,
                cedulaResidente: selectedValue,
                descripcion: descripcion,
            });
        }
        addTarea(user.passKey, tarea, true)
            .then(datos => {
                if (datos.status === 200) {
                    setMensaje("Tarea agregada correctamente");
                    openPopup();
                    limpiarDatos();
                } else {
                    setMensaje("Algo ha salido mal, intentelo más tarde");
                    errorPopup();
                }
            })
    }

    return (
        <ContainerView>
            <View style={{ alignItems: 'center', flex:1, justifyContent:'flex-start'}}>


                <ScrollView>
                    <View style={styles.innerContainer}>

                        <View style={{ width: screenWidth * 0.8}}>
                            <Text style={styles.text}>Agregar Tarea</Text>


                            <InputText
                                value={nombreTarea}
                                onChangeText={(nombreTarea) => setNombreTarea(nombreTarea)}
                                placeholder={'Nombre de la tarea'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />

                            <View style={styles.usuarioContainer}>
                                <Picker style={styles.usuarioContainer.pick} selectedValue={pickResidente} onValueChange={(c) => setPickResidente(c)}>
                                    <Picker.Item key={"r-1"} value={''} label="¿Es para un Residente?" />
                                    <Picker.Item key={"residenteNO"} value={true} label={"SI es para un Residente"} />
                                    <Picker.Item key={"residenteSI"} value={false} label={"NO es para residente"} />
                                </Picker>
                            </View>
                            {pickResidente == true ?
                                <View style={styles.usuarioContainer}>
                                    <Picker
                                        style={styles.usuarioContainer.pick}
                                        selectedValue={selectedValue}
                                        onValueChange={handleSelect}
                                    >
                                        <Picker.Item key="r-1" value="-1" label="Seleccione residente" />
                                        {residentes.map(r => <Picker.Item key={r.cedulaPersona} value={r.cedulaPersona} label={r.nombrePersona + " " + r.apellidos + " " + r.cedulaPersona} />)}
                                    </Picker>
                                </View>
                                : null
                            }

                            <View style={{ paddingBottom: 50 }}>
                                <TextArea
                                    placeholder={"Indique descripción de la tarea....."}
                                    textColor="#000000"
                                    backgroundColor="#FFFFFF"
                                    value={descripcion}
                                    onChangeText={(descripcion) => setDescripcion(descripcion)}
                                    numeroDeLineas={6}
                                />
                            </View>



                            <Button
                                title="Agregar"
                                onPress={HandleAgregarTarea}
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
            </View>
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
    usuarioContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#808080',
        fontSize: 16,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        pick: {
            color: '#696969'
        }
    },
    innerContainer: {
        maxHeight: 700,
        maxWidth: 700,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 18,
        borderRadius: 20,
    },
});

export default AgregarTarea;
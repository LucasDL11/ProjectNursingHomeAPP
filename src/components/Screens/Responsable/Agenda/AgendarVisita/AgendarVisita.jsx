import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from "react";
import Button from "../../../../UI/Button";
import TextoArea from "../../../../UI/TextArea";
import Popup from "../../../../UI/PopUps/PopUp";
import { CheckBox } from 'react-native-elements';
import { getMisVisitantesByCedulaResponsable, addAgenda, getResidenteByResponsable } from "../../../../../api/conections";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerComponent from "../../../../UI/DateTimePicker";
import ContainerView from "../../../../UI/ContainerView";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";
import FechaByLabel from "../../../../UI/FechaByLabel";

const AgendarVisita = ({ navigation }) => {
    const [motivoDeVisita, setMotivoDeVisita] = useState('');
    const [visitantesSeleccionados, setVisitantesSeleccionados] = useState([]);
    const [visitantesDisponibles, setVisitantesDisponibles] = useState([]);
    const [popupAgregarVisitanteVisible, setPopupAgregarVisitanteVisible] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [mensaje, setMensaje] = useState([""]);
    const [selectedDateFechaVisita, setSelectedDateFechaVisita] = useState(null);

    //cuando se apreta el boton, los comandos del popup:
    const openPopup = () => {
        setPopupVisible(true);
    };
    const closePopup = () => {
        setPopupVisible(false);
    };

    const openPopupAgregarVisitante = () => {
        buscarVisitantesDelResponsable();
        setPopupAgregarVisitanteVisible(true);
    };
    const closePopupAgregarVisitante = () => {
        setPopupAgregarVisitanteVisible(false);
    };
    const closeEndPopUp = () => {
        //navigation.navigate('InicioResponsable');
        setPopupVisible(false);
    }

    const errorPopup = () => {
        setErrorPopupVisible(true);
    }
    const closErrorPopup = () => {
        setErrorPopupVisible(false);
        setMensaje("");
    }

    const handleDateChangeFechaVisita = (selectedDateFechaVisita) => {
        setSelectedDateFechaVisita(selectedDateFechaVisita);

    };

    const dividirFechaYHora = (fechaYhora) => {
        const [fecha, horaYmin] = fechaYhora.split("T");
        const [horas, minutos] = horaYmin.split(":");
        const mensajeFecha = "Se efectuará el día "
        const mensajeHora = " a las "
        return { fecha: mensajeFecha.concat(fecha), hora: mensajeHora.concat(horas, ":", minutos, "hs") };
    };

    const [selectedOptions, setSelectedOptions] = useState([]);

    const agregarVisitante = () => {
        closePopupAgregarVisitante();
        navigation.navigate('AgregarVisitante');
    }
    const limpiarCampos = () => {
        setMotivoDeVisita('');
        setVisitantesSeleccionados([]);
        setSelectedDateFechaVisita(null);
        setSelectedOptions([]);
    }
    const esMayorAdosDias = (fecha) => {
        const fechaActual = new Date();
        const fechaFuturo = new Date();
        fechaFuturo.setDate(fechaActual.getDate() + 2);

        const selectedDate = new Date(fecha);

        return selectedDate > fechaFuturo;
    };

    const handleGuardarVisita = () => {

        if (selectedDateFechaVisita == null) {
            setMensaje("Debe seleccionar una fecha para la visita")
            errorPopup();
            return;
        }

        if (motivoDeVisita == '') {
            setMensaje('Debe indicar el motivo de la visita');
            errorPopup();
            return;
        }

        if (!esMayorAdosDias(selectedDateFechaVisita)) {
            setMensaje('La antelación de la visita no puede ser menor a dos días a partir de la fecha');
            errorPopup();
            return;
        }
        //setMensaje('Se envió la solicitu de visita. \n Tenga en cuenta que la misma está sujeta a aprobación.');
        guardarVisita();
        //openPopup();        
    }

    const guardarVisita = async () => {
        //Armar objeto para enviar por api 
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const cedResponsable = user.cedUsuario;
        let nuevaAgenda = JSON.stringify({
            cedResidente: 1,
            fechaYHora: selectedDateFechaVisita,
            cedResponsable: cedResponsable,
            visitantesAgenda: visitantesJson(),
            motivoDeVisita: motivoDeVisita
        })        
        addAgenda(user.passKey, nuevaAgenda)
            .then(datos => {
                if (datos.status === 200) {
                    setMensaje('Se envió la solicitud de visita. \n Tenga en cuenta que la misma está sujeta a aprobación.');
                    openPopup();
                    limpiarCampos();
                } else {
                    setMensaje('Error al agendar');
                    errorPopup();
                }
            });

    }


    const visitantesJson = () => {

        let misVisitantesJson = [];
        for (let i = 0; i < visitantesSeleccionados.length; i++) {

            let nuevoVisitante = {

                cedula: visitantesSeleccionados[i].persona.cedulaPersona
            }

            misVisitantesJson.push(nuevoVisitante);

        }

        return misVisitantesJson;

    }


    const buscarVisitantesDelResponsable = async () => {
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const cedResponsable = user.cedUsuario;
        try {

            getMisVisitantesByCedulaResponsable(user.passKey, cedResponsable)
                .then(r => r.json())
                .then(datos => {
                    if(datos.length > 0){
                    setVisitantesDisponibles(datos);
                    }else{
                        setVisitantesDisponibles([]);
                    }
                });
        } catch (error) {

           // console.log(error)

        }
    }
    useEffect(() => {
        buscarVisitantesDelResponsable();
    }, []);

    useEffect(() => {
        setVisitantesSeleccionados(selectedOptions);
    }, [selectedOptions]);
    return (
        <ContainerView>

            <View style={styles.container}>
                <View style={styles.innerContainer}>

                    <View>
                        <FechaByLabel
                            dateField={selectedDateFechaVisita}
                            onConfirmDate={handleDateChangeFechaVisita}
                            placeholder={'Seleccione fecha'}
                            modeFormat={"datetime"}
                        />
                        {/*<View style={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 20 }}>

                            <Text style={styles.fecha}>Fecha: </Text>
                            <DateTimePickerComponent
                                onConfirm={handleDateChangeFechaVisita}
                                modeFormat={"datetime"}
                            />
                        </View>*/}
                        <Text style={{ textAlign: "center" }}> {selectedDateFechaVisita ? dividirFechaYHora(selectedDateFechaVisita.toISOString()).fecha : ''}</Text>
                        <Text style={{ textAlign: "center", paddingBottom: 20 }} > {selectedDateFechaVisita ? dividirFechaYHora(selectedDateFechaVisita.toISOString()).hora : ''}</Text>
                        <View style={{ paddingBottom: 20 }}>
                            <TextoArea

                                placeholder={"Indique motivo de visita....."}
                                textColor="#000000"
                                backgroundColor="#FFFFFF"
                                value={motivoDeVisita}
                                onChangeText={(motivoDeVisita) => setMotivoDeVisita(motivoDeVisita)}
                                numeroDeLineas={5}
                            />

                            {visitantesSeleccionados.map(r => <Text key={r.cedVisitante}>{r.cedVisitante + " - " + r.persona.nombrePersona + " " + r.persona.apellidos}</Text>)}
                        </View>

                        <TouchableOpacity style={styles.button} onPress={openPopupAgregarVisitante}>
                            <Image source={require("../../../../Imgs/nuevo.png")} style={styles.imagen} />
                            <Text style={styles.buttonText}>  Agregar Visitantes  </Text>
                        </TouchableOpacity>
                        {
                            <Popup
                                visible={popupAgregarVisitanteVisible}
                                onClose={closePopupAgregarVisitante}
                                style={styles.container}
                                title="Seleccione Visitantes"
                                content={


                                    <View style={styles.innerinnerContainer}>
                                        <Button
                                            title="Agregar nuevo Visitante"
                                            onPress={agregarVisitante}
                                            backgroundColor="#FC4F4F"
                                            textColor="#000000"
                                        />
                                        {visitantesDisponibles.length > 0 ? (
                                            visitantesDisponibles.map((r) => (
                                                <CheckBox
                                                    key={r.cedVisitante}
                                                    title={"- " + r.persona.nombrePersona + " " + r.persona.apellidos}
                                                    checked={selectedOptions.includes(r)}
                                                    onPress={() => {
                                                        const updatedOptions = [...selectedOptions];

                                                        if (selectedOptions.includes(r)) {
                                                            const index = updatedOptions.indexOf(r);
                                                            updatedOptions.splice(index, 1);
                                                        } else {
                                                            updatedOptions.push(r);
                                                        }

                                                        setSelectedOptions(updatedOptions);
                                                        setVisitantesSeleccionados(updatedOptions);
                                                        console.log(visitantesSeleccionados);
                                                    }}
                                                    uncheckedColor="#000000"
                                                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderWidth: 0 }}
                                                    textStyle={{ fontSize: 16, color: "#000000" }}
                                                />
                                            ))
                                        ) :
                                            (
                                                <Text style={{marginTop:20}}>Sin visitantes para agregar</Text>
                                            )
                                        }


                                    </View>


                                }
                            />
                        }
                    </View>

                </View>
                <Popup
                    visible={popupVisible}
                    onClose={closePopup}
                    style={styles.container}
                    content={mensaje}
                    title={"Solicitud enviada"}
                />
                <Button

                    title="Realizar agenda"
                    onPress={handleGuardarVisita}
                    backgroundColor="#FC4F4F"
                    textColor="#000000"
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
    imagen: {
        width: 35,
        height: 35,
        resizeMode: 'cover',

    },
    button: {
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#FC4F4F",
        flexDirection: "row"

    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#000000"
    },
    fecha: {
        color: '#000000',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 10
    },
    text: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 20,

    },
    container: {
        flex: 1,
        justifyContent: 'center',

    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 16,
        borderRadius: 20,
        paddingBottom: 40
    },
    innerinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(225, 175, 137,0.8)',
        padding: 16,
        borderRadius: 20,
        paddingBottom: 40
    },
});

export default AgendarVisita;
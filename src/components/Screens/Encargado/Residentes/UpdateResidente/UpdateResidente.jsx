import React from "react";

import { View, Text, StyleSheet, Dimensions, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState, useRef } from "react"; import { useDispatch } from "react-redux";
import Button from "../../../../UI/Button"
import InputText from "../../../../UI/InputText";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDetalleResidenteByCedula, updateResidente } from "../../../../../api/conections";
import FechaByLabel from "../../../../UI/FechaByLabel";
import validarCampos from "../../../../UI/Validaciones/validaciones";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";
import dividirFechaYHora from "../../../../UI/Utils/utils";
import ContainerView from "../../../../UI/ContainerView";
import FilePicker from "../../../../UI/InputFile";

const UpdateResidente = ({ navigation, route }) => {
    const screenHeight = Dimensions.get('window').height;
    const lineSize = screenHeight * 0.2;
    const [email, setEmail] = useState('');
    const [nombres, setNombre] = useState('');
    const [apellidos, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [sexo, setSexo] = useState('');

    const [emergenciaMovil, setEmergenciaMovil] = useState('');
    const [sociedadMedica, setSociedadMedica] = useState('');
    const [curatela, setCuratela] = useState('');

    const [responsable, setResponsable] = useState('');
    const [pickfechaNacimiento, setpickFechaNacimiento] = useState('');
    const [patologias, setPatologias] = useState([]);
    const [patologiasNombre, setPatologiasNombre] = useState('');
    const [patologiasObservaciones, setPatologiasObservaciones] = useState('');
    const [pickCuratela, setPickCuratela] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);

    const [popupPatologiasVisible, setPopupPatologiasVisible] = useState(false);

    const [mensaje, setMensaje] = useState('');
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [archivos, setArchivos] = useState([])
    const dispatch = useDispatch();
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
    const openPopupPatologias = () => {
        setPopupPatologiasVisible(true);
    };

    const closePopupPatologias = () => {
        //enviarSolicitud();
        setPopupPatologiasVisible(false);
    };

    const handlePatologiaChange = (index, field, value) => {
        let updatedPatologias = [...patologias];
        updatedPatologias[index] = {
            ...updatedPatologias[index],
            [field]: value,
        };
        setPatologias(updatedPatologias);
    };

    const manejarPatologias = () => {
        if (patologiasNombre !== "" && patologiasObservaciones !== "") {
            let arregloPatologias = [...patologias];
            arregloPatologias.push({ nombre: patologiasNombre, observaciones: patologiasObservaciones })
            setPatologias(arregloPatologias);
        }
    }


    const crearResidente = async () => {
        try {
            //Armar objeto para enviar por api 
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const cedResponsable = user.cedUsuario;
            if (documento !== "" && nombres !== "" && apellidos !== ""
                && fechaNacimiento !== ""
                && telefono !== "" &&
                domicilio !== "" && sexo !== "" && emergenciaMovil !== "" && sociedadMedica !== "") {
                let residente = JSON.stringify({
                    cedulaPersona: Number(documento),
                    nombrePersona: nombres,
                    apellidos: apellidos,
                    fechaNacimiento: new Date(pickfechaNacimiento ? pickfechaNacimiento : fechaNacimiento),
                    telefono: telefono,
                    direccion: domicilio,
                    sexo: sexo,
                    emergenciaMovil: emergenciaMovil,
                    sociedadMedica: sociedadMedica,
                    cedulaResponsable: responsable,
                    patologiasCronica: patologias,
                    curatela: curatela
                    ,documentos: cursos
                })
                
                const response = await updateResidente(user.passKey, residente); // Pasa el token de autenticación en lugar de null si es necesario
                
                if (response.status === 200) {
                    navigation.navigate("DetalleResidente", { documento });

                } else {
                    setMensaje('Error al actualizar residente, intentelo más tarde');
                    errorPopup();
                }
            }
        } catch (error) {
            setMensaje('Error al actualizar residente, intentelo más tarde');
            errorPopup();

        }
    }
    const updateArchivo = async (index, nuevoValor,base64Data) => {                   
        cursos[index].tipoArchivo = "." + tipoArchivo(nuevoValor.mimeType, "/");    
        if(cursos[index].nombreDocumento != '' && cursos[index].descripcion != ''){         
        if(cursos[index].tipoArchivo.toLowerCase() === ".pdf" 
        || cursos[index].tipoArchivo.toLowerCase() === ".jpeg"
        || cursos[index].tipoArchivo.toLowerCase() === ".jpg"){                      
        cursos[index].archivoBase64=base64Data   
        setMensaje("Archivo añadido con éxito");
        openPopup();
    }else{
        setMensaje("Solo puede subir archivos con extension .pdf o .jpeg. Este archivo no será subido.");        
        eliminarArchivo(index);
        errorPopup();
    }
    }else{
        setMensaje("Verifique datos del documento. Este archivo no será subido.");        
        eliminarArchivo(index);
        errorPopup();
     }    
    }

    const tipoArchivo = (cadena, identificador) => {
        let nuevaCadena = ""
        for (let i = 0; i < cadena.length; i++) {
            if (cadena[i] === identificador) {
                nuevaCadena = cadena.substring([i + 1], cadena.length)
            }
        }
        return nuevaCadena;
    }

    const addCurso = () => {
        var curso = {
            cedulaPersona: documento,
            esCurso: true,
            nombreDocumento: '',
            archivoBase64: '',
            tipoArchivo: '',
            descripcion: ''
        }
        setCursos([...cursos, curso]);
        setArchivos([...archivos, []])
        }
    const handleChangeNombreDocumento = (nombreCurso, index) => {
        const nuevosCursos = [...cursos];
        nuevosCursos[index].nombreDocumento = nombreCurso;
        setCursos[nuevosCursos]   
    }
    const handleChangeDescripcion = (descripcion, index) => {
        const nuevosCursos = [...cursos];
        nuevosCursos[index].descripcion = descripcion;
        setCursos(nuevosCursos);
    };
    const eliminarArchivo = (index) => {
        const nuevosItems = cursos.filter(item => item !== cursos[index])
        setCursos(nuevosItems);
        const nuevosArchivos = archivos.filter(item => item !== archivos[index])
        setArchivos(nuevosArchivos);
    }
    useEffect(() => {
        const fetchear = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                const user = JSON.parse(userString);
                getDetalleResidenteByCedula(user.passKey, route.params.recibeCedula)
                    .then(datos => {
                        if (datos != "Persona no encontrada") {
                            setDocumento(route.params.recibeCedula);
                            setNombre(datos.nombrePersona);
                            setApellido(datos.apellidos);
                            setEmail(datos.email);
                            setTelefono(datos.telefono);
                            setDomicilio(datos.direccion);
                            setFechaNacimiento(datos?.fechaNacimiento);
                            setSexo(datos.sexo);
                            setSociedadMedica(datos.sociedadMedica);
                            setEmergenciaMovil(datos.emergenciaMovil);
                            setCuratela(datos?.curatela);
                            setPatologias(datos?.patologiasCronica);
                            setResponsable(datos.cedulaResponsable);
                            setPickCuratela(datos?.tieneCuratela)
                        }
                    })
            } catch (error) {
                setMensaje('Error al eliminar residente, intentelo más tarde');
                errorPopup();
            }

        }
        fetchear();
    }
        , []);

    return (

        <ContainerView>

            <ScrollView>
                <View style={[styles.innerContainer]}>
                    <View style={{ padding: 10 }}>

                        <View>
                            <Text style={styles.text}>Nombres</Text>
                            <InputText
                                value={nombres}
                                onChangeText={(nombres) => setNombre(nombres)}
                                placeholder={'Nombres:'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />
                            <Text style={styles.text}>Apellidos</Text>
                            <InputText
                                value={apellidos}
                                onChangeText={(apellidos) => setApellido(apellidos)}
                                placeholder={'Apellidos:'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />

                            <Text style={styles.text}>Sexo</Text>
                            <InputText
                                value={sexo}
                                onChangeText={(sexo) => setSexo(sexo)}
                                placeholder={'Sexo'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />

                            <Text style={styles.text}>Fecha de nacimiento</Text>
                            <FechaByLabel
                                dateField={pickfechaNacimiento}
                                onConfirmDate={(date) => setpickFechaNacimiento(date)}
                                placeholder={fechaNacimiento ? dividirFechaYHora(fechaNacimiento).fecha : ''}
                            />

                            <Text style={styles.text}>Email</Text>
                            <InputText
                                value={email}
                                onChangeText={(email) => setEmail(email)}
                                placeholder={'Email'}
                                backgroundColor={'#FFFFFF'}
                            />

                            <Text style={styles.text}>Teléfono</Text>
                            <InputText
                                value={telefono}
                                onChangeText={(telefono) => setTelefono(telefono)}
                                placeholder={'Teléfono'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />

                            <Text style={styles.text}>Domicilio</Text>
                            <InputText
                                value={domicilio}
                                onChangeText={(domicilio) => setDomicilio(domicilio)}
                                placeholder={'Domicilio'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />

                            <Text style={styles.text}>Emergencia móvil</Text>
                            <InputText
                                value={emergenciaMovil}
                                onChangeText={(emergenciaMovil) => setEmergenciaMovil(emergenciaMovil)}
                                placeholder={'Emergencia Movil:'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />

                            <Text style={styles.text}>Socieda Médica</Text>
                            <InputText
                                value={sociedadMedica}
                                onChangeText={(sociedadMedica) => setSociedadMedica(sociedadMedica)}
                                placeholder={'Sociedad Medica:'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
                            />

                            <Text style={styles.text}>Curatela</Text>
                            <View style={styles.usuarioContainer}>
                                <Picker
                                    style={styles.usuarioContainer.pick}
                                    selectedValue={pickCuratela}
                                    onValueChange={(c) => {
                                        setPickCuratela(c);
                                        if (!c) {
                                            setCuratela(null);
                                        }
                                    }}>
                                    <Picker.Item key="r-1" value={''} label="¿Tiene Curatela?" />
                                    <Picker.Item key={"CuratelaSI"} value={true} label={"SI tiene Curatela"} />
                                    <Picker.Item key={"CuratelaSI"} value={false} label={"NO tiene Curatela"} />
                                </Picker>
                            </View>
                            {pickCuratela == true ?
                                <FechaByLabel
                                    dateField={curatela}
                                    onConfirmDate={(date) => setCuratela(date)}
                                    placeholder={'Seleccione'}
                                />
                                : null
                            }

                            {patologias && patologias.length > 0 ? (
                                <>
                                    <Text style={styles.patologiasText}>Patologías:</Text>
                                    {patologias.map((pc, index) => (
                                        <View style={styles.patologiasContainer} key={pc?.idPatologiaCronica}>
                                            <Text style={styles.text}>Nombre:</Text>
                                            <InputText
                                                value={pc?.nombre}
                                                onChangeText={(nombre) => handlePatologiaChange(index, "nombre", nombre)}
                                                placeholder={'Nombre'}
                                                backgroundColor="#FFFFFF"
                                                textColor="#000000"
                                            />
                                            <Text style={styles.text}>Observaciones:</Text>
                                            <TextInput
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: '#808080', borderRadius: 5, padding: 5
                                                }}
                                                value={pc?.observaciones}
                                                onChangeText={(observaciones) => handlePatologiaChange(index, "observaciones", observaciones)}
                                                placeholder={'Observaciones'}
                                                backgroundColor="#FFFFFF"
                                                textColor="#000000"
                                                multiline
                                                numberOfLines={4}
                                            />
                                        </View>
                                    ))}
                                </>
                            ) : (
                                <Text style={styles.text}>El residente no tiene patologías ingresadas</Text>
                            )}



                            <Button
                                title="Agregar patologia"
                                onPress={openPopupPatologias}
                                backgroundColor="#FC4F4F"
                                textColor="#000000"
                            />
                            <Button
                            title="Agregar Documentos"
                            onPress={addCurso}
                            backgroundColor="#FC4F4F"
                            textColor="#000000"
                        />

                        {cursos.map((c, index) => (
                            <View key={index}>
                                <InputText
                                    value={cursos[index].nombreCurso}
                                    onChangeText={(nombreDocumento) => handleChangeNombreDocumento(nombreDocumento, index)}
                                    placeholder={'Nombre documento'}
                                    backgroundColor="#FFFFFF"
                                    textColor="#000000"
                                />

                                <InputText
                                    value={cursos[index].descripcion}
                                    onChangeText={(descripcion) => handleChangeDescripcion(descripcion, index)}
                                    placeholder={'Descripción'}
                                    backgroundColor="#FFFFFF"
                                    textColor="#000000"
                                />

                                <FilePicker title={"Seleccione Archivo"} updateArchivo={updateArchivo} index={index} />
                                <Button
                            title="Eliminar archivo" 
                           // onPress={eliminarArchivo(index)}
                           onPress={()=>{eliminarArchivo(index)}}
                            backgroundColor="#FC4F4F"
                            textColor="#000000"
                        />
                            </View>))}
                            <Button
                                title="Actualizar residente"
                                onPress={crearResidente}
                                backgroundColor="#FC4F4F"
                                textColor="#000000"
                            />
                            <Popup
                                visible={popupVisible}
                                onClose={closePopup}
                                title=""
                                content={mensaje}
                            />

                            <Popup
                                visible={popupPatologiasVisible}
                                onClose={closePopupPatologias}
                                title=""
                                content={
                                    <View style={styles.container}>
                                        <View style={styles.innerContainer}>
                                            <Text style={styles.tituloPat}>Ingreso de patología:</Text>
                                            <InputText value={patologiasNombre}
                                                onChangeText={(patologiasNombre) => setPatologiasNombre(patologiasNombre)}
                                                placeholder={'Nombre'}
                                                backgroundColor="#FFFFFF"
                                                textColor="#000000"                                                
                                            />
                                            <Text/>
                                            <TextInput
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: '#808080', 
                                                    borderRadius: 5, 
                                                    padding: 5,
                                                }}
                                                value={patologiasObservaciones}
                                                onChangeText={(patologiasObservaciones) => setPatologiasObservaciones(patologiasObservaciones)}
                                                placeholder={'Observaciones'}
                                                backgroundColor="#FFFFFF"
                                                textColor="#000000"
                                                multiline
                                                numberOfLines={4}
                                            />
                                            <Button
                                                title="Agregar patologia"
                                                onPress={manejarPatologias}
                                                backgroundColor="#FC4F4F"
                                                textColor="#000000"
                                                value={{ nombre: patologiasNombre, observaciones: patologiasObservaciones }}
                                            />
                                        
                                        </View>
                                    </View>
                                } />

                        </View>

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
    text: {
        color: '#000000',
        fontSize: 14,
        paddingTop: 15,
    },
    patologiasText: {
        color: '#000000',
        fontSize: 16,
        paddingTop: 15,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        //backgroundColor: '#FFBC80',
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    patologiasContainer: {
        backgroundColor: 'rgba(255,255,255,0)',
        padding: 10,
    },
    tituloPat: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    innerContainer: {
        paddingBottom: 50,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 18,
        borderRadius: 20,
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
});

export default UpdateResidente;
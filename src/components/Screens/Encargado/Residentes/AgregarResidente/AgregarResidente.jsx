import React from "react";

import { View, Text, StyleSheet, Dimensions, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../../../UI/Button"
import InputText from "../../../../UI/InputText";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerComponent from "../../../../UI/DateTimePicker";
import { addResidente } from "../../../../../api/conections";
import FechaByLabel from "../../../../UI/FechaByLabel";
import ContainerView from "../../../../UI/ContainerView";
import validarCampos from "../../../../UI/Validaciones/validaciones";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";
import FilePicker from "../../../../UI/InputFile";

const AgregarResidente = () => {
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
    const [pickCuratela, setPickCuratela] = useState(null);

    const [patologias, setPatologias] = useState([]);
    const [patologiasNombre, setPatologiasNombre] = useState('');
    const [patologiasObservaciones, setPatologiasObservaciones] = useState('');

    const [popupVisible, setPopupVisible] = useState(false);

    const [popupPatologiasVisible, setPopupPatologiasVisible] = useState(false);
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [archivos, setArchivos] = useState([])
    const [cursos, setCursos] = useState([]);

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


    const onPressAgregarResidente = () => {

        const mensajeVal = validarCampos(
            documento,
            nombres,
            apellidos,
            fechaNacimiento,
            telefono,
            sexo,
            "parentesco",
            domicilio,
            email
        );

        if (pickCuratela == null) {
            setMensaje(mensajeVal + "\nIndique si el residente posee curatela.");
            errorPopup();
            return;
        }
        if (mensajeVal === "") {
            //crearResidente();
            crearResidente();
            return;
        } else {
            setMensaje(mensajeVal);
            errorPopup();
            return;
        }

    }


    const manejarPatologias = () => {
        if(patologiasNombre != '' && patologiasObservaciones != ''){
        let arregloPatologias = [...patologias];
        arregloPatologias.push({ nombre: patologiasNombre, observaciones: patologiasObservaciones })
        setPatologias(arregloPatologias);
        setMensaje("Patologia agregada");
        setPatologiasNombre('');
        setPatologiasObservaciones('');        
        openPopup();
        }else{
            setMensaje("Verifique datos");
            errorPopup();
        }
    }

    const crearResidente = async () => {
        //Armar objeto para enviar por api 
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const cedResponsable = user.cedUsuario;
        if (documento !== '') {
            let nuevoResidente = JSON.stringify({    
                cedulaPersona: Number(documento),
                nombrePersona: nombres,
                apellidos: apellidos,
                fechaNacimiento: fechaNacimiento,
                email: email,
                telefono: telefono,
                direccion: domicilio,
                sexo: sexo,
                emergenciaMovil: emergenciaMovil,
                sociedadMedica, sociedadMedica,
                //responsable: responsable,
                documento: documento,
                tieneCuratela: pickCuratela,                            
                documentos: cursos,                
                patologiasCronica: patologias
            })            
            addResidente(user.passKey, nuevoResidente)
                .then(datos => {
                    if (datos.status === 200) {
                        openPopup();
                        setMensaje("Solicitud de usuario enviada con exito. Nos comunicaremos a la brevedad"); 
                        limpiarCampos();
                    } else {
                        setMensaje("Error al añadir residente, verifique datos");
                        errorPopup();
                    }
                })
} else {
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
    const addCurso = () => {
        var curso = {
            cedulaPersona: documento,
            esCurso: false,
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
    const limpiarCampos = () => {
        setDocumento('');
                            setNombre('');
                            setApellido('');
                            setEmail('');
                            setTelefono('');
                            setDomicilio('');
                            setFechaNacimiento('');
                            setSexo('');
                            setSociedadMedica('');
                            setEmergenciaMovil('');                            
                            setCuratela('');
                            setPickCuratela(null);
                            setPatologias([]);
                            setCursos([]);
        setArchivos([]);
        }
    return (
        <ContainerView>

            <ScrollView>

                <View style={styles.innerContainer}>


                    <View>                        

                        <InputText
                            maxLength={8}
                            value={documento}
                            onChangeText={(documento) => setDocumento(documento)}
                            placeholder={'Documento'}
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
                            placeholder='Fecha de nacimiento'
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

                        <InputText
                            value={email}
                            onChangeText={(email) => setEmail(email)}
                            placeholder={'Email'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />

                        <InputText
                            value={emergenciaMovil}
                            onChangeText={(emergenciaMovil) => setEmergenciaMovil(emergenciaMovil)}
                            placeholder={'Emergencia Movil'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />
                        <InputText
                            value={sociedadMedica}
                            onChangeText={(sociedadMedica) => setSociedadMedica(sociedadMedica)}
                            placeholder={'Sociedad Medica'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />


                        <View style={styles.usuarioContainer}>
                            <Picker style={styles.usuarioContainer.pick} selectedValue={pickCuratela} onValueChange={(c) => setPickCuratela(c)}>
                                <Picker.Item key="r-1" value={''} label="¿Tiene Curatela?" />
                                <Picker.Item key={"CuratelaSI"} value={true} label={"SI tiene Curatela"} />
                                <Picker.Item key={"CuratelaSI"} value={false} label={"NO tiene Curatela"} />
                            </Picker>
                        </View>
                                                
                        <Button
                            title="Agregar patología"
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
                            </View>


                        ))}


                        <Button
                            title="Ingresar"
                            onPress={onPressAgregarResidente}
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
                            content=
                            {<View style={styles.container}>
                                <View style={styles.innerContainer}>
                                    <Text>Ingreso de patologia:</Text>
                                    <InputText value={patologiasNombre}
                                        onChangeText={(patologiasNombre) => setPatologiasNombre(patologiasNombre)}
                                        placeholder={'Nombre:'}
                                        backgroundColor="lightgray"
                                        textColor="#000000"
                                    />
                                    <TextInput value={patologiasObservaciones}
                                        onChangeText={(patologiasObservaciones) => setPatologiasObservaciones(patologiasObservaciones)}
                                        placeholder={'Observaciones:'}
                                        backgroundColor="lightgray"
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
                            </View>}
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
    container: {
        flex: 1,
        //backgroundColor: '#FFBC80',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        paddingBottom: 50,
        backgroundColor: 'rgba(255, 255, 255,0.7)',
        padding: 18,
        borderRadius: 20,
    },
});

export default AgregarResidente;
import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState, useRef } from "react"; import { useDispatch } from "react-redux";
import Button from "../../../../UI/Button"
import InputText from "../../../../UI/InputText";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerComponent from "../../../../UI/DateTimePicker";
import { getResponsableByCedula, updateResponsable } from "../../../../../api/conections";
import FechaByLabel from "../../../../UI/FechaByLabel";
import ContainerView from "../../../../UI/ContainerView";
import dividirFechaYHora from "../../../../UI/Utils/utils";
import ParentescoPicker from "../../../../UI/Picker/ParentescoPicker";
import FilePicker from "../../../../UI/InputFile";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";

const UpdateResponsable = ({ navigation, route }) => {

    const [email, setEmail] = useState('');
    const [nombres, setNombre] = useState('');
    const [apellidos, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [sexo, setSexo] = useState('');
    const [parentesco, setParentesco] = useState('');
    const [residente, setResidente] = useState('');
    const [pickfechaNacimiento, setpickFechaNacimiento] = useState(fechaNacimiento);
    const [curatela, setCuratela] = useState(null);
    const [pickCuratela, setPickCuratela] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [archivos, setArchivos] = useState([])
    const [popupVisible, setPopupVisible] = useState(false);
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [mensaje, setMensaje] = useState(["Esperando datos"]);
    const [archivoCuratela, setArchivoCuratela] = useState(null);
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

    const enviarUpdate = async () => {
        try {
            // Armar objeto para enviar por api
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const cedResponsable = user.cedUsuario;

            if (documento !== "" && nombres !== "" && apellidos !== "" && email !== "" && telefono !== "" && sexo !== "" &&
            residente !== "" && parentesco !== "") {
            let responsable;
            if(pickCuratela){
              
                responsable = JSON.stringify({
                cedulaPersona: Number(documento),
                nombrePersona: nombres,
                apellidos: apellidos,
                fechaNacimiento: fechaNacimiento,
                email: email,
                telefono: telefono,
                direccion: domicilio,
                sexo: sexo,
                parentesco: {
                    cedulaResidente: residente,
                    cedulaResponsable: Number(documento),
                    nombreParentesco: parentesco
                },
                curatela: {
                    fechaCuratela: curatela,
                    curatelaResponsable: Number(documento),
                    curatelaResidente: residente,
                    documentoCuratela : archivoCuratela
                },
                documentos: cursos
                
            })
        }else{
            responsable = JSON.stringify({
                cedulaPersona: Number(documento),
                nombrePersona: nombres,
                apellidos: apellidos,
                fechaNacimiento: fechaNacimiento,
                email: email,
                telefono: telefono,
                direccion: domicilio,
                sexo: sexo,
                parentesco: {
                    cedulaResidente: residente,
                    cedulaResponsable: Number(documento),
                    nombreParentesco: parentesco
                },
                documentos: cursos
            })
        }  
        const response = await updateResponsable(user.passKey, responsable); // Pasa el token de autenticación en lugar de null si es necesario

                if (response.status === 200) {
                    setMensaje("Actualizado con éxito");
                    openPopup()
                    navigation.navigate("DetalleFamiliar", { documento });                    
                } else {
                  
                    setMensaje('Ha ocurrido un error en la respuesta del servidor');
                    errorPopup();
                }
            }else{
                setMensaje('Verifique datos');
                    errorPopup();
            }
        } catch (error) {
           
            setMensaje('Ha ocurrido un error');
            errorPopup();
        }
    };
    const updateArchivo = async (index, nuevoValor, base64Data) => {
        cursos[index].tipoArchivo = "." + tipoArchivo(nuevoValor.mimeType, "/");
        if (cursos[index].nombreDocumento != '' && cursos[index].descripcion != '') {
            if (cursos[index].tipoArchivo.toLowerCase() === ".pdf"
                || cursos[index].tipoArchivo.toLowerCase() === ".jpeg"
                || cursos[index].tipoArchivo.toLowerCase() === ".jpg") {
                cursos[index].archivoBase64 = base64Data
                setMensaje("Archivo añadido con éxito");
                openPopup();
            } else {
                setMensaje("Solo puede subir archivos con extension .pdf o .jpeg. Este archivo no será subido.");
                eliminarArchivo(index);
                errorPopup();
            }
        } else {
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
                getResponsableByCedula(user.passKey, route.params.recibeCedula)
                    .then(datos => {
                        
                        if (datos != "Persona no encontrada") {
                            setDocumento(datos.cedulaPersona);
                            setNombre(datos.nombrePersona);
                            setApellido(datos.apellidos);
                            setEmail(datos.email);
                            setTelefono(datos.telefono);
                            setDomicilio(datos.direccion);
                            setFechaNacimiento(datos?.fechaNacimiento);
                            setSexo(datos.sexo);
                            setResidente(datos?.parentesco?.cedulaResidente?.toString());
                            setParentesco(datos?.parentesco?.nombreParentesco);
                            setCuratela(new Date(datos?.curatela?.fechaCuratela));
                            setPickCuratela(datos?.residente?.tieneCuratela);
                        }
                    })
            } catch (error) { }

        }
        fetchear();
    }, []);
    const updateCuratela = async (index, nuevoValor,base64Data) => {
        var nuevoArchivo=  {
            cedulaPersona: documento,
            esCurso: false,
            nombreDocumento: 'Curatela',
            archivoBase64:base64Data ,
            tipoArchivo: "." + tipoArchivo(nuevoValor.mimeType, "/"),
            descripcion: 'Cuartela pertenciente al residente ' + residente
        }     
            if(nuevoArchivo.tipoArchivo.toLowerCase() === ".pdf" 
            || nuevoArchivo.tipoArchivo.toLowerCase() === ".jpeg"
            || nuevoArchivo.tipoArchivo.toLowerCase() === ".jpg"){
                
       setArchivoCuratela(nuevoArchivo);
            setMensaje("Curatela añadida con éxito");
            openPopup();
        }else{
            setMensaje("Solo puede subir archivos con extension .pdf o .jpeg. Este archivo no será subido.");
            errorPopup();
        }    
       
    }
    return (
        <ContainerView>

            <ScrollView>
                <View style={styles.innerContainer}>
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
                            {<FechaByLabel
                                dateField={pickfechaNacimiento}
                                onConfirmDate={(date) => setpickFechaNacimiento(date)}
                                placeholder={fechaNacimiento ? dividirFechaYHora(fechaNacimiento)?.fecha : ''}
                            />}


                            <Text style={styles.text}>Email</Text>
                            <InputText
                                value={email}
                                onChangeText={(email) => setEmail(email)}
                                placeholder={'Email'}
                                backgroundColor="#FFFFFF"
                                textColor="#000000"
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
                            <Text style={styles.text}>Residente</Text>
                        <InputText
                            value={residente}
                            onChangeText={(residente) => setResidente(residente)}
                            placeholder={'Documento Residente'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />
                            <Text style={styles.text}>Parentesco con residente</Text>
                            <ParentescoPicker
                                value={parentesco}
                                onChange={(parentesco) => setParentesco(parentesco)}
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
                                    }}
                                >
                                    <Picker.Item key="r-1" value={false} label="NO tiene Curatela" />
                                    <Picker.Item key="r-2" value={true} label="SI tiene Curatela" />
                                </Picker>
                            </View>

                            {pickCuratela ? (
                                <FechaByLabel
                                    dateField={curatela}
                                    onConfirmDate={(date) => setCuratela(date)}
                                    placeholder={'Seleccione'}
                                />
                            ) : null}


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
                                        onPress={() => { eliminarArchivo(index) }}
                                        backgroundColor="#FC4F4F"
                                        textColor="#000000"
                                    />
                                </View>


                            ))}
                            <Button
                                title="Actualizar responsable"
                                onPress={enviarUpdate}
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
                </View>
            </ScrollView>
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
        justifyContent: "space-between",
    },
    patologiasContainer: {
        backgroundColor: '#FBCDAF',
        padding: 10,
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

export default UpdateResponsable;
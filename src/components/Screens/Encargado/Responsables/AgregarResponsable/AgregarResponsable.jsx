import React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState, useRef } from "react"; import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../UI/Button"
import InputText from "../../../../UI/InputText";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerComponent from "../../../../UI/DateTimePicker";
import { addResponsable } from "../../../../../api/conections";
import FechaByLabel from "../../../../UI/FechaByLabel";
import ContainerView from "../../../../UI/ContainerView";
import validarCampos from "../../../../UI/Validaciones/validaciones";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";
import ParentescoPicker from "../../../../UI/Picker/ParentescoPicker";
import FilePicker from "../../../../UI/InputFile";

const AgregarResponsable = () => {

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
    const [parentesco, setParentesco] = useState('');
    const [residente, setResidente] = useState('');
    const [archivoCuratela, setArchivoCuratela] = useState('');

    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);

    const [curatela, setCuratela] = useState('');
    const [pickCuratela, setPickCuratela] = useState(null);
    const [archivos, setArchivos] = useState([])
    const [cursos, setCursos] = useState([]);

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

    const onPressAgregarResidente = () => {

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

        if (residente == '') {
            setMensaje(mensajeVal + "\nIndique el residente asociado.");
            errorPopup();
            return;
        }
         if (mensajeVal === "") {
            enviarSolicitud();
            //openPopup();
            return;
        } else {
            setMensaje(mensajeVal);
            errorPopup();
            return;
        } 

    }


    const enviarSolicitud = async () => {
        //Armar objeto para enviar por api 
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const cedResponsable = user.cedUsuario;
        if (documento !== "" && nombres !== "" && apellidos !== "" && email !== "" && telefono !== "" && sexo !== "" &&
            residente !== "" && parentesco !== "") {
            let nuevoResponsable;
            if(pickCuratela){
            nuevoResponsable = JSON.stringify({
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
            nuevoResponsable = JSON.stringify({
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
      
            addResponsable(user.passKey, nuevoResponsable)
                .then(datos => {
                    if (datos.status === 200) {      
                        setMensaje("Alta de responsable exitosa");
                        openPopup();
                        limpiarCampos()
                    } else {        
                        setMensaje("Ha ocurrido un error");                
                    errorPopup();
                    }
                })
        } else {
            setMensaje("Verifique datos");   
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
        setEmail('');
        setPickCuratela(null);     
         setArchivos([]);
        setCursos([]);
        setNombre('');
        setApellido ('');
       setDocumento('');
        setFechaNacimiento('');
       setTelefono('');
      setDomicilio('');
       setSexo('');
        setParentesco('');
        setResidente('');
    setArchivoCuratela('');    
        setCuratela('');

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
                            value={residente}
                            onChangeText={(residente) => setResidente(residente)}
                            placeholder={'Documento Residente'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />

                        <ParentescoPicker
                            value={parentesco}
                            onChange={(parentesco) => setParentesco(parentesco)}
                        />


                        <View style={styles.usuarioContainer}>
                            <Picker style={styles.usuarioContainer.pick} selectedValue={pickCuratela} onValueChange={(c) => setPickCuratela(c)}>
                                <Picker.Item key="r-1" value={''} label="¿Tiene Curatela?" />
                                <Picker.Item key={"CuratelaSI"} value={true} label={"SI tiene Curatela"} />
                                <Picker.Item key={"CuratelaSI"} value={false} label={"NO tiene Curatela"} />
                            </Picker>
                        </View>
                        {pickCuratela == true ?
                        <View> 
 <FechaByLabel
                                dateField={curatela}
                                onConfirmDate={(date) => setCuratela(date)}
                                placeholder='Fecha Curatela'
                            />
                            <FilePicker title={"Seleccione Curatela"} updateArchivo={updateCuratela} index={null} />
                        </View>
                           
                            : null
                        }
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
        paddingBottom: 50,
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 18,
        borderRadius: 20,
    },
});

export default AgregarResponsable;
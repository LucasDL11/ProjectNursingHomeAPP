import React from "react";
import { StyleSheet, Text, View, Alert, TextInput, ScrollView } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState, useRef } from "react"; import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../UI/Button";
import InputText from "../../../../UI/InputText";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addPersonal, getAllTiposUsuario, addUsuario } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import FechaByLabel from "../../../../UI/FechaByLabel";
import FilePicker from "../../../../UI/InputFile";
import validarCampos from "../../../../UI/Validaciones/validaciones";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";


const AgregarEmpleado = () => {

    const [nombres, setNombre] = useState('');
    const [apellidos, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [cursos, setCursos] = useState([]);
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(null);
    const [telefono, setTelefono] = useState('');
    const [archivos, setArchivos] = useState([])
    const [password, setPassword] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [sexo, setSexo] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [fechaVencimientoCarnetBromatologia, setFechaVencimientoCarnetBromatologia] = useState('');
    const [fechaVencimientoCarnetSalud, setFechaVencimientoCarnetSalud] = useState('');
    const [tiposDeUsuarios, setTiposDeUsuarios] = useState([]);
    const [carnetDeVacunas, setCarnetDeVacunas] = useState('');
    const [tipoUsuarioSeleccionado, setTipoDeUsuarioSeleccionado] = useState('')
    const [mensaje, setMensaje] = useState('');
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);


    const errorPopup = () => {
        setErrorPopupVisible(true);
    }
    const closeErrorPopup = () => {
        setErrorPopupVisible(false);
    }


    const dispatch = useDispatch();
    //cuando se apreta el boton, los comandos del popup:


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
        
        const limpiarCampos = () => {
            setNombre('');
           setApellido('');
            setDocumento('');
            setCursos([]);
            setEmail('');
            setFechaNacimiento(null);
            setTelefono('');
            setArchivos([])
           setPassword('');
            setDomicilio('');
           setSexo('');            
          setFechaVencimientoCarnetBromatologia('');
           setFechaVencimientoCarnetSalud('');
            setCarnetDeVacunas('');
            setTipoDeUsuarioSeleccionado('')
            }
    useEffect(() => {
        const cargarTipos = async () => {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const cedulaPersonal = user.cedUsuario;
            try {
                getAllTiposUsuario(user.passKey, cedulaPersonal)
                    .then(r => r.json())
                    .then(datos => {
                        datos.splice(3)
                        datos.splice(0, 1)
                        setTiposDeUsuarios(datos);
                    });
            } catch (error) {
                setMensaje("Error al cargar tipos de usuario");
                errorPopup();
            }
        }
        cargarTipos();
    }, []);

    const openPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const handleSelect = (value) => {
        return value
    };

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

    const onPressAgregarPersonal = () => {
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
        if (carnetDeVacunas === '') {               
            setMensaje(mensajeVal + "\nDebes ingresar si tiene carnet de vacunas.");
            errorPopup();
            return;
        }
        if (fechaVencimientoCarnetSalud === '') {               
            setMensaje(mensajeVal + "\nDebes ingresar fecha de vencimiento de caret de salud.");
            errorPopup();
            return;
        }
        if (mensajeVal === "") {
            guardarPersonal();
            return;
        } else {
            setMensaje(mensajeVal);
            errorPopup();
            return;
        }

    }

    const guardarPersonal = async () => {    
        const userString = await AsyncStorage.getItem("user");
        const user = JSON.parse(userString);
        const cedEncargado = user.cedUsuario;
        let nuevoPersonal;
        nuevoPersonal = JSON.stringify({
            cedulaPersona: documento,
            nombrePersona: nombres,
            apellidos: apellidos,
            fechaNacimiento: new Date(fechaNacimiento),
            email: email,
            telefono: telefono,
            direccion: domicilio,
            sexo: sexo,
            fechaVencimientoCarnetDeSalud: new Date(fechaVencimientoCarnetSalud),
            fechaVencimientoCarnetBromatologia: new Date(fechaVencimientoCarnetBromatologia),
            carnetDeVacunas: carnetDeVacunas,
            documentos: cursos
        })
        setMensaje('')
        try {
            const datos = await addPersonal(user.passKey, nuevoPersonal);            
            if(datos.status === 200){
                setMensaje("Empleado añadido con éxito");
                openPopup();
            limpiarCampos();
            }else{
                setMensaje("Error al añadir empleado, verifique datos");
                errorPopup();
            }
            /* const nuevoUsuario = JSON.stringify(
                {
                    cedula: documento,
                    pass: password,
                    primerPass: true,
                    idTipoUsuario: tipoUsuarioSeleccionado,
                    tipoUsuario: null,
                    persona: null,
                    tokenUsuario: null
                });
            addUsuario(user.passKey, nuevoUsuario) */
        } catch (error) {
            setMensaje(error)
            errorPopup();
        }
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
{/*                         <InputText
                            value={password}
                            onChangeText={(password) => setPassword(password)}
                            placeholder={'Password temporal'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        /> */}

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
{/*                         <View style={styles.usuarioContainer}>
                            <Picker style={styles.usuarioContainer.pick} selectedValue={tipoUsuarioSeleccionado} onValueChange={(tipoUsuarioSeleccionado) => setTipoDeUsuarioSeleccionado(handleSelect(tipoUsuarioSeleccionado))}>
                                <Picker.Item key="r-1" value="-1" label="Seleccione Tipo de usuario" />

                                {tiposDeUsuarios.map(r =>


                                    <Picker.Item key={r.idTipoUsuario} value={r.idTipoUsuario} label={r.nombreTipoUsuario} />)}

                            </Picker>
                        </View> */}

                        <FechaByLabel
                            dateField={fechaNacimiento}
                            onConfirmDate={setFechaNacimiento}
                            placeholder='Fecha de nacimiento'
                        />

                        <InputText
                            value={sexo}
                            onChangeText={(sexo) => setSexo(sexo)}
                            placeholder={'Sexo'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />

                        <View style={styles.usuarioContainer}>

                            <Picker style={styles.usuarioContainer.pick} selectedValue={carnetDeVacunas} onValueChange={(carnet) => setCarnetDeVacunas(carnet)}>
                                <Picker.Item key="r-1" value='' label="Tiene carnet de vacunas?" />
                                <Picker.Item key={"CarnetSi"} value={true} label={"SI tiene carnet de vacunas"} />
                                <Picker.Item key={"CarnetNo"} value={false} label={"NO tiene carnet de vacunas"} />
                            </Picker>
                        </View>
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

                        <FechaByLabel
                            dateField={fechaVencimientoCarnetBromatologia}
                            onConfirmDate={(date) => setFechaVencimientoCarnetBromatologia(date)}
                            placeholder='Fecha Carnet Bromatología'
                        />

                        <FechaByLabel
                            dateField={fechaVencimientoCarnetSalud}
                            onConfirmDate={(date) => setFechaVencimientoCarnetSalud(date)}
                            placeholder='Fecha Carnet de Salud'
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
                            title="Ingresar Empleado"
                            onPress={onPressAgregarPersonal}
                            backgroundColor="#FC4F4F"
                            textColor="#000000"
                        />

                        <ErrorPopup
                            visible={errorPopupVisible}
                            onClose={closeErrorPopup}
                            content={mensaje}
                        />
                        <Popup
                            visible={popupVisible}
                            onClose={closePopup}
                            title=""
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
        paddingBottom: 50
    },
    innerContainer: {
        paddingBottom: 50,
        backgroundColor: 'rgba(255,255,255, 0.60)',
        padding: 18,
        borderRadius: 20,
    },
    dates: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingEnd: 60,
        paddingBottom: 10,
        paddingTop: 20
    },
    imagen: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        marginRight: -50,
    }
});



export default AgregarEmpleado;
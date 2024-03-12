import React from "react";
import { StyleSheet, Text, View, Alert, TextInput, ScrollView } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState, useRef } from "react"; import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../UI/Button";
import InputText from "../../../../UI/InputText";
import Popup from "../../../../UI/PopUps/PopUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addPersonal, getAllTiposUsuario, addUsuario, getDetalleEmpleadoByCedula, updatePersonal } from "../../../../../api/conections";
import ContainerView from "../../../../UI/ContainerView";
import FechaByLabel from "../../../../UI/FechaByLabel";
import FilePicker from "../../../../UI/InputFile";
import validarCampos from "../../../../UI/Validaciones/validaciones";
import ErrorPopup from "../../../../UI/PopUps/ErrorPopUp";
import dividirFechaYHora from "../../../../UI/Utils/utils";

const UpdateEmpleado = ({ navigation, route }) => {

    const [nombres, setNombre] = useState('');
    const [apellidos, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [cursos, setCursos] = useState([]);
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [pickfechaNacimiento, setpickFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [archivos, setArchivos] = useState([])
    const [password, setPassword] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [sexo, setSexo] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [fechaVencimientoCarnetBromatologia, setFechaVencimientoCarnetBromatologia] = useState('');
    const [pickFechaVencimientoCarnetBromatologia, setPickFechaVencimientoCarnetBromatologia] = useState('');
    const [fechaVencimientoCarnetSalud, setFechaVencimientoCarnetSalud] = useState('');
    const [pickFechaVencimientoCarnetSalud, setPickFechaVencimientoCarnetSalud] = useState('');
    const [tiposDeUsuarios, setTiposDeUsuarios] = useState([]);
    const [carnetDeVacunas, setCarnetDeVacunas] = useState('');
    const [tipoUsuarioSeleccionado, setTipoDeUsuarioSeleccionado] = useState('')
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [mensaje, setMensaje] = useState('')

    const errorPopup = () => {
        setErrorPopupVisible(true);
    }
    const closErrorPopup = () => {
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
                setMensaje("Error al cargar agendas, intentelo más tarde");                
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


    const onPressUpdatePersonal = () => {

        const mensajeVal = validarCampos(
            "88888888",
            nombres,
            apellidos,
            pickfechaNacimiento ? pickfechaNacimiento : fechaNacimiento,
            telefono,
            sexo,
            "parentesco",
            domicilio,
            email
        );

        if (mensajeVal === "") {
            enviarUpdate();
            return;
        } else {
            setMensaje(mensajeVal);
            errorPopup();
            return;
        }
    }

    const enviarUpdate = async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const cedEncargado = user.cedUsuario;
            let personal;
            personal = JSON.stringify({
                cedulaPersona: documento,
                nombrePersona: nombres,
                apellidos: apellidos,
                fechaNacimiento: new Date(pickfechaNacimiento ? pickfechaNacimiento : fechaNacimiento),
                email: email,
                telefono: telefono,
                direccion: domicilio,
                sexo: sexo,
                fechaVencimientoCarnetDeSalud: new Date(pickFechaVencimientoCarnetSalud ? pickFechaVencimientoCarnetSalud : fechaVencimientoCarnetBromatologia),
                fechaVencimientoCarnetBromatologia: new Date(pickFechaVencimientoCarnetBromatologia ? pickFechaVencimientoCarnetBromatologia : fechaVencimientoCarnetBromatologia),
                carnetDeVacunas: carnetDeVacunas,
                documentos: cursos
            })
            const response = await updatePersonal(user.passKey, personal); // Pasa el token de autenticación en lugar de null si es necesario
            if (response.status === 200) {                
                navigation.navigate("DetalleEmpleado", { documento } );
                setMensaje("Actualizado correctamente");                
                openPopup();
            } else {
            setMensaje("Verifique datos");                
            errorPopup();
            }
        } catch (error) {
            setMensaje("Error al enviar actualización, intentelo más tarde");                
            errorPopup();
        }

    }


    useEffect(() => {
        const fetchear = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                const user = JSON.parse(userString);
                getDetalleEmpleadoByCedula(user.passKey, route.params.recibeCedula)
                    .then(datos => {
                        //if (datos != "Persona no encontrada") {
                        setDocumento(datos.cedulaPersona);
                        setNombre(datos.nombrePersona);
                        setApellido(datos.apellidos);
                        setEmail(datos.email);
                        setTelefono(datos.telefono);
                        setDomicilio(datos.direccion);
                        setFechaNacimiento(datos?.fechaNacimiento);
                        setSexo(datos.sexo);
                        setCarnetDeVacunas(datos?.carnetDeVacunas);
                        setFechaVencimientoCarnetSalud(datos?.fechaVencimientoCarnetDeSalud);
                        setFechaVencimientoCarnetBromatologia(datos?.fechaVencimientoCarnetBromatologia);
                        //setCursos(datos.documentos);
                        //  }
                    })
            } catch (error) { 
                setMensaje("Error al obtener detalles del empleado, intentelo más tarde");                
                errorPopup();
            }

        }
        fetchear();
    }, []);



    return (
        <ContainerView>

            <ScrollView>

                <View style={styles.innerContainer}>

                    <View>
                        {/*                         <InputText
                            maxLength={8}
                            value={documento}
                            onChangeText={(documento) => setDocumento(documento)}
                            placeholder={'Documento'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"

                        /> */}

                        {/*                         <InputText
                            value={password}
                            onChangeText={(password) => setPassword(password)}
                            placeholder={'Password temporal'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        /> */}


                        <Text style={styles.text}>Nombres</Text>
                        <InputText
                            value={nombres}
                            onChangeText={(nombres) => setNombre(nombres)}
                            placeholder={'Nombres'}
                            backgroundColor="#FFFFFF"
                            textColor="#000000"
                        />
                        <Text style={styles.text}>Apellidos</Text>
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
                            placeholder={fechaNacimiento ? dividirFechaYHora(fechaNacimiento).fecha : 'Fecha de nacimiento'}
                        />
                        {/* 
                        <View style={styles.usuarioContainer}>
                        
                        <Picker style={styles.usuarioContainer.pick} selectedValue={carnetDeVacunas} onValueChange={(carnet) => setCarnetDeVacunas(carnet)}>
                        <Picker.Item key="r-1" value='' label="Tiene carnet de vacunas?" />
                        <Picker.Item key={"CarnetSi"} value={true} label={"SI tiene carnet de vacunas"} />
                        <Picker.Item key={"CarnetNo"} value={false} label={"NO tiene carnet de vacunas"} />
                        </Picker>
                        </View> 
                        */}


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

                        <Text style={styles.text}>Vencimiento cartet de Bormatología</Text>
                        <FechaByLabel
                            dateField={pickFechaVencimientoCarnetBromatologia}
                            onConfirmDate={(date) => setPickFechaVencimientoCarnetBromatologia(date)}
                            placeholder={fechaVencimientoCarnetBromatologia ? dividirFechaYHora(fechaVencimientoCarnetBromatologia).fecha : ''}
                        />

                        <Text style={styles.text}>Vencimiento cartet de Salud</Text>
                        <FechaByLabel
                            dateField={pickFechaVencimientoCarnetSalud}
                            onConfirmDate={(date) => setPickFechaVencimientoCarnetSalud(date)}
                            placeholder={fechaVencimientoCarnetSalud ? dividirFechaYHora(fechaVencimientoCarnetSalud).fecha : ''}
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
                            title="Actualizar Empleado"
                            onPress={onPressUpdatePersonal}
                            backgroundColor="#FC4F4F"
                            textColor="#000000"
                        />

                        <ErrorPopup
                            visible={errorPopupVisible}
                            onClose={closErrorPopup}
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
        fontSize: 14,
        paddingTop: 15,
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
        backgroundColor: 'rgba(255,255,255,0.8)',
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



export default UpdateEmpleado;
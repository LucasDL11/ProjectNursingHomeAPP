import React, {useState, useEffect} from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getTerminosYCondiciones } from "../../../../../api/conections";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Documento = () => {
    const fecha = new Date();    
    const fechaActual = fecha.toLocaleDateString("en-GB");    
    const [terminosYCondiciones, setTerminosYCondiciones] = useState('');

    const obtenerTerminosYCondiciones = async () => {
        try {
            getTerminosYCondiciones()
                .then(datos => {                
                    const terminos = datos.terminos;                    
                    setTerminosYCondiciones(terminos.replace("(indicar fecha)", fechaActual));   
                    })
                
        } catch (error) {
            //console.log(error)
        }    
    }
    useEffect(() => {
        obtenerTerminosYCondiciones();
    }, []);

    return (

        <ScrollView>
            <View>
                <Text style={{fontSize: 20, fontWeight: 'bold', padding:5}}>CLAUSULA DE CONSENTIMIENTO INFORMADO</Text>
                <Text style={{fontSize: 16, padding:5}}> {terminosYCondiciones}</Text>
            </View>
        </ScrollView>
    );

}

export default Documento;
import React, { useState, useEffect } from "react";
import { StyleSheet,View } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { guardarResidentes } from "../../../../features/residentesSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllResidentesActivos } from "../../../../api/conections";
const SelectResidentes = ({ onSelectResidente, selectedValue }) => {
    const residentes = useSelector(state => state.residentes.residentes);
    const dispatch = useDispatch();


    const handleSelect = (value) => {
        onSelectResidente(value); // Llamamos a la función que recibimos como prop para enviar el valor seleccionado
    };
    useEffect(() => {
        const fetchResidentes = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                const user = JSON.parse(userString);
                
                getAllResidentesActivos(user.passKey)
                    .then(datos => {
                        dispatch(guardarResidentes(datos));
                    });
            } catch (error) {
                
            }
        };
        fetchResidentes();
    }, []);

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={handleSelect}
            >
                <Picker.Item key="select-resident" value={null} label="Seleccione residente" />
                {residentes.map(residente => (
                    <Picker.Item key={residente.cedulaPersona} value={residente.cedulaPersona} label={`${residente.nombrePersona} ${residente.apellidos} ${residente.cedulaPersona}`} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
            
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#808080',
        fontSize: 16,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
    },
    text: {
        color: '#000000',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 20,
    },
});

export default SelectResidentes;

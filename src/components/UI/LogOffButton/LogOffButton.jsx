import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { logOff } from '../../../api/conections';
import { useLogin } from '../../../context/LoginPovider/LoginProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const LogOffButton = () => {
    
    const { setIsLoggedIn, setProfile } = useLogin();
    const cerrarSesion = async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const response = await logOff(user.passKey, user.cedUsuario);
            console.log(setIsLoggedIn);
            // Actualiza el estado de autenticación y perfil
            setIsLoggedIn(false);
            setProfile({});

            // Limpia el almacenamiento local
            await AsyncStorage.clear();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <TouchableOpacity style={styles.button} onPress={() => {
            // alert con las opciones "Aceptar" y "Cancelar"
            Alert.alert(
                '¿Deseas cerrar sesión?',
                '',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        onPress: () => cerrarSesion(),
                    },
                ],
            );
        }}>
            <Image
                source={require('../../Imgs/cerrarsesion.png')}
                style={{ width: 30, height: 30 }}
            />
            <Text>Salir</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#F76E11',
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
});

export default LogOffButton;
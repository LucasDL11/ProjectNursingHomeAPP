import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { DrawerItemList } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../../../../../context/LoginPovider/LoginProvider';
import { logOff } from '../../../../../api/conections';
import { Alert } from 'react-native';



const TopImg = (props) => {

    const { setIsLoggedIn, setProfile } = useLogin();
    const cerrarSesion = async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const response = await logOff(user.passKey, user.cedUsuario);

        } catch {
            //console.log("Error al cerrar sesion")
        }
        AsyncStorage.clear();
        setIsLoggedIn(false);
        setProfile({});
        //navigation.navigate('Iniciar sesion');
    };

    return (
        <View style={styles.container}>
            {/* Encabezado o logotipo */}
            <View>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../../Imgs/logo.jpg')}
                        style={styles.logoImage}
                    />
                </View>

                {/* Opciones del menú */}
                <DrawerItemList {...props} />
            </View>

            {/* Botón Cerrar sesión */}
            <TouchableOpacity
                style={styles.exittButton}
                onPress={() => {
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
                }}
            >
                <Image
                    source={require('../../../../Imgs/cerrarsesion.png')}
                    style={styles.icon}
                />
                <Text style={styles.exitButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    logoContainer: {
        backgroundColor: '#F59F65',
        padding: 20,
        alignItems: 'center',
        borderRadius: 15,
    },
    logoImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    exittButton: {
        backgroundColor: 'rgba(247, 110, 17, 0.4)',
        padding: 10,
        margin: 10,
        flexDirection: 'row',
        borderRadius: 5
    },
    exitButtonText: {
        padding: 10,
        marginLeft: 10,
        color: '#000000',
    },
    icon: {
        width: 35,
        height: 35,
    }
});

export default TopImg;

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Linking } from 'react-native';
import ContainerView from '../../../UI/ContainerView';
const SobreNosotros = ({ navigation }) => {
    const openMap = () => {
        // Aquí debes proporcionar la URL correcta para abrir el mapa en la aplicación de mapas
        //const mapUrl = 'https://www.google.com/maps?q=Tu+Dirección+Aquí';
        const mapUrl = 'https://www.google.com/maps/place/Residencial+A%C3%B1os+Luz/@-34.9036013,-56.1690878,17z/data=!4m6!3m5!1s0x959f81070ec93d15:0x3ac0553de17659c!8m2!3d-34.9035221!4d-56.1676287!16s%2Fg%2F11t16bykyj?entry=ttu';
        Linking.openURL(mapUrl);
    };

    const openEmail = () => {
        const email = 'resialuz@gmail.com';
        const subject = 'Consulta desde la app';
        const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
        Linking.openURL(emailUrl);
    };

    return (
        <ContainerView>

            <View style={styles.container}>
                <View>

                    <Text style={styles.title}>Contáctenos</Text>
                    {/* Enlace a Facebook */}
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=100083109531568')}
                        style={styles.socialLink}
                    >
                        <Image
                            source={require('../../../Imgs/facebook.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.socialText}>Visita nuestro Facebook</Text>
                    </TouchableOpacity>

                    {/* Enlace a Instagram */}
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://instagram.com/aluzresidencialadultomayor?igshid=NzZhOTFlYzFmZQ==')}
                        style={styles.socialLink}
                    >
                        <Image
                            source={require('../../../Imgs/instagram.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.socialText}>Síguenos en Instagram</Text>
                    </TouchableOpacity>

                    
                    {/* Número de Teléfono */}
                    <TouchableOpacity
                        onPress={() => Linking.openURL('tel:+598 96 114 078')}
                        style={styles.contactLink}
                    >
                        <Image
                            source={require('../../../Imgs/tel.png')}
                            style={styles.icon}
                        />
                        <View style={{ flexDirection: "column", alignItems: 'center' }}>

                            <Text style={styles.contactText}>Llama a nuestro contacto</Text>
                            <Text style={styles.contactText}> +598 96 114 078 </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Dirección */}
                    <TouchableOpacity onPress={openMap} style={styles.contactLink}>
                        <Image
                            source={require('../../../Imgs/map.png')}
                            style={styles.icon}
                        />
                        <View style={{ flexDirection: "column", alignItems: 'center' }}>

                            <Text style={styles.contactText}> Ver en el mapa nuestra dirección</Text>
                            <Text style={styles.contactText}> Juan Paulier 1330</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Mail */}
                    <TouchableOpacity onPress={openEmail} style={styles.contactLink}>
                        <Image
                            source={require('../../../Imgs/gmail.png')}
                            style={styles.icon}
                        />
                        <View style={{ flexDirection: "column", alignItems: 'center' }}>

                            <Text style={styles.contactText}>Envíanos un mail con tu consulta</Text>
                            <Text style={styles.contactText}>resialuz@gmail.com</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </ContainerView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        paddingBottom: 30,
        maxHeight: 500
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        textAlign:'center',      
        fontWeight: 'bold',
    },
    socialLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20
    },
    socialText: {
        marginLeft: 10,
    },
    contactLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20
    },
    contactText: {
        marginLeft: 10,
    },
    icon: {
        width: 35,
        height: 35,
    },
});


export default SobreNosotros;
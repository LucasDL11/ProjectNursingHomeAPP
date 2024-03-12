import React from "react";
import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';

const ContainerView = ({ children }) => {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ImageBackground
                source={require("../../Imgs/mediologo.png")} // Ruta de la imagen de fondo
                style={styles.imageContainer}
                imageStyle={styles.backgroundImage}
            >
                <View style={styles.container}>
                    {children}
                    <View style={[styles.line, styles.bottomLine]} />
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        opacity: 0.7, // opacidad para lograr el efecto de difuminado
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(247, 110, 17, 0.5)',
        justifyContent: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    line: {
        position: 'absolute',
        backgroundColor: '#F76E11', // Color con transparencia
        width: '110%',
    },
    bottomLine: {
        bottom: 0,
        height: 50,
    },
});

export default ContainerView;

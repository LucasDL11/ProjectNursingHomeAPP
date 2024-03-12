import React from "react";
import { StyleSheet, View, } from 'react-native';

const Login = ({ children }) => {

    return (

        <View style={styles.container}>
            <View style={styles.innerContainer}>

                {children}

            </View>
        </View>
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
        backgroundColor: '#FFBC80',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#rgba(255,255,255, 0.6)',
        width: 300,
        height: 450,
        borderRadius: 20,
    },
});




export default Login;
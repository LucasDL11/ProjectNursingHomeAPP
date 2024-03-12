import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import ContainerView from "../../../UI/ContainerView";
const InicioResp = ({ navigation }) => {

  const navegarAgendarVisita = () => {
    navigation.navigate('AgendarVisita');
  }

  const navegarActividadesDiarias = () => {
    navigation.navigate('ActividadesDiarias');
  }

  const navegarSolicitudUsuario = () => {
    navigation.navigate('SolicitudUsuario');
  }

  const navegarMisVisitas = () => {
    navigation.navigate('MisVisitas');
  }  

  return (
    <ContainerView>
        <View style={styles.row}>
          <Button title={"Agendar visita"} img={require("../../../Imgs/calendario.png")} onPress={navegarAgendarVisita} />
          <Button title={"Actividades diarias"} img={require("../../../Imgs/abuelos.png")} onPress={navegarActividadesDiarias} />
        </View>
        <View style={styles.row}>
          <Button title={"Solicitar nuevo usuario"} img={require("../../../Imgs/addperson.png")} onPress={navegarSolicitudUsuario} />
          <Button title={"Mis visitas"} img={require("../../../Imgs/libreta.png")} onPress={navegarMisVisitas} />
        </View>     
    </ContainerView>
  )
}

const Button = ({ title, onPress, img }) => {
  return (
    <TouchableOpacity style={styles.boton} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
      <Image source={img} style={styles.imagen} />
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({  
  boton: {
    width: 170,
    height: 170,
    borderRadius: 20,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "#D21312",
    backgroundColor: "rgba(252, 79, 79, 0.9)",
    alignItems: 'center',
  },
  imagen: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginRight: -50,
  },
  text: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    text: {
      color: '#000000',
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingBottom: 80,
    },
  },  
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default InicioResp;

import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Button from '../../Button';
import { Image } from 'react-native-elements';

const ErrorPopup = ({ visible, onClose,  content }) => {
  
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          
          <View style={{paddingBottom:20}}>
          <Image source={require("../../../Imgs/warning.png")} href="https://www.flaticon.es/iconos-gratis/alerta" style={styles.imagen} />
          </View>
          <Text style={styles.text}>{content}</Text>
          
          <Button

            title="Aceptar"
            onPress={onClose}
            backgroundColor="#FC4F4F"
            textColor="#000000"
          />
         
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 175, 137,1)',
    padding: 20,
    borderRadius: 10,
    borderWidth:5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagen: {
    width: 64,
    height: 64,
    resizeMode: 'cover',
    
  },
  text: {
    color: '#FE0C0C',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
    paddingBottom: 10
  }

});

export default ErrorPopup;

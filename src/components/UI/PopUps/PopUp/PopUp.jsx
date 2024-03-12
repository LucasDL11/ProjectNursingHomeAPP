import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Button from '../../Button';
/*
visible -> si es visible
onClose -> evento del botón Principal
bText ->  texto del botón principal, por defecto "Aceptar"
title -> título del popup
content -> contenido del popup
b2OnClose -> acción de presionar el botón secundario, esta prop tamién es para que se muestre,
              si no está presente no se mostrará el 2do botón
b2Text -> texto del botón 2, por defecto "Rechazar"
outClose -> si se toca fuera del pop se cierra.
*/
const Popup = ({ visible, onClose, bText, title, content, component, b2OnClose, b2Text, backColor, outClose }) => {
  const handleOnClose=()=>{
    if(outClose){
      onClose();
    }
  }
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer} onTouchEnd={handleOnClose}>
      <View style={[styles.modalContent, backColor ? { backgroundColor: backColor } : { backgroundColor: 'rgba(232, 175, 137,1)' }]}>
          <Text style={styles.titleText}>{title}</Text>
          {component? <View>{component}</View> : <Text>{content}</Text>}

          <View style={styles.buttonContainer}>
            <Button
              title={bText ? bText : "Aceptar"}
              onPress={onClose}
              backgroundColor="#FC4F4F"
              textColor="#000000"
            />
            <View style={styles.separador} />
            {b2OnClose && (
              <Button
                title={b2Text ? b2Text : "Rechazar"}
                onPress={b2OnClose}
                backgroundColor="#FC4F4F"
                textColor="#000000"
              />
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(232, 175, 137,1)', //rgba(255, 255, 255,0.8)
    padding: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  separador: {
    width:8
  }
});

export default Popup;

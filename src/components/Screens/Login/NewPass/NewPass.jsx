import React from "react";
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useState } from 'react';
import Button from "../../../UI/Button";
import InputText from "../../../UI/InputText";
import Popup from "../../../UI/PopUps/PopUp";
import ErrorPopup from "../../../UI/PopUps/ErrorPopUp";
import { resetPassword } from "../../../../api/conections";
import ContainerView from "../../../UI/ContainerView";
import Documento from "./TerminosLegales/DocumentoInicio";
import { CheckBox } from "react-native-elements";
const NewPass = ({ navigation }) => {

  const [userName, setUserName] = useState('');

  const [actualPass, setActualPass] = useState('');
  const [pass, setPass] = useState('');
  const [rePass, setRePass] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [mensaje, setMensaje] = useState(false);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  
  const acepto=()=>{
    setAceptoTerminos(!aceptoTerminos);
  }

  const errorPopup = () => {
    setErrorPopupVisible(true);
  }
  const closErrorPopup = () => {
    setErrorPopupVisible(false);
  }
  //cuando se apreta el boton, los comandos del popup:
  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    handleReiniciar();
    setPopupVisible(false);
  };
  const rechazar = () => {
    
    setPopupVisible(false);
  };
  
  const handleReiniciar = () => {
    if (userName.length == 8 && userName !== "" && actualPass !== "" && pass !== "" && pass === rePass) {
      if(aceptoTerminos){
        reiniciarPass();
      }else{
        setMensaje("Debe marcar si acepta.")
        errorPopup();
      }
    }else{
      setMensaje("Verifique los datos ingresados.")
      errorPopup();
    }
  }

  const reiniciarPass = async () => {
    if (userName.length == 8 && userName !== "" && actualPass !== "" && pass !== "" && pass === rePass) {
      try {
        let objetoReseteo = JSON.stringify({
          Cedula: userName,
          passActual: actualPass,
          pass: pass,
          rePass: rePass,
          TerminosAceptados: aceptoTerminos,
          IDTerminos: 1 
        })        
        resetPassword(objetoReseteo)
          .then(datos => {            
            if (datos === 200) {              
              navigation.navigate('Iniciar sesion');
            }
          });
      } catch {
        setMensaje("Algo salió mal, intentelo más tarde")
        errorPopup();        
      }
    } else {
      setMensaje("Verifique los datos")      
      errorPopup();
    }
  }
  return (
    <ContainerView>

      <View style={styles.container}>
        <View>

          <Text style={styles.text}>Cambio de contraseña</Text>

          <InputText
            value={userName}
            onChangeText={(userName) => setUserName(userName)}
            placeholder={'Cédula sin puntos ni guión'}
            backgroundColor="lightgray"
            textColor="#000000"
          />

          <InputText
            value={actualPass}
            onChangeText={(actualPass) => setActualPass(actualPass)}
            placeholder={'Contraseña actual'}
            backgroundColor="lightgray"
            textColor="#000000"
            secureTextEntry={true}
          />

          <InputText
            value={pass}
            onChangeText={(pass) => setPass(pass)}
            placeholder={'Nueva contraseña'}
            backgroundColor="lightgray"
            textColor="#000000"
            secureTextEntry={true}
          />

          <InputText
            value={rePass}
            onChangeText={(rePass) => setRePass(rePass)}
            placeholder={'Reingrese contraseña'}
            backgroundColor="lightgray"
            textColor="#000000"
            secureTextEntry={true}
          />

          <Button
            title="Confirmar"
            onPress={openPopup}
            backgroundColor="#FC4F4F"
            textColor="#000000"
          />
          <Popup
            visible={popupVisible}
            onClose={closePopup}
            title=""
            b2Text={"Rechazar"}
            b2OnClose={rechazar}
            component={
              <View style={{maxHeight:500}}>
                <Documento />
                <CheckBox
                  title={'He leído y acepto'}
                  checked={aceptoTerminos}
                  onPress={acepto}
                  containerStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderWidth: 0 }}
                  textStyle={{ fontSize: 16, color: "#000000" }}
                  uncheckedColor="#000000"
                />
              </View>
            }
          />


          <ErrorPopup
            visible={errorPopupVisible}
            onClose={closErrorPopup}
            content={mensaje}
          />
        </View>
      </View>
    </ContainerView>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderRadius: 20,
    paddingBottom: 40

  },
});


export default NewPass;
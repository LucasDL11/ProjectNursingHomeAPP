import React from 'react';
import { View, Text, TouchableOpacity, Linking, Image, StyleSheet } from 'react-native';

const Link = ({ url, texto }) => {
  const abrirEnlace = () => {
  Linking.openURL("https://apiresidencial.azurewebsites.net/docs/" + url);
  };

  return (
    <TouchableOpacity onPress={abrirEnlace}>
      
         <Image style={styles.imagen} source={texto} />
         <Text>{url}</Text>

  
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    imagen: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
    },
    headImg: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 30
    }

})
export default Link;
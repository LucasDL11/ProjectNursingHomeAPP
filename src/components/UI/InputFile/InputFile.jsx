import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Button from '../Button';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

const FilePicker = ({title,updateArchivo,index}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Puedes especificar el tipo de archivo que deseas permitir aquí
      });

      if (result.type === 'success') {
        setSelectedFile(result);

        // Obtener el contenido del archivo en Base64
        const fileUri = result.uri;

        // Obtener la URI del archivo seleccionado y usar fetch para leer su contenido como Base64
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // Aquí puedes hacer lo que necesites con la cadena base64 (enviarla a un servidor, etc.)
        //console.log('Contenido del archivo en Base64:', base64Data);

        // También puedes pasar el resultado y el contenido base64 a la función de actualización
        updateArchivo(index, result, base64Data);
      } else {
        // El usuario canceló la selección de archivos o ocurrió un error
        console.log('Selección de archivos cancelada o error');
      }
    } catch (error) {
      // Manejo de errores
      console.log('Error al seleccionar el archivo:', error);
    }
  };
  

  return (
    <View>
    <Button
          title={title}
          onPress={handleFilePick}
          backgroundColor="#FC4F4F"
          textColor="#000000"
        />
      {selectedFile && (
        <Text>Archivo seleccionado: {selectedFile.name}</Text>
      )}
    </View>
  );
};

export default FilePicker;

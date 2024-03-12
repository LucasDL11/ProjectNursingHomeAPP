import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputText = ({ placeholder, value, onChangeText, backgroundColor, textColor, secureTextEntry }) => {
  const inputStyles = [styles.input, { backgroundColor, color: textColor }];

  return (
    <TextInput
      style={inputStyles}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry} 
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
    fontSize: 16,
    marginTop: 10,
  },
});

export default InputText;
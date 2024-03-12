import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputText = ({ placeholder, value, onChangeText, backgroundColor, textColor, numeroDeLineas }) => {
  const inputStyles = [styles.input, { backgroundColor, color: textColor }];

  return (
    <TextInput
      style={inputStyles}
      placeholder={placeholder}
      value={value}
      backgroundColor={backgroundColor}
      multiline
      numberOfLines={numeroDeLineas}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 16,
    marginTop: 10,
  },
});

export default InputText;
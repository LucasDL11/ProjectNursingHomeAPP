import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, backgroundColor, textColor, borderColor }) => {
  const defaultBorderColor = "#D21312"; // color del borde por defecto
  const buttonStyles = [
    styles.button,
    { backgroundColor, borderColor: borderColor || defaultBorderColor }
  ];
  const textStyles = [styles.buttonText, { color: textColor }];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress}>
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {   
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Button;

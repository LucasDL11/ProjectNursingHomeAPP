import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-web';

const PrincipalView = ({children}) => {
  const screenHeight = Dimensions.get('window').height;
  const lineSize = screenHeight * 0.1;

  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
    /*<View style={styles.container}>
      <View style={[styles.line, styles.topLine, { height: lineSize }]} />
      {children}
      <View style={[styles.line, styles.bottomLine, { height: lineSize }]} />
    </View>
    */
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFBC80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    backgroundColor: '#F76E11',
    width: '100%',
  },
  topLine: {
    top: 0,
  },
  bottomLine: {
    bottom: 0,
  },
});

export default PrincipalView;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginProvider from './src/context/LoginPovider/LoginProvider';
import MainNavigation from './src/context/MainNavigation';

export default function App() {

  return (
    <LoginProvider>
      <NavigationContainer>
        <MainNavigation/>
      </NavigationContainer>
    </LoginProvider>
  );
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MisVisitas from '../Agenda/MisVisitas';
import { Image } from 'react-native-elements';
import TopImg from './TopImg/TopImg';

import InicioResponsable from "../InicioResponsable"
import AgendarVisita from '../Agenda/AgendarVisita';
import ActDiarias from '../ActividadesDiarias/ActividadesDiarias';
import SolicitudUsuario from '../SolicitudUsuario';
import AgregarVisitante from '../Agenda/AgregarVisitante';
import SobreNosotros from '../SobreNosotros';
const Drawer = createDrawerNavigator();

const SideBarResponsable = () => {
  return (
    <Drawer.Navigator initialRouteName="InicioResponsable"
      screenOptions={{
        headerStyle: { backgroundColor: '#F76E11' },
        headerTintColor: "#FFFFFF",
        headerTitleAlign: 'center',
        drawerActiveTintColor: "#FFFFFF",
        drawerInactiveTintColor: '#000000',
        drawerActiveBackgroundColor: "rgba(252, 79, 79, 0.9)",
        drawerInactiveBackgroundColor: 'rgba(247,110,17,0.4)',
        drawerStyle: {
          backgroundColor: '#F59F65'
        }
      }}
      drawerContent={(props) => <TopImg {...props} />}
    >
      <Drawer.Screen
        options={{
          drawerLabel: 'Inicio',
          headerTitle: 'INICIO',
          drawerIcon: () => (
            <Image source={require('../../../Imgs/inicio.png')} style={{ width: 35, height: 35 }} />
          ),
        }}
        name="InicioResponsable"
        component={InicioResponsable}
      />
      <Drawer.Screen options={{
        drawerLabel: 'Agendar visita', headerTitle: 'AGENDAR VISITA'
        , drawerIcon: () => (
          <Image source={require('../../../Imgs/calendario.png')} style={{ width: 35, height: 35 }} />
        ),
      }} name="AgendarVisita" component={AgendarVisita} />
      <Drawer.Screen options={{
        drawerLabel: 'Actividades', headerTitle: 'ACTIVIDADES'
        , drawerIcon: () => (
          <Image source={require('../../../Imgs/abuelos.png')} style={{ width: 35, height: 35 }} />
        ),
      }} name="ActividadesDiarias" component={ActDiarias} />
      <Drawer.Screen options={{
        drawerLabel: 'Nuevo usuario', headerTitle: 'NUEVO USUARIO'
        , drawerIcon: () => (
          <Image source={require('../../../Imgs/addperson.png')} style={{ width: 35, height: 35 }} />
        ),
      }} name="SolicitudUsuario" component={SolicitudUsuario} />
      <Drawer.Screen options={{
        drawerLabel: 'Mis visitas', headerTitle: 'MIS VISITAS'
        , drawerIcon: () => (
          <Image source={require('../../../Imgs/libreta.png')} style={{ width: 35, height: 35 }} />
        ),
      }} name="MisVisitas" component={MisVisitas} />
      <Drawer.Screen options={{
        drawerLabel: 'Nuevo visitante', headerTitle: 'NUEVO VISITANTE'
        , drawerIcon: () => (
          <Image source={require('../../../Imgs/nuevo.png')} style={{ width: 35, height: 35 }} />
        ),
      }} name="AgregarVisitante" component={AgregarVisitante} />
      <Drawer.Screen options={{
        drawerLabel: 'Sobre Nosotros', headerTitle: ''
        , drawerIcon: () => (
          <Image source={require('../../../Imgs/Arbol.png')} style={{ width: 35, height: 35 }} />
        ),
      }} name="SobreNosotros" component={SobreNosotros} />
    </Drawer.Navigator>
  );
};

export default SideBarResponsable;
import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SolicitudesPendientes from "./Pendientes/SolicitudesPendientes";
import SolicitudesProcesadas from "./Procesadas/SolicitudesProcesadas";

const MenuAgendas = () => {
    const Tab = createMaterialTopTabNavigator();
     return (
    <Tab.Navigator screenOptions={{       
        tabBarStyle: { backgroundColor: '#F2E3D9' },
      }}>

      <Tab.Screen name="Pendientes" component={SolicitudesPendientes} />
      <Tab.Screen name="Procesadas" component={SolicitudesProcesadas} />
    </Tab.Navigator>       
    )
}

export default MenuAgendas;
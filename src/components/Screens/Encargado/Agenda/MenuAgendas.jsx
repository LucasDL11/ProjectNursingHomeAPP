import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HistorialAgendasEncargado from "./Historial/HistorialAgendasEncargado";
import AgendasActivas from "./Activas/AgendasActivas";
import AgendasPendientes from "./Pendientes/AgendasPendientes";

const MenuAgendas = () => {
    const Tab = createMaterialTopTabNavigator();
     return (
    <Tab.Navigator screenOptions={{       
        tabBarStyle: { backgroundColor: '#F2E3D9' },
      }}>
      <Tab.Screen name="Activas" component={AgendasActivas} />
      <Tab.Screen name="Pendiente" component={AgendasPendientes} />
      <Tab.Screen name="Historial" component={HistorialAgendasEncargado} />
    </Tab.Navigator>       
    )
}

export default MenuAgendas;
import React from "react";
import AgregarTareasEncargado from "./AgregarTarea";
import TareasEncargado from "./VerTareasActivas";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HistorialTareasEncargado from "./HistorialTareas";

const MenuTareas = () => {
    const Tab = createMaterialTopTabNavigator(); 
    return (
    <Tab.Navigator screenOptions={{       
        tabBarStyle: { backgroundColor: '#F2E3D9' },
      }}>
      <Tab.Screen name="Tareas" component={TareasEncargado} />
      <Tab.Screen name="Agregar" component={AgregarTareasEncargado} />
      <Tab.Screen name="Historial" component={HistorialTareasEncargado} />
    </Tab.Navigator> 
    )

}


export default MenuTareas;
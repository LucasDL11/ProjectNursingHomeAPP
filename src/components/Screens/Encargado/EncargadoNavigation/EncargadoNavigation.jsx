import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { store } from '../../../../store/store';
import { Provider } from 'react-redux';

import InicioEncargado from "../InicioEncargado"
import Empleados from "../Empleados/Empleados";
import Residentes from "../Residentes/Residentes";
import Responsables from "../Responsables/Responsables";
import AgregarResponsable from "../Responsables/AgregarResponsable/AgregarResponsable";
import AgregarResidente from "../Residentes/AgregarResidente/AgregarResidente";
import AgregarEmpleado from "../Empleados/AgregarEmpleado";
import MenuTareas from "../Tareas";
import DetalleFamiliar from "../Responsables/DetalleFamiliar";
import DetallesNotificacion from "../Notificaciones/DatallesNotificacion";
import UpdateResponsable from "../Responsables/UpdateResponsable";
import DetalleResidente from "../Residentes/DetalleResidente";
import UpdateResidente from "../Residentes/UpdateResidente";
import DetalleEmpleado from "../Empleados/DetalleEmpleado";
import UpdateEmpleado from "../Empleados/UpdateEmpleado";
import Notificaciones from "../Notificaciones";

import MenuAgendas from "../Agenda/MenuAgendas";

import MenuSolicitudes from "../Solicitudes";

import LogOffButton from "../../../UI/LogOffButton/LogOffButton";
//screenOptions= {{headerShown:false}}
//options={{ headerBackVisible: false }}
const EncargadoNavigation = () => {
  const Stack = createNativeStackNavigator();
  

  return (
    <Provider store={store}>

      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F76E11',
          },
          headerTitleStyle: {
            color: '#FFFFFF',
            textAlign: 'center'
          },
          headerTitleAlign: 'center',

        }}>


        {/*ENCARGADO / DIRECTOR TÉCNICO*/}
        <Stack.Screen options={{
          headerTitle: 'INICIO', headerRight: () => (
            <LogOffButton />
          ),
        }} name="InicioEncargado" component={InicioEncargado} />
        <Stack.Screen options={{ headerTitle: 'EMPLEADOS' }} name="Empleados" component={Empleados} />
        <Stack.Screen options={{ headerTitle: 'RESIDENTES' }} name="Residentes" component={Residentes} />
        <Stack.Screen options={{ headerTitle: 'FAMILIARES' }} name="Responsables" component={Responsables} />
        <Stack.Screen options={{ headerTitle: 'Alta familiar' }} name="AgregarResponsable" component={AgregarResponsable} />
        <Stack.Screen options={{ headerTitle: 'DETALLE' }} name="DetalleFamiliar" component={DetalleFamiliar} />
        <Stack.Screen options={{ headerTitle: 'Alta residente' }} name="AgregarResidente" component={AgregarResidente} />
        <Stack.Screen options={{ headerTitle: 'ACTUALIZAR' }} name="UpdateResponsable" component={UpdateResponsable} />
        <Stack.Screen options={{ headerTitle: 'Alta empleado' }} name="AgregarEmpleado" component={AgregarEmpleado} />
        <Stack.Screen options={{ headerTitle: 'TAREAS' }} name="MenuTareas" component={MenuTareas} />
        <Stack.Screen options={{ headerTitle: 'NUEVOS USUARIOS' }} name="MenuSolicitudes" component={MenuSolicitudes} />
        <Stack.Screen options={{ headerTitle: 'AGENDAS' }} name="MenuAgendas" component={MenuAgendas} />
        <Stack.Screen options={{ headerTitle: 'DETALLE' }} name="DetalleEmpleado" component={DetalleEmpleado} />
        <Stack.Screen options={{ headerTitle: 'ACTUALIZAR' }} name="UpdateEmpleado" component={UpdateEmpleado} />
        <Stack.Screen options={{ headerTitle: 'DETALLE' }} name="DetalleResidente" component={DetalleResidente} />
        <Stack.Screen options={{ headerTitle: 'DETALLE' }} name="DetallesNotificacion" component={DetallesNotificacion} />
        <Stack.Screen options={{ headerTitle: 'ACTUALIZAR' }} name="UpdateResidente" component={UpdateResidente} />
        <Stack.Screen options={{ headerTitle: 'Notificación' }} name="Notificacion" component={Notificaciones} />


        {/*<Stack.Screen name="AgregarTareasEncargado" component={AgregarTareasEncargado} />*/}
        {/*<Stack.Screen name="HistorialTareasEncargado" component={HistorialTareasEncargado} />
                <Stack.Screen name="TareasEncargado" component={TareasEncargado} />*/}

        {/*<Stack.Screen name="AgendasActivas" component={AgendasActivas} />*/}
        {/*<Stack.Screen name="AgendasPendientes" component={AgendasPendientes} />*/}




      </Stack.Navigator>
    </Provider>
  )

}



export default EncargadoNavigation;
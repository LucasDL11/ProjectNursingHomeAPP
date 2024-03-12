import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { store } from '../../../../store/store';
import { Provider } from 'react-redux';
import InicioEmpleado from "../InicioEmpleado";

import AgregarTarea from "../CrearTarea";

import Notificaciones from "../../Encargado/Notificaciones";
import DetallesNotificacion from "../../Encargado/Notificaciones/DatallesNotificacion";

import Disponibles from "../Disponibles";
import Asignadas from "../Asignadas";
import AgendasEmpleado from "../AgendasDiarias";

//screenOptions= {{headerShown:false}}
//options={{ headerBackVisible: false }}
const EmpleadoNavigation = () => {
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
                
                {/*<Stack.Screen name="AgregarTareasEncargado" component={AgregarTareasEncargado} />*/}
                {/*<Stack.Screen name="HistorialTareasEncargado" component={HistorialTareasEncargado} />
        
                <Stack.Screen name="TareasEncargado" component={TareasEncargado} />*/}

                {/*<Stack.Screen name="AgendasActivas" component={AgendasActivas} />*/}
                {/*<Stack.Screen name="AgendasPendientes" component={AgendasPendientes} />*/}
                
     



                <Stack.Screen options={{ headerTitle: 'INICIO' }}name="INICIO" component={InicioEmpleado} />


                <Stack.Screen options={{ headerTitle: 'AGREGAR TAREA' }} name="Agregar Tarea" component={AgregarTarea} />                
                <Stack.Screen options={{ headerTitle: 'NOTIFICACIÓN' }} name="Notificación" component={Notificaciones} />
                <Stack.Screen options={{ headerTitle: 'DETALLES' }} name="DetallesNotificacion" component={DetallesNotificacion} />
                <Stack.Screen options={{ headerTitle: 'TAREAS DISPONIBLES' }} name="Disponibles" component={Disponibles} />
                <Stack.Screen options={{ headerTitle: 'MIS TAREAS ASIGNADAS' }} name="Asignadas" component={Asignadas} />
                <Stack.Screen options={{ headerTitle: 'AGENDAS DEL DÍA' }} name="Agendas activas" component={AgendasEmpleado} />
            </Stack.Navigator>
        </Provider>
    )

}



export default EmpleadoNavigation;
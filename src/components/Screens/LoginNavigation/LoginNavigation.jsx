import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginForm from "../../Screens/Login/LoginForm";
import NewPass from "../../Screens/Login/NewPass";

import { store } from '../../../store/store';
import { Provider } from 'react-redux';

const LoginNavigation = () => {
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

                <Stack.Screen options={{ headerTitle: 'INICIAR SESIÓN', headerBackVisible:false}} name="Iniciar sesion" component={LoginForm} />
                <Stack.Screen options={{ headerTitle: '', headerBackVisible:false}} name="NewPass" component={NewPass} />
               
            </Stack.Navigator>
        </Provider>
    )

}



export default LoginNavigation;
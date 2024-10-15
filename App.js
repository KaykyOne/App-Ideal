import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message'; // Importando o Toast
import LoginView from './screens/LoginView';
import HomeView from './screens/HomeView';
import SelectType from './screens/SelectTypeView';
import SelectInstructor from './screens/SelectInstructor';
import ConfirmAula from './screens/ConfirmAulaView';
import EndView from './screens/EndView';
import ErrorView from './screens/ErrorView';
import ListAulasView from './screens/ListAulasView';
import SelectHourAndDateView from './screens/SelectHourAndDateView';
import SuportView from './screens/SuportView';  

  const Stack = createNativeStackNavigator();

<<<<<<< HEAD
=======
  //app.js
>>>>>>> e08b1ff (atualizar master)
  const App = () => {
    return (
      <NavigationContainer>
        <Toast />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Suport"
            component={SuportView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SelectType"
            component={SelectType}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SelectInstructor"
            component={SelectInstructor}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ConfirmAula"
            component={ConfirmAula}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="End"
            component={EndView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Error"
            component={ErrorView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListAulas"
            component={ListAulasView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SelectHourAndDate"
            component={SelectHourAndDateView}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  export default App;

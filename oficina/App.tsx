import './global.css';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeButton from './src/components/HomeButton';
import HomeScreen from './src/screens/HomeScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import ClientesListScreen from './src/screens/Clientes/ClientesListScreen';
import ClientesDetailScreen from './src/screens/Clientes/ClientesDetailScreen';
import ClientesFormScreen from './src/screens/Clientes/ClientesFormScreen';
import ClientesEditScreen from './src/screens/Clientes/ClientesEditScreen';
import ClientesDeleteScreen from './src/screens/Clientes/ClientesDeleteScreen';
import VeiculosListScreen from './src/screens/Veiculos/VeiculosListScreen';
import VeiculosDetailScreen from './src/screens/Veiculos/VeiculosDetailScreen';
import VeiculosFormScreen from './src/screens/Veiculos/VeiculosFormScreen';
import VeiculosEditScreen from './src/screens/Veiculos/VeiculosEditScreen';
import VeiculosDeleteScreen from './src/screens/Veiculos/VeiculosDeleteScreen';
import OrdensListScreen from './src/screens/Ordens/OrdensListScreen';
import OrdensDetailScreen from './src/screens/Ordens/OrdensDetailScreen';
import OrdensFormScreen from './src/screens/Ordens/OrdensFormScreen';
import OrdensEditScreen from './src/screens/Ordens/OrdensEditScreen';
import OrdensDeleteScreen from './src/screens/Ordens/OrdensDeleteScreen';

const Stack = createNativeStackNavigator();

const rotas = [
  { name: 'ClientesList', component: ClientesListScreen, title: 'Clientes' },
  { name: 'ClientesDetail', component: ClientesDetailScreen, title: 'Detalhes do cliente' },
  { name: 'ClientesForm', component: ClientesFormScreen, title: 'Novo cliente' },
  { name: 'ClientesEdit', component: ClientesEditScreen, title: 'Editar cliente' },
  { name: 'ClientesDelete', component: ClientesDeleteScreen, title: 'Excluir cliente' },

  { name: 'VeiculosList', component: VeiculosListScreen, title: 'Veículos' },
  { name: 'VeiculosDetail', component: VeiculosDetailScreen, title: 'Detalhes do veículo' },
  { name: 'VeiculosForm', component: VeiculosFormScreen, title: 'Novo veículo' },
  { name: 'VeiculosEdit', component: VeiculosEditScreen, title: 'Editar veículo' },
  { name: 'VeiculosDelete', component: VeiculosDeleteScreen, title: 'Excluir veículo' },

  { name: 'OrdensList', component: OrdensListScreen, title: 'Ordens de Serviço' },
  { name: 'OrdensDetail', component: OrdensDetailScreen, title: 'Detalhes da ordem' },
  { name: 'OrdensForm', component: OrdensFormScreen, title: 'Nova ordem de serviço' },
  { name: 'OrdensEdit', component: OrdensEditScreen, title: 'Editar ordem' },
  { name: 'OrdensDelete', component: OrdensDeleteScreen, title: 'Excluir ordem' },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={({ navigation }) => ({
            headerStyle: { backgroundColor: '#F97E5B' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#FFF8F5' },
            // botão Home em todas as telas
            headerRight: () => <HomeButton navigation={navigation} />,
          })}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />

          {rotas.map((r) => (
            <Stack.Screen key={r.name} name={r.name} component={r.component} options={{ title: r.title }} />
          ))}

          <Stack.Screen
            name="Sucesso"
            component={SuccessScreen}
            options={{ title: 'Pronto!', headerBackVisible: false, gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

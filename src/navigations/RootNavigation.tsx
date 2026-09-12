import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from 'lucide-react-native';
import Profile from '../screens/Profile';
import MainTabNavigations from './MainTabNavigations';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="MainTabs" component={MainTabNavigations} />

    </Stack.Navigator>
  );
}

import "./global.css";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  NavigationContainer,
  DefaultTheme,
} from "@react-navigation/native";

import RootNavigator from "./src/navigations/RootNavigation";



export default function App() {
  return (
    <GestureHandlerRootView
      
    >
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
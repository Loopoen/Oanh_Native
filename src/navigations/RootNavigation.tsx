import { NavigatorScreenParams } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { TabsNavigation, TabsStackParamObj } from "./TabNavigations"
import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable"

export type RootStackParamObj = {
    TabsStack:NavigatorScreenParams<TabsStackParamObj>,
    Deals:undefined,
    cart:undefined
}

const RootStack = createNativeStackNavigator<RootStackParamObj>()

export type RootStackScreenProps < T extends keyof RootStackParamObj> = NativeStackScreenProps<RootStackParamObj, T>



export const RootNavigation = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen
                name="TabsStack"
                component={TabsNavigation}
                options={{
                    headerShown: false,
                }}
            />
        </RootStack.Navigator>
    );
};
import { BottomTabBarButtonProps, BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {  CompositeScreenProps } from "@react-navigation/native"
import { RootStackScreenProps } from "./RootNavigation"
import { AntDesign, Entypo } from "@expo/vector-icons"
import Home from "../screens/Home"
import Cart from "../screens/Cart"
import Deals from "../screens/Deals"
import Profile from '../screens/Profile';



export type TabsStackParamObj = {
    home: undefined,
    cart:undefined,
    deals:undefined,
    profile:undefined
}

const TabStack = createBottomTabNavigator<TabsStackParamObj>()


export type TabsStackScreenProps<
  T extends keyof TabsStackParamObj
> = CompositeScreenProps<
  BottomTabScreenProps<TabsStackParamObj, T>,
  RootStackScreenProps<"TabsStack">
>;

export const TabsNavigation = ()=>{
    return(
        <TabStack.Navigator screenOptions={{tabBarShowLabel:false}}>
            <TabStack.Screen name="home" component={Home} options={{headerShown:false, tabBarIcon:({focused})=> focused ? (
                <Entypo name="home" size={24} color="#008E97"/>
            ):(
                <AntDesign name="home" size={24} color="black" />
            )}}/>

              <TabStack.Screen name="cart" component={Cart} options={{headerShown:false, tabBarIcon:({focused})=> focused ? (
                <Entypo name="shopping-cart" size={24} color="#008E97"/>
            ):(
                <AntDesign name="shopping-cart" size={24} color="black" />
            )}}/>

              <TabStack.Screen name="deals" component={Deals} options={{headerShown:false, tabBarIcon:({focused})=> focused ? (
                <Entypo name="tag" size={24} color="#008E97"/>
            ):(
                <AntDesign name="tag" size={24} color="black" />
            )}}/>

                 <TabStack.Screen name="profile" component={Profile} options={{headerShown:false, tabBarIcon:({focused})=> focused ? (
                <Entypo name="user" size={24} color="#008E97"/>
            ):(
                <AntDesign name="user" size={24} color="black" />
            )}}/>


                

            
        </TabStack.Navigator>

        
    )
}

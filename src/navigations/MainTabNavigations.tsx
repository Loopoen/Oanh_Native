import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Profile from '../screens/Profile';

import Cart from '../screens/Cart';
import { TabNavigationParamList } from '../types/index';
import CustomTabBar from '../components/CustomTabBar';


const MainTabNavigations = () => {
    const Tab = createBottomTabNavigator<TabNavigationParamList>()

    return (
        <Tab.Navigator tabBar={((props)=><CustomTabBar {...props}/>)} screenOptions={{headerShown:false}}>
            <Tab.Screen name='Home' component={Home} />
            <Tab.Screen name='Profile' component={Profile} />
            <Tab.Screen name='Cart' component={Cart} />
        </Tab.Navigator>
    );
};

export default (MainTabNavigations);
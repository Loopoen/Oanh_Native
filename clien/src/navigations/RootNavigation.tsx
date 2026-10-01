import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restoreSession } from '../store/authSlice';
import { RootStackParamList } from '../types';
import MainTabsNavigation from './MainTabNavigation';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);
  const status = useAppSelector((state) => state.auth.status);
  const isGuest = useAppSelector((state) => state.auth.isGuest);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Chỉ hiện spinner lúc khởi động app. Nếu hiện cả khi status === 'loading'
  // thì màn Login/Register sẽ bị unmount giữa lúc đang đăng nhập/đăng ký.
  if (!initialized) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryWhite,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primaryOrange} />
      </View>
    );
  }

  const canAccessApp = status === 'authenticated' || isGuest;

  // Điều hướng theo trạng thái: đăng nhập/đăng ký/khách -> vào app,
  // đăng xuất -> tự quay về Login, không cần gọi navigation.replace thủ công.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {canAccessApp ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabsNavigation} />
          <Stack.Screen name="ProductDetails" component={ProductDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;

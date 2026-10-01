import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

import { COLORS } from '../constants';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, exitGuest } from '../store/authSlice';

cssInterop(SafeAreaView, { className: 'style' });

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  // Đăng xuất / thoát chế độ khách -> RootNavigator tự đưa về màn Login
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGoToLogin = () => {
    dispatch(exitGuest());
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-4 pb-28"
      >
        <Text className="font-poppins-semibold text-2xl text-primary-black mb-6">
          Account Profile
        </Text>

        {currentUser ? (
          <View className="rounded-3xl bg-primary-very-white p-5 shadow-sm shadow-black/5 elevation-2 mb-6">
            <View className="flex-row items-center gap-4">
              {currentUser.avatar ? (
                <Image
                  source={{ uri: currentUser.avatar }}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-black">
                  <UserIcon size={28} color={COLORS.primaryOrange} />
                </View>
              )}
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="font-poppins-semibold text-lg text-primary-black">
                    {currentUser.name}
                  </Text>
                  <ShieldCheck size={16} color={COLORS.primaryOrange} />
                </View>
                <Text className="font-poppins-regular text-xs text-primary-light-grey">
                  {currentUser.email}
                </Text>
                <Text className="mt-1 font-poppins-medium text-[11px] text-green-600">
                  ● Active Session
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.8}
              className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 border border-red-200"
            >
              <LogOut size={16} color={COLORS.primaryRed} />
              <Text className="font-poppins-medium text-sm text-[#DC3535]">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="rounded-3xl bg-primary-very-white p-6 shadow-sm shadow-black/5 elevation-2 mb-6 items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-white mb-3">
              <UserIcon size={28} color={COLORS.primaryLightGrey} />
            </View>
            <Text className="font-poppins-semibold text-lg text-primary-black mb-1">
              Guest Mode
            </Text>
            <Text className="text-center font-poppins-regular text-xs text-primary-light-grey mb-5 px-4">
              Sign in to sync your bag, track order deliveries, and save favorite clothes across devices.
            </Text>

            <TouchableOpacity
              onPress={handleGoToLogin}
              activeOpacity={0.85}
              className="w-full flex-row items-center justify-center gap-2 rounded-2xl bg-primary-orange py-3.5 shadow-md shadow-orange-500/20"
            >
              <LogIn size={18} color={COLORS.primaryVeryWhite} />
              <Text className="font-poppins-semibold text-sm text-primary-very-white">
                Sign In to Your Account
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MotiView } from 'moti';
import { cssInterop } from 'nativewind';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShoppingBag,
} from 'lucide-react-native';

import { COLORS } from '../constants';
import { RootStackParamList } from '../types';
import {
  authService,
  validateEmail,
  validatePassword,
} from '../services/authService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAuthError, enterGuest, login } from '../store/authSlice';

cssInterop(MotiView, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);
  const { width, height } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const isSmallScreen = height < 720 || width < 380;

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(null);
    if (generalError) setGeneralError(null);
    if (authError) dispatch(clearAuthError());
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(null);
    if (generalError) setGeneralError(null);
    if (authError) dispatch(clearAuthError());
  };

  const handleFillDemo = () => {
    setEmail('demo@oanh.vn');
    setPassword('password123');
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);
  };

  const handleLogin = async () => {
    setGeneralError(null);

    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);

    if (!emailResult.isValid) {
      setEmailError(emailResult.error || 'Email này nhìn hơi lạ đó nha');
    }
    if (!passwordResult.isValid) {
      setPasswordError(passwordResult.error || 'Mật khẩu yếu xìu à');
    }

    if (!emailResult.isValid || !passwordResult.isValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Thành công -> authSlice đổi status, RootNavigator tự chuyển sang MainTabs
      await dispatch(
        login({
          email: email.trim(),
          password,
        })
      ).unwrap();
    } catch (error: any) {
      setGeneralError(typeof error === 'string' ? error : 'Sai rồi bạn ơi, thử lại xem nào');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setEmailError('Điền email vô đã rồi tính tiếp!');
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error || 'Email này coi bộ không ổn lắm');
      return;
    }

    Alert.alert(
      'Quên mật khẩu à?',
      `Gửi link đặt lại mật khẩu tới ${email.trim()} nha, xong nhớ check spam luôn đó `,
      [
        { text: 'Thôi khỏi', style: 'cancel' },
        {
          text: 'Gửi liền',
          onPress: async () => {
            const res = await authService.requestPasswordReset(email);
            if (res.success) {
              Alert.alert('Gửi xong rồi đó!', res.message);
            }
          },
        },
      ]
    );
  };

  const handleSignUp = () => {
    dispatch(clearAuthError());
    navigation.navigate('Register');
  };

  const handleContinueAsGuest = () => {
    dispatch(enterGuest());
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-white">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primaryWhite} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6"
        >
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
            className="flex-row items-center justify-between pt-2"
          >
            <View className="flex-row items-center gap-1.5">
              <Text className="font-poppins-medium text-xs text-primary-light-grey tracking-wider uppercase">
                Oanh Store
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleContinueAsGuest}
              disabled={isLoading}
              hitSlop={12}
              className="py-1 px-3 rounded-full bg-primary-very-white border border-black/5"
            >
              <Text className="font-poppins-medium text-xs text-primary-light-grey">
                Lười đăng nhập, cho qua
              </Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 18, delay: 100 }}
            className={`items-center ${isSmallScreen ? 'mt-4 mb-4' : 'mt-8 mb-6'}`}
          >
            <View className="relative mb-3 items-center justify-center">
              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary-black shadow-lg shadow-black/20 elevation-5">
                <ShoppingBag size={34} color={COLORS.primaryOrange} />
              </View>
            </View>

            <Text className="font-poppins-semibold text-2xl tracking-tight text-primary-black">
              Ê, quay lại rồi hả!
            </Text>
            <Text className="mt-1 text-center font-poppins-regular text-sm text-primary-light-grey px-4">
              Đăng nhập để lượn tủ đồ, xem đơn hàng và săn deal độc quyền nha
            </Text>
          </MotiView>

          {generalError && (
            <MotiView
              from={{ opacity: 0, translateY: -8 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="mb-4 flex-row items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5"
            >
              <AlertCircle size={18} color={COLORS.primaryRed} />
              <Text className="flex-1 font-poppins-medium text-xs text-[#DC3535]">
                {generalError}
              </Text>
            </MotiView>
          )}

          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 200 }}
            className="gap-4"
          >
            <View>
              <Text className="mb-1.5 font-poppins-medium text-xs text-primary-light-grey tracking-wide uppercase">
                Địa chỉ email
              </Text>
              <View
                className={`h-14 flex-row items-center rounded-2xl border bg-primary-very-white px-4 shadow-sm shadow-black/5 elevation-1 ${
                  emailError
                    ? 'border-[#DC3535]'
                    : emailFocused
                    ? 'border-primary-orange'
                    : 'border-black/10'
                }`}
              >
                <Mail
                  size={20}
                  color={
                    emailError
                      ? COLORS.primaryRed
                      : emailFocused
                      ? COLORS.primaryOrange
                      : COLORS.secondaryLightGrey
                  }
                />
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="ten@vidu.com"
                  placeholderTextColor={COLORS.secondaryLightGrey}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="next"
                  className="h-full flex-1 px-3 font-poppins-medium text-[15px] text-primary-black"
                />
              </View>
              {emailError && (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 flex-row items-center gap-1 pl-1"
                >
                  <AlertCircle size={13} color={COLORS.primaryRed} />
                  <Text className="font-poppins-regular text-xs text-[#DC3535]">
                    {emailError}
                  </Text>
                </MotiView>
              )}
            </View>

            <View>
              <View className="mb-1.5 flex-row items-center justify-between">
                <Text className="font-poppins-medium text-xs text-primary-light-grey tracking-wide uppercase">
                  Mật khẩu
                </Text>
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={isLoading}
                  hitSlop={8}
                >
                  <Text className="font-poppins-medium text-xs text-primary-orange">
                    Quên mật khẩu rồi hả?
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                className={`h-14 flex-row items-center rounded-2xl border bg-primary-very-white px-4 shadow-sm shadow-black/5 elevation-1 ${
                  passwordError
                    ? 'border-[#DC3535]'
                    : passwordFocused
                    ? 'border-primary-orange'
                    : 'border-black/10'
                }`}
              >
                <Lock
                  size={20}
                  color={
                    passwordError
                      ? COLORS.primaryRed
                      : passwordFocused
                      ? COLORS.primaryOrange
                      : COLORS.secondaryLightGrey
                  }
                />
                <TextInput
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Bí mật quốc gia của bạn"
                  placeholderTextColor={COLORS.secondaryLightGrey}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  className="h-full flex-1 px-3 font-poppins-medium text-[15px] text-primary-black"
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible((prev) => !prev)}
                  disabled={isLoading}
                  hitSlop={10}
                  className="p-1"
                  accessibilityLabel={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {isPasswordVisible ? (
                    <EyeOff size={20} color={COLORS.primaryLightGrey} />
                  ) : (
                    <Eye size={20} color={COLORS.secondaryLightGrey} />
                  )}
                </TouchableOpacity>
              </View>
              {passwordError && (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 flex-row items-center gap-1 pl-1"
                >
                  <AlertCircle size={13} color={COLORS.primaryRed} />
                  <Text className="font-poppins-regular text-xs text-[#DC3535]">
                    {passwordError}
                  </Text>
                </MotiView>
              )}
            </View>

            <TouchableOpacity
              onPress={handleFillDemo}
              disabled={isLoading}
              className="self-start py-1"
            >
              <Text className="font-poppins-regular text-xs text-secondary-light-grey">
                Bấm vào đây để tự động điền{' '}
                <Text className="font-poppins-medium text-primary-orange">tài khoản demo</Text>{' '}
                (lười gõ thì đây nè)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
              className={`h-14 mt-2 flex-row items-center justify-center rounded-2xl bg-primary-orange shadow-md shadow-orange-500/30 elevation-4 ${
                isLoading ? 'opacity-85' : 'opacity-100'
              }`}
            >
              {isLoading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color={COLORS.primaryVeryWhite} />
                  <Text className="font-poppins-medium text-base text-primary-very-white">
                    Đang đăng nhập, chờ xíu...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Text className="font-poppins-semibold text-base text-primary-very-white">
                    Đăng nhập thôi
                  </Text>
                  <ArrowRight size={18} color={COLORS.primaryVeryWhite} />
                </View>
              )}
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 400, delay: 300 }}
            className="mt-auto py-6 items-center justify-center gap-3"
          >
            <View className="flex-row items-center justify-center">
              <Text className="font-poppins-regular text-sm text-primary-light-grey">
                Chưa có tài khoản hả?{' '}
              </Text>
              <TouchableOpacity onPress={handleSignUp} disabled={isLoading} hitSlop={8}>
                <Text className="font-poppins-semibold text-sm text-primary-orange">
                  Đăng ký lẹ
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleContinueAsGuest}
              disabled={isLoading}
              className="py-1 px-4"
            >
              <Text className="font-poppins-medium text-xs text-secondary-light-grey underline">
                Dạo chơi với vai khách lạ trước đã
              </Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

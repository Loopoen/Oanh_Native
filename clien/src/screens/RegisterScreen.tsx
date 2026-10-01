import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
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
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
  UserPlus,
} from 'lucide-react-native';

import { COLORS } from '../constants';
import { RootStackParamList } from '../types';
import {
  getPasswordStrength,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '../services/authService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAuthError, register } from '../store/authSlice';

cssInterop(MotiView, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });

type RegisterNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
type FieldKey = 'name' | 'email' | 'password' | 'confirm';

const STRENGTH_META = [
  { label: '', color: COLORS.secondaryLightGrey },
  { label: 'Yếu xìu', color: COLORS.primaryRed },
  { label: 'Tạm ổn', color: COLORS.primaryOrange },
  { label: 'Mạnh đó', color: '#16A34A' },
] as const;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);
  const { width, height } = useWindowDimensions();
  const isSmallScreen = height < 720 || width < 380;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<FieldKey | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const strength = getPasswordStrength(password);

  const clearFieldError = (key: FieldKey) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (generalError) setGeneralError(null);
    if (authError) dispatch(clearAuthError());
  };

  const borderClass = (key: FieldKey) =>
    errors[key]
      ? 'border-[#DC3535]'
      : focused === key
      ? 'border-primary-orange'
      : 'border-black/10';

  const iconColor = (key: FieldKey) =>
    errors[key]
      ? COLORS.primaryRed
      : focused === key
      ? COLORS.primaryOrange
      : COLORS.secondaryLightGrey;

  const validate = (): boolean => {
    const next: Partial<Record<FieldKey, string>> = {};

    const n = validateName(name);
    if (!n.isValid) next.name = n.error;

    const e = validateEmail(email);
    if (!e.isValid) next.email = e.error;

    const p = validatePassword(password);
    if (!p.isValid) next.password = p.error;

    const c = validateConfirmPassword(password, confirm);
    if (!c.isValid) next.confirm = c.error;

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    if (isLoading) return;
    setGeneralError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {

      await dispatch(
        register({ name: name.trim(), email: email.trim(), password })
      ).unwrap();
    } catch (error: any) {
      setGeneralError(
        typeof error === 'string' ? error : 'Đăng ký chưa thành, thử lại phát nữa nha.'
      );
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    dispatch(clearAuthError());
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Login');
  };

  const inputClass =
    'h-full flex-1 px-3 font-poppins-medium text-[15px] text-primary-black';
  const boxClass = (key: FieldKey) =>
    `h-14 flex-row items-center rounded-2xl border bg-primary-very-white px-4 shadow-sm shadow-black/5 elevation-1 ${borderClass(
      key
    )}`;
  const labelClass =
    'mb-1.5 font-poppins-medium text-xs text-primary-light-grey tracking-wide uppercase';

  const FieldError = ({ field }: { field: FieldKey }) =>
    errors[field] ? (
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-1 flex-row items-center gap-1 pl-1"
      >
        <AlertCircle size={13} color={COLORS.primaryRed} />
        <Text className="font-poppins-regular text-xs text-[#DC3535]">{errors[field]}</Text>
      </MotiView>
    ) : null;

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
          <View className="flex-row items-center justify-between pt-2">
            <TouchableOpacity
              onPress={handleBack}
              disabled={isLoading}
              hitSlop={12}
              className="h-9 w-9 items-center justify-center rounded-full bg-primary-very-white border border-black/5"
              accessibilityLabel="Quay lại"
            >
              <ArrowLeft size={18} color={COLORS.primaryBlack} />
            </TouchableOpacity>
            <Text className="font-poppins-medium text-xs text-primary-light-grey tracking-wider uppercase">
              Oanh Store
            </Text>
            <View className="h-9 w-9" />
          </View>

          <MotiView
            from={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 18 }}
            className={`items-center ${isSmallScreen ? 'mt-2 mb-4' : 'mt-6 mb-6'}`}
          >
            <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary-black shadow-lg shadow-black/20 elevation-5">
              <UserPlus size={34} color={COLORS.primaryOrange} />
            </View>
            <Text className="mt-3 font-poppins-semibold text-2xl tracking-tight text-primary-black">
              Tạo tài khoản mới nè!
            </Text>
            <Text className="mt-1 text-center font-poppins-regular text-sm text-primary-light-grey px-4">
              Vài giây thôi là có ngay tủ đồ riêng và deal độc quyền
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
            transition={{ type: 'spring', damping: 20, delay: 150 }}
            className="gap-4"
          >
            {/* Họ tên */}
            <View>
              <Text className={labelClass}>Tên hiển thị</Text>
              <View className={boxClass('name')}>
                <UserIcon size={20} color={iconColor('name')} />
                <TextInput
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    clearFieldError('name');
                  }}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  placeholder="Oanh"
                  placeholderTextColor={COLORS.secondaryLightGrey}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  className={inputClass}
                />
              </View>
              <FieldError field="name" />
            </View>

            {/* Email */}
            <View>
              <Text className={labelClass}>Địa chỉ email</Text>
              <View className={boxClass('email')}>
                <Mail size={20} color={iconColor('email')} />
                <TextInput
                  ref={emailRef}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    clearFieldError('email');
                  }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="ten@vidu.com"
                  placeholderTextColor={COLORS.secondaryLightGrey}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  className={inputClass}
                />
              </View>
              <FieldError field="email" />
            </View>

            {/* Mật khẩu */}
            <View>
              <Text className={labelClass}>Mật khẩu</Text>
              <View className={boxClass('password')}>
                <Lock size={20} color={iconColor('password')} />
                <TextInput
                  ref={passwordRef}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    clearFieldError('password');
                    if (errors.confirm) clearFieldError('confirm');
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="Ít nhất 6 ký tự"
                  placeholderTextColor={COLORS.secondaryLightGrey}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  className={inputClass}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  disabled={isLoading}
                  hitSlop={10}
                  className="p-1"
                  accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={COLORS.primaryLightGrey} />
                  ) : (
                    <Eye size={20} color={COLORS.secondaryLightGrey} />
                  )}
                </TouchableOpacity>
              </View>
              <FieldError field="password" />

              {password.length > 0 && (
                <View className="mt-2 flex-row items-center gap-2 pl-1">
                  <View className="flex-1 flex-row gap-1">
                    {[1, 2, 3].map((level) => (
                      <View
                        key={level}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor:
                            strength >= level
                              ? STRENGTH_META[strength].color
                              : 'rgba(0,0,0,0.08)',
                        }}
                      />
                    ))}
                  </View>
                  <Text
                    style={{ color: STRENGTH_META[strength].color }}
                    className="w-14 text-right font-poppins-medium text-[11px]"
                  >
                    {STRENGTH_META[strength].label}
                  </Text>
                </View>
              )}
            </View>

         
            <View>
              <Text className={labelClass}>Nhập lại mật khẩu</Text>
              <View className={boxClass('confirm')}>
                <ShieldCheck size={20} color={iconColor('confirm')} />
                <TextInput
                  ref={confirmRef}
                  value={confirm}
                  onChangeText={(t) => {
                    setConfirm(t);
                    clearFieldError('confirm');
                  }}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  placeholder="Gõ lại cho chắc ăn"
                  placeholderTextColor={COLORS.secondaryLightGrey}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  className={inputClass}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm((v) => !v)}
                  disabled={isLoading}
                  hitSlop={10}
                  className="p-1"
                  accessibilityLabel={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirm ? (
                    <EyeOff size={20} color={COLORS.primaryLightGrey} />
                  ) : (
                    <Eye size={20} color={COLORS.secondaryLightGrey} />
                  )}
                </TouchableOpacity>
              </View>
              <FieldError field="confirm" />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
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
                    Đang tạo tài khoản...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Text className="font-poppins-semibold text-base text-primary-very-white">
                    Đăng ký thôi
                  </Text>
                  <ArrowRight size={18} color={COLORS.primaryVeryWhite} />
                </View>
              )}
            </TouchableOpacity>
          </MotiView>

          <View className="mt-auto py-6 flex-row items-center justify-center">
            <Text className="font-poppins-regular text-sm text-primary-light-grey">
              Có tài khoản rồi mà?{' '}
            </Text>
            <TouchableOpacity onPress={handleBack} disabled={isLoading} hitSlop={8}>
              <Text className="font-poppins-semibold text-sm text-primary-orange">
                Đăng nhập luôn
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

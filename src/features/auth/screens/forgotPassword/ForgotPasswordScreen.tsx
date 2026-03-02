import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './ForgotPasswordScreen.styles';
import { Input, Button, OTPDialog } from '../../../../components/ui';
import { AuthStackParamList } from '../../../../navigation/types';

const appIcon = require('../../../../assets/images/app_icon.png');

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

type Step = 'mobile' | 'reset';

export function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otpVisible, setOtpVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerifyMobile = () => {
    setOtpVisible(true);
  };

  const handleOtpVerify = (_otp: string) => {
    setOtpVisible(false);
    setStep('reset');
  };

  const handleResetPassword = () => {
    // TODO: call API then navigate back to Login
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header: back + title with underline */}
        <View style={styles.headerBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={12}>
            <Text style={styles.backArrow}>&lt;</Text>
          </Pressable>
          <Text style={[styles.headerTitle]}>
            Forgot Password
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Image source={appIcon} style={styles.iconImage} resizeMode="contain" />
          </View>
          <View style={styles.mainTitleUnderline}>
            <Text style={styles.mainTitle}>Forgot Password?</Text>
          </View>
          <Text style={styles.subtitle}>
            To update password first validate mobile number then{' '}
            <Text style={styles.subtitle}>change password</Text>
          </Text>
        </View>

        {step === 'mobile' && (
          <View style={styles.card}>
            <Input
              label="Mobile Number"
              leftIcon={<Text style={styles.inputIcon}>📱</Text>}
              placeholder="Enter your mobile number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />

            <Button
              title="Verify Mobile Number"
              onPress={handleVerifyMobile}
              containerStyle={styles.verifyButton}
            />
          </View>
        )}

        {step === 'reset' && (
          <View style={styles.card}>
            <Input
              label="New Password"
              leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              rightElement={
                <Pressable onPress={() => setShowNewPassword(!showNewPassword)} hitSlop={12}>
                  <Text style={styles.inputIcon}>{showNewPassword ? '🙈' : '👁'}</Text>
                </Pressable>
              }
              containerStyle={{ marginBottom: 12 }}
            />
            <Input
              label="Confirm Password"
              leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              rightElement={
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={12}>
                  <Text style={styles.inputIcon}>{showConfirmPassword ? '🙈' : '👁'}</Text>
                </Pressable>
              }
            />
            <Button title="Reset Password" onPress={handleResetPassword} />
          </View>
        )}

        <View style={styles.signInRow}>
          <Text style={styles.signInHint}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerLink}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>

      <OTPDialog
        visible={otpVisible}
        onClose={() => setOtpVisible(false)}
        onVerify={handleOtpVerify}
        title="Enter OTP"
        subtitle="We sent a verification code to your mobile number"
      />
    </KeyboardAvoidingView>
  );
}

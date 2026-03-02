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
import { styles } from './LoginScreen.styles';
import { Input, Button, Link } from '../../../../components/ui';
import { AuthStackParamList } from '../../../../navigation/types';

const appIcon = require('../../../../assets/images/app_icon.png');

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Image source={appIcon} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to continue shopping</Text>
        </View>

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

          <Input
            label="Password"
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={12}>
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </Pressable>
            }
            containerStyle={{ marginBottom: 12 }}
          />

          <View style={styles.forgotLink}>
            <Link onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password?</Link>
          </View>

          <Button title="Login" onPress={() => {}} />
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.registerHint}>Don't have an account? </Text>
          <Link onPress={() => navigation.navigate('Register')} textStyle={styles.registerLink}>
            Register Now
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
import { styles } from './RegisterScreen.styles';
import { Input, Button, Link } from '../../../../components/ui';
import { AuthStackParamList } from '../../../../navigation/types';

const appIcon = require('../../../../assets/images/app_icon.png');

const labelUppercase = styles.labelUppercase;

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        {/* Header: back + title */}
        <View style={styles.headerBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={12}>
            <Text style={styles.backArrow}>&lt;</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Register</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Image source={appIcon} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.welcomeTitle}>Create Account</Text>
          <Text style={styles.welcomeSubtitle}>Join our grocery community today</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Input
              label="First Name"
              labelStyle={labelUppercase}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              containerStyle={[styles.halfInput, { marginLeft: 0 }]}
            />
            <Input
              label="Last Name"
              labelStyle={labelUppercase}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              containerStyle={[styles.halfInput, { marginRight: 0 }]}
            />
          </View>

          <Input
            label="Mobile Number"
            labelStyle={labelUppercase}
            leftIcon={<Text style={styles.inputIcon}>📱</Text>}
            placeholder="Enter your mobile number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Input
            label="Email Address"
            labelStyle={labelUppercase}
            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            labelStyle={labelUppercase}
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

          <Input
            label="Confirm Password"
            labelStyle={labelUppercase}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Pressable
            style={[styles.termsRow, { marginBottom: 20 }]}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms ? <View style={styles.checkboxDot} /> : null}
            </View>
            <Text style={styles.termsText}>
              I agree with the{' '}
              <Text style={styles.termsLink} onPress={() => {}}>
                Terms and Conditions
              </Text>
              {' '}and{' '}
              <Text style={styles.termsLink} onPress={() => {}}>
                Privacy Policy.
              </Text>
            </Text>
          </Pressable>

          <Button title="Register" onPress={() => {}} />
        </View>

        <View style={styles.signInRow}>
          <Text style={styles.signInHint}>Already have an account? </Text>
          <Link
            onPress={() => navigation.goBack()}
            textStyle={styles.registerLink}
          >
            Sign In
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

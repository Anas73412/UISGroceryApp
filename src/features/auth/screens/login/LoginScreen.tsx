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
import {
  Input,
  Button,
  Link,
  AlertDialog,
  LoadingBar,
} from '../../../../components/ui';
import { AuthStackParamList } from '../../../../navigation/types';
import { useMessageDialog } from '../../../../components/context/MessageDialogContext';
import { useLoading } from '../../../../components/context/LoadingContext';
import { LoginController } from './LoginController';
import { SUCCESS } from '../../../../utils/constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../../theme';

const appIcon = require('../../../../assets/images/app_icon.png');

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showErrorDialog, showSuccessDialog } = useMessageDialog();
  const { show, hide } = useLoading();

  const onLoginPress = () => {
    if (mobile.trim() === '') {
      showErrorDialog(
        'Mobile Number Required',
        'Please enter your mobile number',
      );
      return;
    }
    if (password.trim() === '') {
      showErrorDialog('Password Required', 'Please enter your password');
      return;
    }

    if (password.trim().length < 6) {
      showErrorDialog('Password Required', 'Invalid Password');
      return;
    }

    try {
      show('Loading...');
      const res = LoginController.loginUser(mobile, password);
      res.then(result => {
        if (result.status === SUCCESS) {
          hide();
          navigation.getParent()?.navigate('Main');
          //  showSuccessDialog('Login Details',result.message);
        } else {
          showErrorDialog('Login Error', result.message);
          hide();
        }
      });
    } catch (error: any) {
      hide();
      showErrorDialog('Login Exception', (error as Error).message);
    }
    // setLoading(true);
  };
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
          <Text style={styles.welcomeSubtitle}>
            Sign in to continue shopping
          </Text>
        </View>
        <View style={styles.card}>
          <Input
            label="Mobile Number"
            leftIcon={
              <MaterialIcons
                name="phone"
                size={28}
                color={theme.colors.primary}
              />
            }
            placeholder="Enter your mobile number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            leftIcon={
              <MaterialIcons
                name="lock"
                size={28}
                color={theme.colors.primary}
              />
            }
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightElement={
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={12}
              >
                <Text style={styles.inputIcon}>
                  {showPassword ? (
                    <MaterialIcons
                      name="visibility"
                      size={22}
                      color={theme.colors.gray400}
                    />
                  ) : (
                    <MaterialIcons
                      name="visibility-off"
                      size={22}
                      color={theme.colors.primary}
                    />
                  )}
                </Text>
              </Pressable>
            }
            containerStyle={{ marginBottom: 12 }}
          />

          <View style={styles.forgotLink}>
            <Link onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot Password?
            </Link>
          </View>

          <Button title="Login" onPress={onLoginPress} />
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.registerHint}>Don't have an account? </Text>
          <Link
            onPress={() => navigation.navigate('Register')}
            textStyle={styles.registerLink}
          >
            Register Now
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * GroceryApp
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigation/RootNavigator';
import { theme } from './theme';
import { MessageDialogProvider } from './components/context/MessageDialogContext';
import { LoadingProvider } from './components/context/LoadingContext';
import { ConfirmationDialogProvider } from './components/context/ConfirmationDialogContext';
import Toast, { BaseToast } from 'react-native-toast-message';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  // Light theme for development; dark theme commented in src/theme/colors.ts
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <>
      <SafeAreaProvider>
        <LoadingProvider>
          <MessageDialogProvider>
            <ConfirmationDialogProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle={barStyle}
                  backgroundColor={theme.colors.background}
                />
                <RootNavigator />
              </NavigationContainer>
            </ConfirmationDialogProvider>
          </MessageDialogProvider>
        </LoadingProvider>
      </SafeAreaProvider>
      <Toast config={toastConfig} />
    </>
  );
}

export default App;
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: theme.colors.success }}
      contentContainerStyle={{ backgroundColor: theme.colors.white }}
      text1Style={{
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
      }}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: theme.colors.error }}
      contentContainerStyle={{ backgroundColor: theme.colors.white }}
      text1Style={{
        color: theme.colors.error,
        fontSize: 14,
        fontWeight: '600',
      }}
    />
  ),
};

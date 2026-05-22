/**
 * GroceryApp
 * @format
 */

import React, { useCallback, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  type NavigationState,
} from '@react-navigation/native';
import { SessionRehydrator } from './components/SessionRehydrator';
import { RootNavigator } from './navigation/RootNavigator';
import { theme } from './theme';
import { MessageDialogProvider } from './components/context/MessageDialogContext';
import { LoadingProvider } from './components/context/LoadingContext';
import { ConfirmationDialogProvider } from './components/context/ConfirmationDialogContext';
import { OrderTrackingProvider } from './components/context/OrderTrackingContext';
import { OrderTrackingSnackBar } from './components/ui/OrderTrackingSnackBar';
import { OrderTrackingBootstrap } from './components/OrderTrackingBootstrap';
import { navigationRef } from './navigation/navigationRef';
import { getFocusedRouteName } from './navigation/getFocusedRouteName';
import Toast, { BaseToast } from 'react-native-toast-message';

function App() {
  const [focusedRouteName, setFocusedRouteName] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const onNavigationStateChange = useCallback(
    (state: NavigationState | undefined) => {
      setFocusedRouteName(getFocusedRouteName(state));
    },
    [],
  );
  // Light theme for development; dark theme commented in src/theme/colors.ts
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <>
      <SafeAreaProvider>
        <LoadingProvider>
          <MessageDialogProvider>
            <ConfirmationDialogProvider>
              <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                  setFocusedRouteName(
                    getFocusedRouteName(navigationRef.getRootState()),
                  );
                }}
                onStateChange={onNavigationStateChange}
              >
                <OrderTrackingProvider focusedRouteName={focusedRouteName}>
                  <SessionRehydrator>
                    <OrderTrackingBootstrap>
                      <StatusBar
                        barStyle={barStyle}
                        backgroundColor={theme.colors.background}
                      />
                      <RootNavigator />
                      <OrderTrackingSnackBar />
                    </OrderTrackingBootstrap>
                  </SessionRehydrator>
                </OrderTrackingProvider>
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

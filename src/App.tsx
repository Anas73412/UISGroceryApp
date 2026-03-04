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

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  // Light theme for development; dark theme commented in src/theme/colors.ts
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <LoadingProvider>
        <MessageDialogProvider>
          <NavigationContainer>
            <StatusBar
              barStyle={barStyle}
              backgroundColor={theme.colors.background}
            />
            <RootNavigator />
          </NavigationContainer>
        </MessageDialogProvider>
      </LoadingProvider>
    </SafeAreaProvider>
  );
}

export default App;

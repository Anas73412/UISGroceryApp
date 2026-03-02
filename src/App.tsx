/**
 * GroceryApp
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigation/RootNavigator';
import { appTheme } from './theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  // Light theme for development; dark theme commented in src/theme/colors.ts
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle={barStyle}
          backgroundColor={appTheme.background}
        />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { useStore } from './src/store';
import { requestPermissions } from './src/utils/notifications';
import AppNavigator from './src/navigation';

function Inner() {
  const { isDark } = useTheme();
  const hydrate = useStore(s => s.hydrate);

  useEffect(() => {
    hydrate();
    requestPermissions();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Inner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from './index';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const scheme = useColorScheme();
  const [override, setOverride] = useState(null); // 'light' | 'dark' | null

  // Load persisted preference on mount
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('@theme_preference').then(value => {
      if (!mounted) return;
      if (value === 'light' || value === 'dark' || value === 'system') {
        setOverride(value === 'system' ? null : value);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Persist changes when override changes
  useEffect(() => {
    const save = async () => {
      try {
        if (override === null) {
          await AsyncStorage.setItem('@theme_preference', 'system');
        } else {
          await AsyncStorage.setItem('@theme_preference', override);
        }
      } catch (e) {
        // ignore storage errors
      }
    };
    save();
  }, [override]);

  const mode = override ?? scheme ?? 'light';
  const colors = mode === 'dark' ? darkColors : lightColors;
  const isDark = mode === 'dark';

  const setThemePreference = (pref) => {
    // pref: 'light' | 'dark' | 'system'
    if (pref === 'system') setOverride(null);
    else setOverride(pref);
  };

  const clearThemePreference = () => setOverride(null);

  return (
    <ThemeContext.Provider value={{ colors, isDark, mode, setOverride: setThemePreference, clearThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

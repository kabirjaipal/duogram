import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

/**
 * Check if the app is running in Expo Go
 * @returns {boolean} true if running in Expo Go, false otherwise
 */
export const isExpoGo = () => {
  return Constants.appOwnership === 'expo';
};

/**
 * Show a one-time warning about Expo Go limitations
 */
export const showExpoGoLimitationsWarning = async () => {
  if (!isExpoGo()) return;
  
  try {
    const hasShownWarning = await AsyncStorage.getItem('hasShownExpoGoWarning');
    if (!hasShownWarning) {
      Alert.alert(
        'Expo Go Limitations',
        'Some features have limited functionality in Expo Go. ' +
        'These are expected limitations of Expo Go, not errors in the app. ' +
        'For full functionality, you can create a development build.',
        [{ text: 'OK', style: 'default' }]
      );
      await AsyncStorage.setItem('hasShownExpoGoWarning', 'true');
    }
  } catch (error) {
    console.warn('Error managing Expo Go warnings:', error);
  }
};

/**
 * Setup console filters to hide known Expo Go limitation warnings
 * This reduces the clutter in the console from expected warnings
 */
export const setupConsoleFilters = () => {
  if (!isExpoGo()) return;
  
  // Store the original console methods
  const originalWarn = console.warn;
  const originalError = console.error;
    // Known warning patterns that we want to filter
  const knownWarningPatterns = [
    'functionality is not fully supported in Expo Go'
  ];
  
  // Override console.warn to filter out known Expo Go limitation warnings
  console.warn = function(...args) {
    // Check if this is a known warning we want to filter
    const message = String(args[0]);
    if (knownWarningPatterns.some(pattern => message.includes(pattern))) {
      // Log to internal log system but without the console warning UI
      if (__DEV__) {
        console.log('[FILTERED EXPO GO WARNING]:', message);
      }
      return;
    }
    // Pass through to original warn for everything else
    originalWarn.apply(console, args);
  };
  
  // Similar for errors about notifications
  console.error = function(...args) {
    const message = String(args[0]);
    if (knownWarningPatterns.some(pattern => message.includes(pattern))) {
      if (__DEV__) {
        console.log('[FILTERED EXPO GO ERROR]:', message);
      }
      return;
    }
    originalError.apply(console, args);
  };
};

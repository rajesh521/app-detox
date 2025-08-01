import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import brainDetoxService from './src/services/BrainDetoxService';
import { theme } from './src/styles';

export default function App() {
  useEffect(() => {
    // Initialize Brain Detox services when app starts
    const initializeServices = async () => {
      try {
        await brainDetoxService.initialize();
        console.log('Brain Detox app started successfully');
      } catch (error) {
        console.error('Error starting Brain Detox app:', error);
      }
    };

    initializeServices();

    // Cleanup services when app unmounts
    return () => {
      brainDetoxService.shutdown();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="light" backgroundColor={theme.colors.primary} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

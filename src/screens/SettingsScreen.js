import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles';

const SettingsScreen = () => {
  return (
    <SafeAreaView style={theme.globalStyles.container}>
      <View style={theme.globalStyles.safeContainer}>
        <Text style={theme.globalStyles.h2}>Settings</Text>
        <Text style={theme.globalStyles.body}>
          Configure your Brain Detox experience.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

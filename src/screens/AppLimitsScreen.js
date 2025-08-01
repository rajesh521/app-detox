import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles';

const AppLimitsScreen = () => {
  return (
    <SafeAreaView style={theme.globalStyles.container}>
      <View style={theme.globalStyles.safeContainer}>
        <Text style={theme.globalStyles.h2}>App Limits</Text>
        <Text style={theme.globalStyles.body}>
          Set limits for your apps to control screen time.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AppLimitsScreen;

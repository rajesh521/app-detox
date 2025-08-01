import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles';

const UsageStatsScreen = () => {
  return (
    <SafeAreaView style={theme.globalStyles.container}>
      <View style={theme.globalStyles.safeContainer}>
        <Text style={theme.globalStyles.h2}>Usage Statistics</Text>
        <Text style={theme.globalStyles.body}>
          View your app usage statistics and insights.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UsageStatsScreen;

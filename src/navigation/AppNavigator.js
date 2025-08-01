import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AppLimitsScreen from '../screens/AppLimitsScreen';
import UsageStatsScreen from '../screens/UsageStatsScreen';
import PuzzleScreen from '../screens/PuzzleScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AppLimits" component={AppLimitsScreen} />
      <Stack.Screen name="UsageStats" component={UsageStatsScreen} />
      <Stack.Screen name="Puzzles" component={PuzzleScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

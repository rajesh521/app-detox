import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles';

const PuzzleScreen = () => {
  return (
    <SafeAreaView style={theme.globalStyles.container}>
      <View style={theme.globalStyles.safeContainer}>
        <Text style={theme.globalStyles.h2}>Brain Puzzles</Text>
        <Text style={theme.globalStyles.body}>
          Engage your mind with brain puzzles and challenges.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PuzzleScreen;

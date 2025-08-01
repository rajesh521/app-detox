import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../styles';

const PuzzleContainer = ({ children, style }) =>
  <View style={[styles.container, style]}>
    {children}
  </View>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius.large,
    margin: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default PuzzleContainer;


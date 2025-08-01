import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles';

const HomeScreen = () => {
  return (
    <SafeAreaView style={[theme.globalStyles.container, styles.container]}>
      <View style={styles.content}>
        <Text style={[theme.globalStyles.h1, styles.title]}>
          Brain Detox
        </Text>
        <Text style={[theme.globalStyles.body, styles.subtitle]}>
          Your minimalist screen time management app
        </Text>
        <View style={styles.card}>
          <Text style={theme.globalStyles.h3}>Welcome to Brain Detox!</Text>
          <Text style={theme.globalStyles.body}>
            Environment setup complete ✅
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.text.secondary,
  },
  card: {
    ...theme.globalStyles.card,
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
});

export default HomeScreen;

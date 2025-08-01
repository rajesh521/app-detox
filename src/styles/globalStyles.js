// Global styles for Brain Detox App
import { StyleSheet } from 'react-native';
import colors from './colors';
import typography from './typography';
import spacing, { layout } from './spacing';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: layout.containerPadding,
  },
  
  // Typography styles
  h1: {
    ...typography.h1,
    color: colors.text.primary,
  },
  
  h2: {
    ...typography.h2,
    color: colors.text.primary,
  },
  
  h3: {
    ...typography.h3,
    color: colors.text.primary,
  },
  
  body: {
    ...typography.body,
    color: colors.text.primary,
  },
  
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  
  // Card styles
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: layout.borderRadius.medium,
    padding: layout.cardPadding,
    marginVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Button styles
  button: {
    paddingVertical: layout.buttonPadding.vertical,
    paddingHorizontal: layout.buttonPadding.horizontal,
    borderRadius: layout.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  primaryButton: {
    backgroundColor: colors.primary,
  },
  
  secondaryButton: {
    backgroundColor: colors.gray[200],
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  buttonText: {
    ...typography.body,
    fontWeight: '600',
  },
  
  primaryButtonText: {
    color: colors.text.white,
  },
  
  secondaryButtonText: {
    color: colors.text.primary,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.medium,
    padding: layout.inputPadding,
    backgroundColor: colors.white,
    ...typography.body,
    color: colors.text.primary,
  },
  
  // Layout utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Spacing utilities
  marginXS: { margin: spacing.xs },
  marginSM: { margin: spacing.sm },
  marginMD: { margin: spacing.md },
  marginLG: { margin: spacing.lg },
  marginXL: { margin: spacing.xl },
  marginXXL: { margin: spacing.xxl },
  
  paddingXS: { padding: spacing.xs },
  paddingSM: { padding: spacing.sm },
  paddingMD: { padding: spacing.md },
  paddingLG: { padding: spacing.lg },
  paddingXL: { padding: spacing.xl },
  paddingXXL: { padding: spacing.xxl },
  
  // Shadow styles
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default globalStyles;

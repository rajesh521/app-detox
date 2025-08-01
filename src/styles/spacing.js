// Spacing system for Brain Detox App
// Based on 8pt grid system

export const spacing = {
  xs: 4,   // Extra small spacing
  sm: 8,   // Small spacing
  md: 16,  // Medium spacing (base unit)
  lg: 24,  // Large spacing
  xl: 32,  // Extra large spacing
  xxl: 48, // Extra extra large spacing
};

// Additional spacing utilities
export const layout = {
  // Container padding
  containerPadding: spacing.md,
  
  // Screen margins
  screenMargin: spacing.lg,
  
  // Card padding
  cardPadding: spacing.md,
  
  // Button padding
  buttonPadding: {
    vertical: spacing.sm,
    horizontal: spacing.md,
  },
  
  // Input padding
  inputPadding: spacing.sm,
  
  // Section margins
  sectionMargin: spacing.xl,
  
  // List item spacing
  listItemSpacing: spacing.sm,
  
  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    full: 9999,
  },
  
  // Header heights
  headerHeight: 56,
  tabBarHeight: 60,
};

export default spacing;

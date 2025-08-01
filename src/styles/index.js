// Design System Index - Brain Detox App
// Export all design tokens for easy importing

export { colors, default as Colors } from './colors';
export { typography, default as Typography } from './typography';
export { spacing, layout, default as Spacing } from './spacing';
export { animation, default as Animation } from './animation';
export { globalStyles, default as GlobalStyles } from './globalStyles';

// Design system theme object
export const theme = {
  colors,
  typography,
  spacing,
  layout,
  animation,
  globalStyles,
};

export default theme;

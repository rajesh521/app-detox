// Animation constants and easing curves for Brain Detox App
import { Easing } from 'react-native-reanimated';

export const animation = {
  // Animation durations
  durations: {
    short: 150,
    medium: 300,
    long: 600,
  },

  // Easing functions
  easing: {
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
    linear: Easing.linear,
    spring: Easing.bounce,
    quadIn: Easing.in(Easing.quad),
    quadOut: Easing.out(Easing.quad),
    cubicIn: Easing.in(Easing.cubic),
    cubicOut: Easing.out(Easing.cubic),
  },

  // Opacity transitions
  opacity: {
    fadeIn: {
      duration: 200,
      easing: Easing.out(Easing.ease),
    },
    fadeOut: {
      duration: 150,
      easing: Easing.in(Easing.ease),
    },
  },

  // Transform transitions
  transform: {
    scaleUp: {
      from: 0.95,
      to: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
    },
    scaleDown: {
      from: 1,
      to: 0.95,
      duration: 150,
      easing: Easing.in(Easing.ease),
    },
  },
};

export default animation;

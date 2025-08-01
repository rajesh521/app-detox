// Animation configuration for consistent app-wide animations
export const AnimationConfig = {
  // Timing configurations
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
    loading: 1000,
  },
  
  // Easing functions
  easing: {
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  // Common animation values
  values: {
    slideDistance: 300,
    scaleMin: 0.95,
    scaleMax: 1.05,
    rotateSuccess: 360,
    rotateLoading: 360,
  },
  
  // Page transitions
  pageTransitions: {
    slideRight: {
      enter: { transform: [{ translateX: 300 }], opacity: 0 },
      exit: { transform: [{ translateX: -300 }], opacity: 0 },
    },
    slideLeft: {
      enter: { transform: [{ translateX: -300 }], opacity: 0 },
      exit: { transform: [{ translateX: 300 }], opacity: 0 },
    },
    fade: {
      enter: { opacity: 0 },
      exit: { opacity: 0 },
    },
    scale: {
      enter: { transform: [{ scale: 0.8 }], opacity: 0 },
      exit: { transform: [{ scale: 1.2 }], opacity: 0 },
    },
  },
  
  // Micro-interactions
  microInteractions: {
    buttonPress: {
      scale: 0.95,
      duration: 100,
    },
    cardHover: {
      scale: 1.02,
      shadowOpacity: 0.15,
      duration: 200,
    },
    successPulse: {
      scale: [1, 1.1, 1],
      duration: 600,
    },
    errorShake: {
      translateX: [0, -10, 10, -10, 10, 0],
      duration: 500,
    },
  },
  
  // Loading animations
  loading: {
    spinner: {
      rotate: '360deg',
      duration: 1000,
      iterationCount: 'infinite',
    },
    pulse: {
      opacity: [1, 0.5, 1],
      duration: 1500,
      iterationCount: 'infinite',
    },
    bounce: {
      translateY: [0, -10, 0],
      duration: 800,
      iterationCount: 'infinite',
    },
  },
};

export default AnimationConfig;

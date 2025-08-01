import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';
import AnimationConfig from './AnimationConfig';

const { width: screenWidth } = Dimensions.get('window');

const PageTransition = ({ 
  children, 
  transitionType = 'slideRight',
  duration = AnimationConfig.timing.normal,
  onAnimationComplete
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start enter animation
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start(onAnimationComplete);
  }, []);

  const getTransformStyle = () => {
    switch (transitionType) {
      case 'slideRight':
        return {
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenWidth, 0],
            }),
          }],
        };
      case 'slideLeft':
        return {
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-screenWidth, 0],
            }),
          }],
        };
      case 'slideUp':
        return {
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenWidth, 0],
            }),
          }],
        };
      case 'slideDown':
        return {
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-screenWidth, 0],
            }),
          }],
        };
      case 'scale':
        return {
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }],
        };
      case 'fade':
      default:
        return {};
    }
  };

  return (
    <Animated.View
      style={[
        { flex: 1 },
        getTransformStyle(),
        { opacity: opacityValue },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default PageTransition;

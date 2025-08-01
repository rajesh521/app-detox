import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../styles';
import timerService from '../../services/TimerService';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CountdownTimer = ({ 
  duration = 60000, // 1 minute in milliseconds
  onComplete,
  onTick,
  size = 200,
  strokeWidth = 8,
  color = theme.colors.primary,
  backgroundColor = theme.colors.gray[300],
  showText = true,
  autoStart = false,
  timerId = null
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timerId && timerService.isRunning(timerId)) {
      const remaining = timerService.getRemainingTime(timerId);
      setTimeRemaining(remaining);
      setIsRunning(true);
    }
  }, [timerId]);

  const startTimer = () => {
    if (isRunning) return;

    setIsRunning(true);
    
    if (timerId) {
      // Use the timer service
      timerService.startTimer(
        timerId,
        timeRemaining,
        (remaining) => {
          setTimeRemaining(remaining);
          const progress = remaining / duration;
          animatedValue.setValue(progress);
          onTick && onTick(remaining);
        },
        () => {
          setIsRunning(false);
          setTimeRemaining(0);
          animatedValue.setValue(0);
          onComplete && onComplete();
        }
      );
    } else {
      // Use local interval
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = Math.max(0, prev - 1000);
          const progress = newTime / duration;
          
          Animated.timing(animatedValue, {
            toValue: progress,
            duration: 1000,
            useNativeDriver: false,
          }).start();

          onTick && onTick(newTime);

          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onComplete && onComplete();
          }

          return newTime;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (timerId) {
      timerService.pauseTimer(timerId);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const resumeTimer = () => {
    if (timerId) {
      timerService.resumeTimer(timerId);
      setIsRunning(true);
    } else {
      startTimer();
    }
  };

  const resetTimer = () => {
    if (timerId) {
      timerService.stopTimer(timerId);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsRunning(false);
    setTimeRemaining(duration);
    animatedValue.setValue(1);
  };

  const formatTime = (milliseconds) => {
    return timerService.formatTime(milliseconds);
  };

  const progress = timeRemaining / duration;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[theme.globalStyles.h2, styles.timeText]}>
            {formatTime(timeRemaining)}
          </Text>
          <Text style={[theme.globalStyles.caption, styles.labelText]}>
            {isRunning ? 'Running' : 'Paused'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  labelText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default CountdownTimer;

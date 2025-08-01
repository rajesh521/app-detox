import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '../../styles';
import timerService from '../../services/TimerService';
import limitChecker from '../../services/LimitChecker';

const LimitSetter = ({ appId, onLimitSet, currentLimit = 30 }) => {
  const [limit, setLimit] = useState(currentLimit); // in minutes
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setLimit(currentLimit);
    setIsChanged(false);
  }, [currentLimit]);

  const handleSliderChange = (value) => {
    setLimit(Math.round(value));
    setIsChanged(Math.round(value) !== currentLimit);
  };

  const handleSave = async () => {
    try {
      const limitInMs = limit * 60 * 1000; // Convert minutes to milliseconds
      await limitChecker.setAppLimit(appId, limitInMs);
      onLimitSet && onLimitSet(limitInMs);
      setIsChanged(false);
    } catch (error) {
      console.error('Error setting limit:', error);
    }
  };

  const handleReset = () => {
    setLimit(currentLimit);
    setIsChanged(false);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getSliderColor = () => {
    if (limit <= 30) return theme.colors.success;
    if (limit <= 120) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[theme.globalStyles.h3, styles.title]}>Set Time Limit</Text>
        {appId && (
          <Text style={[theme.globalStyles.body, styles.appId]}>for {appId}</Text>
        )}
      </View>

      <View style={styles.timeDisplay}>
        <Text style={[theme.globalStyles.h1, styles.timeText, { color: getSliderColor() }]}>
          {formatTime(limit)}
        </Text>
        <Text style={[theme.globalStyles.caption, styles.perDayText]}>per day</Text>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={480} // 8 hours
          value={limit}
          onValueChange={handleSliderChange}
          step={5}
          minimumTrackTintColor={getSliderColor()}
          maximumTrackTintColor={theme.colors.gray[300]}
          thumbStyle={[styles.thumb, { backgroundColor: getSliderColor() }]}
        />
        
        <View style={styles.sliderLabels}>
          <Text style={[theme.globalStyles.caption, styles.sliderLabel]}>5 min</Text>
          <Text style={[theme.globalStyles.caption, styles.sliderLabel]}>8 hours</Text>
        </View>
      </View>

      <View style={styles.presets}>
        <Text style={[theme.globalStyles.body, styles.presetsTitle]}>Quick Presets:</Text>
        <View style={styles.presetButtons}>
          {[15, 30, 60, 120, 240].map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.presetButton,
                limit === preset && styles.activePreset
              ]}
              onPress={() => handleSliderChange(preset)}
            >
              <Text style={[
                theme.globalStyles.caption,
                styles.presetText,
                limit === preset && styles.activePresetText
              ]}>
                {formatTime(preset)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[theme.globalStyles.caption, styles.infoText]}>
          {limit <= 30 
            ? '🟢 Healthy limit - promotes mindful usage'
            : limit <= 120
            ? '🟡 Moderate limit - consider reducing gradually'
            : '🔴 High limit - may not be effective for digital wellness'
          }
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            theme.globalStyles.button,
            theme.globalStyles.secondaryButton,
            styles.resetButton,
            !isChanged && styles.disabledButton
          ]}
          onPress={handleReset}
          disabled={!isChanged}
        >
          <Text style={[
            theme.globalStyles.buttonText,
            theme.globalStyles.secondaryButtonText,
            !isChanged && styles.disabledButtonText
          ]}>
            Reset
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            theme.globalStyles.button,
            theme.globalStyles.primaryButton,
            styles.saveButton,
            !isChanged && styles.disabledButton
          ]}
          onPress={handleSave}
          disabled={!isChanged}
        >
          <Text style={[
            theme.globalStyles.buttonText,
            theme.globalStyles.primaryButtonText,
            !isChanged && styles.disabledButtonText
          ]}>
            Save Limit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius.large,
    margin: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  appId: {
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.medium,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  perDayText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
  sliderContainer: {
    marginBottom: theme.spacing.xl,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: theme.spacing.sm,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
  },
  sliderLabel: {
    color: theme.colors.text.secondary,
  },
  presets: {
    marginBottom: theme.spacing.xl,
  },
  presetsTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  presetButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activePreset: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  presetText: {
    color: theme.colors.text.secondary,
  },
  activePresetText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  info: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.medium,
    marginBottom: theme.spacing.xl,
  },
  infoText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  resetButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    opacity: 0.7,
  },
});

export default LimitSetter;

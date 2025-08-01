import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../../styles';
import puzzleService from '../../services/PuzzleService';

const MemoryPuzzle = ({ difficulty = 'medium', subType = 'sequence', onComplete, onError }) => {
  const [puzzle, setPuzzle] = useState(null);
  const [userSequence, setUserSequence] = useState([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    generateNewPuzzle();
  }, [difficulty, subType]);

  const generateNewPuzzle = () => {
    try {
      const newPuzzle = puzzleService.generatePuzzle('memory', difficulty, subType);
      setPuzzle(newPuzzle);
      setUserSequence([]);
      setFeedbackVisible(false);
    } catch (error) {
      console.error('Error generating memory puzzle:', error);
      onError && onError(error);
    }
  };

  const handleSelect = (item) => {
    if (feedbackVisible) return;

    setUserSequence((prevSequence) => [...prevSequence, item]);

    if (userSequence.length + 1 === puzzle.sequence.length) {
      validateAnswer([...userSequence, item]);
    }
  };

  const validateAnswer = (completeSequence) => {
    try {
      const result = puzzleService.validateAnswer(completeSequence);
      setIsCorrect(result.isCorrect);
      setFeedbackVisible(true);

      if (result.isCorrect) {
        onComplete && onComplete(result);
      } else {
        setTimeout(() => {
          setFeedbackVisible(false);
          setUserSequence([]);
        }, 2000);
      }
    } catch (error) {
      console.error('Error validating memory answer:', error);
      onError && onError(error);
    }
  };

  if (!puzzle) {
    return (
      <View style={styles.container}>
        <Text style={[theme.globalStyles.body, styles.loadingText]}>Loading puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[theme.globalStyles.h3, styles.title]}>Memory Challenge</Text>

      <View style={styles.grid}>
        {puzzle.availableOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.gridItem, userSequence.includes(item) && styles.selectedItem]}
            onPress={() => handleSelect(item)}
          >
            <Text style={theme.globalStyles.body}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {feedbackVisible && (
        <View style={[
          styles.feedback,
          isCorrect ? styles.successFeedback : styles.errorFeedback
        ]}>
          <Text style={[
            theme.globalStyles.body,
            isCorrect ? styles.successText : styles.errorText
          ]}>
            {isCorrect ? '🎉 Correct! Well done!' : '❌ Incorrect. Try again!'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius.large,
    margin: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  loadingText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  gridItem: {
    width: '20%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.medium,
  },
  selectedItem: {
    backgroundColor: theme.colors.primaryLight,
  },
  feedback: {
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.medium,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  successFeedback: {
    backgroundColor: theme.colors.success + '20',
  },
  errorFeedback: {
    backgroundColor: theme.colors.error + '20',
  },
  successText: {
    color: theme.colors.success,
  },
  errorText: {
    color: theme.colors.error,
  },
});

export default MemoryPuzzle;


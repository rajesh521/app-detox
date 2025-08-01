import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../../styles';
import puzzleService from '../../services/PuzzleService';

const MathPuzzle = ({ difficulty = 'medium', onComplete, onError }) => {
  const [puzzle, setPuzzle] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);
  const shakeAnim = new Animated.Value(0);

  useEffect(() => {
    generateNewPuzzle();
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [difficulty]);

  const generateNewPuzzle = () => {
    try {
      const newPuzzle = puzzleService.generatePuzzle('math', difficulty);
      setPuzzle(newPuzzle);
      setUserAnswer('');
      setShowFeedback(false);
      setAttempts(0);
    } catch (error) {
      console.error('Error generating math puzzle:', error);
      onError && onError(error);
    }
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    try {
      const result = puzzleService.validateAnswer(userAnswer);
      setIsCorrect(result.isCorrect);
      setShowFeedback(true);
      setAttempts(prev => prev + 1);

      if (result.isCorrect) {
        // Success animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        setTimeout(() => {
          onComplete && onComplete(result);
        }, 1500);
      } else {
        // Error shake animation
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();

        // Auto-hide feedback after 2 seconds
        setTimeout(() => {
          setShowFeedback(false);
          setUserAnswer('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      onError && onError(error);
    }
  };

  const handleHint = () => {
    try {
      const hintResult = puzzleService.useHint();
      // You could show the hint in a modal or toast
      console.log('Hint:', hintResult.hint);
    } catch (error) {
      console.error('Error getting hint:', error);
    }
  };

  if (!puzzle) {
    return (
      <View style={styles.container}>
        <Text style={[theme.globalStyles.body, styles.loadingText]}>
          Loading puzzle...
        </Text>
      </View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateX: shakeAnim }
          ]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={[theme.globalStyles.h3, styles.title]}>Math Challenge</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{difficulty.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.problemContainer}>
        <Text style={[theme.globalStyles.h1, styles.problem]}>
          {puzzle.problem} = ?
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[theme.globalStyles.input, styles.answerInput]}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder="Enter your answer"
          placeholderTextColor={theme.colors.text.secondary}
          keyboardType="numeric"
          editable={!showFeedback || !isCorrect}
        />
      </View>

      {showFeedback && (
        <Animated.View style={[
          styles.feedbackContainer,
          isCorrect ? styles.successFeedback : styles.errorFeedback
        ]}>
          <Text style={[
            theme.globalStyles.body,
            styles.feedbackText,
            isCorrect ? styles.successText : styles.errorText
          ]}>
            {isCorrect 
              ? '🎉 Correct! Well done!' 
              : `❌ Incorrect. The answer is ${puzzle.solution}`
            }
          </Text>
        </Animated.View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[theme.globalStyles.button, theme.globalStyles.primaryButton, styles.submitButton]}
          onPress={handleSubmit}
          disabled={showFeedback && isCorrect}
        >
          <Text style={[theme.globalStyles.buttonText, theme.globalStyles.primaryButtonText]}>
            Submit Answer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[theme.globalStyles.button, theme.globalStyles.secondaryButton, styles.hintButton]}
          onPress={handleHint}
          disabled={showFeedback}
        >
          <Text style={[theme.globalStyles.buttonText, theme.globalStyles.secondaryButtonText]}>
            💡 Hint
          </Text>
        </TouchableOpacity>
      </View>

      {attempts > 0 && (
        <Text style={[theme.globalStyles.caption, styles.attemptsText]}>
          Attempts: {attempts}
        </Text>
      )}
    </Animated.View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.primary,
  },
  difficultyBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.layout.borderRadius.medium,
  },
  difficultyText: {
    color: theme.colors.text.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  problemContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.medium,
  },
  problem: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  answerInput: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: theme.colors.background,
  },
  feedbackContainer: {
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.medium,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  successFeedback: {
    backgroundColor: theme.colors.success + '20',
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  errorFeedback: {
    backgroundColor: theme.colors.error + '20',
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  feedbackText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  successText: {
    color: theme.colors.success,
  },
  errorText: {
    color: theme.colors.error,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    flex: 2,
  },
  hintButton: {
    flex: 1,
  },
  attemptsText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
});

export default MathPuzzle;

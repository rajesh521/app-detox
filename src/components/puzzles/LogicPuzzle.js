import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../../styles';
import puzzleService from '../../services/PuzzleService';

const LogicPuzzle = ({ difficulty = 'medium', subType = 'pattern', onComplete, onError }) => {
  const [puzzle, setPuzzle] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    generateNewPuzzle();
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [difficulty, subType]);

  const generateNewPuzzle = () => {
    try {
      const newPuzzle = puzzleService.generatePuzzle('logic', difficulty, subType);
      setPuzzle(newPuzzle);
      setSelectedAnswer(null);
      setFeedbackVisible(false);
    } catch (error) {
      console.error('Error generating logic puzzle:', error);
      onError && onError(error);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (feedbackVisible) return;

    setSelectedAnswer(answer);
    try {
      const result = puzzleService.validateAnswer(answer);
      setIsCorrect(result.isCorrect);
      setFeedbackVisible(true);

      if (result.isCorrect) {
        // Success animation
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });

        setTimeout(() => {
          onComplete && onComplete(result);
        }, 1500);
      } else {
        // Reset after showing error
        setTimeout(() => {
          setFeedbackVisible(false);
          setSelectedAnswer(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error validating logic answer:', error);
      onError && onError(error);
    }
  };

  const renderQuestion = () => {
    if (!puzzle) return null;

    switch (puzzle.type) {
      case 'pattern-sequence':
        return (
          <View style={styles.questionContainer}>
            <Text style={[theme.globalStyles.h3, styles.questionTitle]}>
              Find the next element in the sequence:
            </Text>
            <View style={styles.sequenceContainer}>
              {puzzle.sequence.map((item, index) => (
                <View key={index} style={styles.sequenceItem}>
                  <Text style={[theme.globalStyles.body, styles.sequenceText]}>{item}</Text>
                </View>
              ))}
              <View style={[styles.sequenceItem, styles.questionMark]}>
                <Text style={[theme.globalStyles.body, styles.sequenceText]}>?</Text>
              </View>
            </View>
          </View>
        );

      case 'number-pattern':
        return (
          <View style={styles.questionContainer}>
            <Text style={[theme.globalStyles.h3, styles.questionTitle]}>
              Find the next number in the sequence:
            </Text>
            <View style={styles.sequenceContainer}>
              {puzzle.sequence.map((num, index) => (
                <View key={index} style={styles.sequenceItem}>
                  <Text style={[theme.globalStyles.body, styles.sequenceText]}>{num}</Text>
                </View>
              ))}
              <View style={[styles.sequenceItem, styles.questionMark]}>
                <Text style={[theme.globalStyles.body, styles.sequenceText]}>?</Text>
              </View>
            </View>
          </View>
        );

      case 'word-association':
        return (
          <View style={styles.questionContainer}>
            <Text style={[theme.globalStyles.h3, styles.questionTitle]}>
              What category do these words belong to?
            </Text>
            <View style={styles.wordsContainer}>
              {puzzle.words.map((word, index) => (
                <View key={index} style={styles.wordItem}>
                  <Text style={[theme.globalStyles.body, styles.wordText]}>{word}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'spatial-reasoning':
        return (
          <View style={styles.questionContainer}>
            <Text style={[theme.globalStyles.h3, styles.questionTitle]}>
              Complete the pattern:
            </Text>
            <View style={styles.spatialGrid}>
              {puzzle.grid.map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.spatialCell,
                    index === puzzle.grid.length - 1 && styles.questionCell
                  ]}
                >
                  <Text style={[theme.globalStyles.body, styles.spatialText]}>
                    {index === puzzle.grid.length - 1 ? '?' : item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return (
          <Text style={[theme.globalStyles.body, styles.questionTitle]}>
            {puzzle.instruction}
          </Text>
        );
    }
  };

  const renderOptions = () => {
    if (!puzzle || !puzzle.options) return null;

    return (
      <View style={styles.optionsContainer}>
        {puzzle.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption,
              feedbackVisible && selectedAnswer === option && 
                (isCorrect ? styles.correctOption : styles.incorrectOption)
            ]}
            onPress={() => handleAnswerSelect(option)}
            disabled={feedbackVisible}
          >
            <Text style={[
              theme.globalStyles.body, 
              styles.optionText,
              selectedAnswer === option && styles.selectedOptionText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
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
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.header}>
        <Text style={[theme.globalStyles.h3, styles.title]}>Logic Challenge</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{difficulty.toUpperCase()}</Text>
        </View>
      </View>

      {renderQuestion()}
      {renderOptions()}

      {feedbackVisible && (
        <View style={[
          styles.feedbackContainer,
          isCorrect ? styles.successFeedback : styles.errorFeedback
        ]}>
          <Text style={[
            theme.globalStyles.body,
            styles.feedbackText,
            isCorrect ? styles.successText : styles.errorText
          ]}>
            {isCorrect 
              ? '🎉 Correct! Excellent reasoning!' 
              : `❌ Incorrect. The correct answer is ${puzzle.correctAnswer || puzzle.nextElement || puzzle.nextNumber}`
            }
          </Text>
        </View>
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
  questionContainer: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.medium,
  },
  questionTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  sequenceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sequenceItem: {
    minWidth: 50,
    height: 50,
    backgroundColor: theme.colors.background,
    borderRadius: theme.layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.xs,
  },
  questionMark: {
    backgroundColor: theme.colors.primary + '30',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
  },
  sequenceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  wordsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  wordItem: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.layout.borderRadius.medium,
    margin: theme.spacing.xs,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  spatialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  spatialCell: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.background,
    borderRadius: theme.layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.xs,
  },
  questionCell: {
    backgroundColor: theme.colors.primary + '30',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
  },
  spatialText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  optionButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
  },
  correctOption: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + '20',
  },
  incorrectOption: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.error + '20',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  feedbackContainer: {
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.medium,
    marginTop: theme.spacing.lg,
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
});

export default LogicPuzzle;

// PuzzleService.js
import generateMathPuzzle from '../utils/MathPuzzleGenerator';
import generateMemoryPuzzle from '../utils/MemoryGameGenerator';
import generateLogicPuzzle from '../utils/LogicPuzzleGenerator';
import storageService from './StorageService';

class PuzzleService {
  constructor() {
    this.currentPuzzle = null;
    this.startTime = null;
    this.attempts = 0;
    this.hintsUsed = 0;
  }

  // Generate a puzzle based on category and difficulty
  generatePuzzle(category = 'math', difficulty = 'medium', subType = null) {
    this.startTime = Date.now();
    this.attempts = 0;
    this.hintsUsed = 0;

    switch (category) {
      case 'math':
        this.currentPuzzle = generateMathPuzzle(difficulty);
        break;
      case 'memory':
        this.currentPuzzle = generateMemoryPuzzle(subType || 'sequence', difficulty);
        break;
      case 'logic':
        this.currentPuzzle = generateLogicPuzzle(subType || 'pattern', difficulty);
        break;
      default:
        throw new Error('Unsupported puzzle category');
    }

    this.currentPuzzle.id = Date.now().toString();
    this.currentPuzzle.category = category;
    this.currentPuzzle.generatedAt = this.startTime;

    return this.currentPuzzle;
  }

  // Validate math puzzle answer
  validateMathAnswer(userAnswer) {
    if (!this.currentPuzzle || this.currentPuzzle.type !== 'math') {
      throw new Error('No active math puzzle');
    }

    const numericAnswer = parseInt(userAnswer, 10);
    const isCorrect = numericAnswer === this.currentPuzzle.solution;
    
    return {
      isCorrect,
      correctAnswer: this.currentPuzzle.solution,
      userAnswer: numericAnswer
    };
  }

  // Validate memory puzzle answer
  validateMemoryAnswer(userAnswer) {
    if (!this.currentPuzzle || !this.currentPuzzle.type.includes('memory')) {
      throw new Error('No active memory puzzle');
    }

    let isCorrect = false;
    let correctAnswer;

    switch (this.currentPuzzle.type) {
      case 'sequence-memory':
        correctAnswer = this.currentPuzzle.sequence;
        isCorrect = this.arraysEqual(userAnswer, correctAnswer);
        break;
      case 'number-sequence':
        correctAnswer = this.currentPuzzle.sequence;
        isCorrect = this.arraysEqual(userAnswer, correctAnswer);
        break;
      case 'pattern-memory':
        correctAnswer = this.currentPuzzle.pattern;
        isCorrect = this.arraysEqual(userAnswer.sort(), correctAnswer.sort());
        break;
      case 'word-memory':
        correctAnswer = this.currentPuzzle.words;
        isCorrect = this.arraysEqual(userAnswer.sort(), correctAnswer.sort());
        break;
    }

    return {
      isCorrect,
      correctAnswer,
      userAnswer
    };
  }

  // Validate logic puzzle answer
  validateLogicAnswer(userAnswer) {
    if (!this.currentPuzzle || !this.currentPuzzle.type.includes('pattern') && 
        !this.currentPuzzle.type.includes('word-association') && 
        !this.currentPuzzle.type.includes('spatial')) {
      throw new Error('No active logic puzzle');
    }

    let isCorrect = false;
    let correctAnswer;

    switch (this.currentPuzzle.type) {
      case 'pattern-sequence':
        correctAnswer = this.currentPuzzle.nextElement;
        isCorrect = userAnswer === correctAnswer;
        break;
      case 'number-pattern':
        correctAnswer = this.currentPuzzle.nextNumber;
        isCorrect = parseInt(userAnswer, 10) === correctAnswer;
        break;
      case 'word-association':
        correctAnswer = this.currentPuzzle.correctAnswer;
        isCorrect = userAnswer === correctAnswer;
        break;
      case 'spatial-reasoning':
        correctAnswer = this.currentPuzzle.correctAnswer;
        isCorrect = userAnswer === correctAnswer;
        break;
    }

    return {
      isCorrect,
      correctAnswer,
      userAnswer
    };
  }

  // General validation method
  validateAnswer(userAnswer) {
    if (!this.currentPuzzle) {
      throw new Error('No active puzzle');
    }

    this.attempts++;
    let result;

    switch (this.currentPuzzle.category) {
      case 'math':
        result = this.validateMathAnswer(userAnswer);
        break;
      case 'memory':
        result = this.validateMemoryAnswer(userAnswer);
        break;
      case 'logic':
        result = this.validateLogicAnswer(userAnswer);
        break;
      default:
        throw new Error('Unsupported puzzle category');
    }

    // Calculate score if correct
    if (result.isCorrect) {
      const timeSpent = Date.now() - this.startTime;
      const score = this.calculateScore(timeSpent, this.attempts, this.hintsUsed);
      result.score = score;
      result.timeSpent = timeSpent;
      result.attempts = this.attempts;
      result.hintsUsed = this.hintsUsed;

      // Save puzzle completion
      this.savePuzzleCompletion(result);
    }

    return result;
  }

  // Calculate score based on performance
  calculateScore(timeSpent, attempts, hintsUsed) {
    const timeInSeconds = timeSpent / 1000;
    let baseScore = 1000;

    // Difficulty multipliers
    const difficultyMultipliers = {
      easy: 1.0,
      medium: 1.5,
      hard: 2.0
    };

    // Apply difficulty multiplier
    baseScore *= difficultyMultipliers[this.currentPuzzle.difficulty] || 1.0;

    // Time penalty (lose points for taking longer)
    const timePenalty = Math.max(0, timeInSeconds - 30) * 2; // 2 points per second after 30s
    baseScore -= timePenalty;

    // Attempt penalty (lose points for wrong attempts)
    const attemptPenalty = (attempts - 1) * 100; // 100 points per wrong attempt
    baseScore -= attemptPenalty;

    // Hint penalty (lose points for using hints)
    const hintPenalty = hintsUsed * 50; // 50 points per hint
    baseScore -= hintPenalty;

    // Ensure minimum score of 10
    return Math.max(10, Math.round(baseScore));
  }

  // Save puzzle completion to storage
  async savePuzzleCompletion(result) {
    try {
      const puzzleStats = {
        puzzleId: this.currentPuzzle.id,
        category: this.currentPuzzle.category,
        type: this.currentPuzzle.type,
        difficulty: this.currentPuzzle.difficulty,
        score: result.score,
        timeSpent: result.timeSpent,
        attempts: result.attempts,
        hintsUsed: result.hintsUsed,
        completedAt: Date.now(),
        isCorrect: result.isCorrect
      };

      // Get existing puzzle stats
      const existingStats = await storageService.getUserSettings();
      const puzzleHistory = existingStats?.puzzleHistory || [];
      
      // Add new completion
      puzzleHistory.push(puzzleStats);
      
      // Keep only last 100 completions
      if (puzzleHistory.length > 100) {
        puzzleHistory.splice(0, puzzleHistory.length - 100);
      }

      // Update settings
      await storageService.setUserSettings({
        ...existingStats,
        puzzleHistory,
        lastPuzzleCompleted: Date.now()
      });

      console.log('Puzzle completion saved:', puzzleStats);
    } catch (error) {
      console.error('Error saving puzzle completion:', error);
    }
  }

  // Get puzzle statistics
  async getPuzzleStats() {
    try {
      const settings = await storageService.getUserSettings();
      const puzzleHistory = settings?.puzzleHistory || [];

      if (puzzleHistory.length === 0) {
        return {
          totalCompleted: 0,
          averageScore: 0,
          averageTime: 0,
          bestScore: 0,
          categoryStats: {},
          difficultyStats: {}
        };
      }

      // Calculate statistics
      const totalCompleted = puzzleHistory.length;
      const totalScore = puzzleHistory.reduce((sum, puzzle) => sum + puzzle.score, 0);
      const totalTime = puzzleHistory.reduce((sum, puzzle) => sum + puzzle.timeSpent, 0);
      const averageScore = Math.round(totalScore / totalCompleted);
      const averageTime = Math.round(totalTime / totalCompleted);
      const bestScore = Math.max(...puzzleHistory.map(p => p.score));

      // Category statistics
      const categoryStats = {};
      const difficultyStats = {};

      puzzleHistory.forEach(puzzle => {
        // Category stats
        if (!categoryStats[puzzle.category]) {
          categoryStats[puzzle.category] = { count: 0, totalScore: 0, averageScore: 0 };
        }
        categoryStats[puzzle.category].count++;
        categoryStats[puzzle.category].totalScore += puzzle.score;
        categoryStats[puzzle.category].averageScore = Math.round(
          categoryStats[puzzle.category].totalScore / categoryStats[puzzle.category].count
        );

        // Difficulty stats
        if (!difficultyStats[puzzle.difficulty]) {
          difficultyStats[puzzle.difficulty] = { count: 0, totalScore: 0, averageScore: 0 };
        }
        difficultyStats[puzzle.difficulty].count++;
        difficultyStats[puzzle.difficulty].totalScore += puzzle.score;
        difficultyStats[puzzle.difficulty].averageScore = Math.round(
          difficultyStats[puzzle.difficulty].totalScore / difficultyStats[puzzle.difficulty].count
        );
      });

      return {
        totalCompleted,
        averageScore,
        averageTime,
        bestScore,
        categoryStats,
        difficultyStats,
        recentPuzzles: puzzleHistory.slice(-10).reverse() // Last 10 puzzles
      };
    } catch (error) {
      console.error('Error getting puzzle stats:', error);
      return null;
    }
  }

  // Use hint (reduces score)
  useHint() {
    if (!this.currentPuzzle) {
      throw new Error('No active puzzle');
    }

    this.hintsUsed++;
    let hint = '';

    switch (this.currentPuzzle.category) {
      case 'math':
        hint = `Try breaking down the problem: ${this.currentPuzzle.problem}`;
        break;
      case 'memory':
        hint = 'Focus on patterns or groupings to help remember';
        break;
      case 'logic':
        if (this.currentPuzzle.type === 'pattern-sequence') {
          hint = `Look for the pattern type: ${this.currentPuzzle.patternType}`;
        } else {
          hint = 'Think about what connects these elements together';
        }
        break;
    }

    return {
      hint,
      hintsUsed: this.hintsUsed,
      scoreReduction: this.hintsUsed * 50
    };
  }

  // Helper method to compare arrays
  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
  }

  // Get current puzzle
  getCurrentPuzzle() {
    return this.currentPuzzle;
  }

  // Reset current puzzle
  resetPuzzle() {
    this.currentPuzzle = null;
    this.startTime = null;
    this.attempts = 0;
    this.hintsUsed = 0;
  }
}

export const puzzleService = new PuzzleService();
export default puzzleService;

// MemoryGameGenerator.js

// Function to generate random integers
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate sequence memory puzzle
export const generateSequenceMemory = (difficulty = 'medium') => {
  let sequenceLength, options;
  
  switch (difficulty) {
    case 'easy':
      sequenceLength = 4;
      options = ['🔴', '🔵', '🟢', '🟡'];
      break;
    case 'medium':
      sequenceLength = 6;
      options = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
      break;
    case 'hard':
      sequenceLength = 8;
      options = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚫', '⚪'];
      break;
    default:
      throw new Error('Unsupported difficulty level');
  }

  const sequence = [];
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(options[getRandomInt(0, options.length - 1)]);
  }

  return {
    sequence,
    sequenceLength,
    availableOptions: options,
    difficulty,
    type: 'sequence-memory',
    instruction: 'Memorize the sequence and repeat it in the correct order'
  };
};

// Generate number sequence memory puzzle
export const generateNumberSequence = (difficulty = 'medium') => {
  let sequenceLength, digitRange;
  
  switch (difficulty) {
    case 'easy':
      sequenceLength = 4;
      digitRange = [1, 5];
      break;
    case 'medium':
      sequenceLength = 6;
      digitRange = [1, 9];
      break;
    case 'hard':
      sequenceLength = 8;
      digitRange = [0, 9];
      break;
    default:
      throw new Error('Unsupported difficulty level');
  }

  const sequence = [];
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(getRandomInt(digitRange[0], digitRange[1]));
  }

  return {
    sequence,
    sequenceLength,
    difficulty,
    type: 'number-sequence',
    instruction: 'Memorize the number sequence and enter it correctly'
  };
};

// Generate pattern memory puzzle
export const generatePatternMemory = (difficulty = 'medium') => {
  let gridSize, patternCount;
  
  switch (difficulty) {
    case 'easy':
      gridSize = 3;
      patternCount = 4;
      break;
    case 'medium':
      gridSize = 4;
      patternCount = 6;
      break;
    case 'hard':
      gridSize = 4;
      patternCount = 8;
      break;
    default:
      throw new Error('Unsupported difficulty level');
  }

  // Create grid positions
  const totalCells = gridSize * gridSize;
  const availablePositions = Array.from({ length: totalCells }, (_, i) => i);
  const shuffledPositions = shuffleArray(availablePositions);
  const pattern = shuffledPositions.slice(0, patternCount);

  return {
    gridSize,
    pattern: pattern.sort((a, b) => a - b), // Sort for consistent display
    patternCount,
    totalCells,
    difficulty,
    type: 'pattern-memory',
    instruction: 'Memorize the highlighted pattern and recreate it'
  };
};

// Generate word memory puzzle
export const generateWordMemory = (difficulty = 'medium') => {
  const easyWords = ['CAT', 'DOG', 'SUN', 'MOON', 'TREE', 'BIRD', 'FISH', 'STAR'];
  const mediumWords = ['APPLE', 'HOUSE', 'WATER', 'MUSIC', 'HAPPY', 'LIGHT', 'DREAM', 'PEACE'];
  const hardWords = ['ELEPHANT', 'RAINBOW', 'BUTTERFLY', 'MOUNTAIN', 'CHOCOLATE', 'ADVENTURE', 'MYSTERY', 'JOURNEY'];
  
  let wordList, wordCount;
  
  switch (difficulty) {
    case 'easy':
      wordList = easyWords;
      wordCount = 4;
      break;
    case 'medium':
      wordList = mediumWords;
      wordCount = 5;
      break;
    case 'hard':
      wordList = hardWords;
      wordCount = 6;
      break;
    default:
      throw new Error('Unsupported difficulty level');
  }

  const shuffledWords = shuffleArray(wordList);
  const selectedWords = shuffledWords.slice(0, wordCount);

  return {
    words: selectedWords,
    wordCount,
    difficulty,
    type: 'word-memory',
    instruction: 'Memorize these words and select them from the list'
  };
};

// Generate memory puzzle based on type
export const generateMemoryPuzzle = (type = 'sequence', difficulty = 'medium') => {
  switch (type) {
    case 'sequence':
      return generateSequenceMemory(difficulty);
    case 'number':
      return generateNumberSequence(difficulty);
    case 'pattern':
      return generatePatternMemory(difficulty);
    case 'word':
      return generateWordMemory(difficulty);
    default:
      return generateSequenceMemory(difficulty);
  }
};

export default generateMemoryPuzzle;

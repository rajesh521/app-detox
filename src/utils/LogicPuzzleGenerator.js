// LogicPuzzleGenerator.js

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

// Generate pattern sequence puzzle
export const generatePatternSequence = (difficulty = 'medium') => {
  let sequenceLength, options;
  
  switch (difficulty) {
    case 'easy':
      sequenceLength = 4;
      options = ['A', 'B', 'C'];
      break;
    case 'medium':
      sequenceLength = 6;
      options = ['A', 'B', 'C', 'D'];
      break;
    case 'hard':
      sequenceLength = 8;
      options = ['A', 'B', 'C', 'D', 'E'];
      break;
    default:
      throw new Error('Unsupported difficulty level');
  }

  // Generate different pattern types
  const patternTypes = ['alternating', 'repeating', 'increment'];
  const patternType = patternTypes[getRandomInt(0, patternTypes.length - 1)];
  
  let sequence = [];
  let nextElement;

  switch (patternType) {
    case 'alternating':
      // A, B, A, B, A, ?
      for (let i = 0; i < sequenceLength; i++) {
        sequence.push(options[i % 2]);
      }
      nextElement = options[sequenceLength % 2];
      break;
      
    case 'repeating':
      // A, A, B, B, C, C, ?
      const repeatCount = 2;
      let currentOption = 0;
      let count = 0;
      for (let i = 0; i < sequenceLength; i++) {
        sequence.push(options[currentOption]);
        count++;
        if (count === repeatCount) {
          currentOption = (currentOption + 1) % options.length;
          count = 0;
        }
      }
      nextElement = options[currentOption];
      break;
      
    case 'increment':
      // A, B, C, A, B, C, ?
      for (let i = 0; i < sequenceLength; i++) {
        sequence.push(options[i % options.length]);
      }
      nextElement = options[sequenceLength % options.length];
      break;
  }

  return {
    sequence,
    nextElement,
    options,
    patternType,
    difficulty,
    type: 'pattern-sequence',
    instruction: 'Find the next element in the sequence'
  };
};

// Generate number pattern puzzle
export const generateNumberPattern = (difficulty = 'medium') => {
  let sequenceLength;
  
  switch (difficulty) {
    case 'easy':
      sequenceLength = 4;
      break;
    case 'medium':
      sequenceLength = 5;
      break;
    case 'hard':
      sequenceLength = 6;
      break;
    default:
      throw new Error('Unsupported difficulty level');
  }

  const patternTypes = ['arithmetic', 'geometric', 'fibonacci'];
  const patternType = patternTypes[getRandomInt(0, patternTypes.length - 1)];
  
  let sequence = [];
  let nextNumber;

  switch (patternType) {
    case 'arithmetic':
      // Arithmetic sequence: 2, 5, 8, 11, ?
      const start = getRandomInt(1, 10);
      const diff = getRandomInt(2, 5);
      for (let i = 0; i < sequenceLength; i++) {
        sequence.push(start + i * diff);
      }
      nextNumber = start + sequenceLength * diff;
      break;
      
    case 'geometric':
      // Geometric sequence: 2, 6, 18, 54, ?
      const base = getRandomInt(2, 4);
      const multiplier = getRandomInt(2, 3);
      for (let i = 0; i < sequenceLength; i++) {
        sequence.push(base * Math.pow(multiplier, i));
      }
      nextNumber = base * Math.pow(multiplier, sequenceLength);
      break;
      
    case 'fibonacci':
      // Fibonacci-like sequence
      const first = getRandomInt(1, 3);
      const second = getRandomInt(2, 4);
      sequence = [first, second];
      for (let i = 2; i < sequenceLength; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
      }
      nextNumber = sequence[sequenceLength - 1] + sequence[sequenceLength - 2];
      break;
  }

  return {
    sequence,
    nextNumber,
    patternType,
    difficulty,
    type: 'number-pattern',
    instruction: 'Find the next number in the sequence'
  };
};

// Generate word association puzzle
export const generateWordAssociation = (difficulty = 'medium') => {
  const associations = {
    easy: [
      { words: ['RED', 'BLUE', 'GREEN'], answer: 'COLORS', category: 'Colors' },
      { words: ['CAT', 'DOG', 'BIRD'], answer: 'ANIMALS', category: 'Animals' },
      { words: ['SUN', 'MOON', 'STAR'], answer: 'SKY', category: 'Sky objects' },
      { words: ['BOOK', 'PEN', 'PAPER'], answer: 'WRITING', category: 'Writing tools' }
    ],
    medium: [
      { words: ['PIANO', 'GUITAR', 'VIOLIN'], answer: 'INSTRUMENTS', category: 'Musical instruments' },
      { words: ['APPLE', 'BANANA', 'ORANGE'], answer: 'FRUITS', category: 'Fruits' },
      { words: ['CHAIR', 'TABLE', 'SOFA'], answer: 'FURNITURE', category: 'Furniture' },
      { words: ['DOCTOR', 'TEACHER', 'ENGINEER'], answer: 'PROFESSIONS', category: 'Professions' }
    ],
    hard: [
      { words: ['MERCURY', 'VENUS', 'EARTH'], answer: 'PLANETS', category: 'Planets' },
      { words: ['DEMOCRACY', 'MONARCHY', 'REPUBLIC'], answer: 'GOVERNMENT', category: 'Government types' },
      { words: ['METAPHOR', 'SIMILE', 'ALLITERATION'], answer: 'FIGURES', category: 'Literary devices' },
      { words: ['PHOTOSYNTHESIS', 'RESPIRATION', 'DIGESTION'], answer: 'PROCESSES', category: 'Biological processes' }
    ]
  };

  const levelAssociations = associations[difficulty];
  const selected = levelAssociations[getRandomInt(0, levelAssociations.length - 1)];
  
  // Create wrong options
  const allCategories = ['COLORS', 'ANIMALS', 'INSTRUMENTS', 'FRUITS', 'FURNITURE', 'PROFESSIONS', 'PLANETS', 'GOVERNMENT', 'FIGURES', 'PROCESSES'];
  const wrongOptions = allCategories.filter(cat => cat !== selected.answer);
  const shuffledWrong = shuffleArray(wrongOptions);
  const options = [selected.answer, ...shuffledWrong.slice(0, 3)];

  return {
    words: selected.words,
    correctAnswer: selected.answer,
    category: selected.category,
    options: shuffleArray(options),
    difficulty,
    type: 'word-association',
    instruction: 'What category do these words belong to?'
  };
};

// Generate spatial reasoning puzzle
export const generateSpatialReasoning = (difficulty = 'medium') => {
  let gridSize, shapes;
  
  switch (difficulty) {
    case 'easy':
      gridSize = 3;
      shapes = ['●', '■', '▲'];
      break;
    case 'medium':
      gridSize = 3;
      shapes = ['●', '■', '▲', '♦'];
      break;
    case 'hard':
      gridSize = 4;
      shapes = ['●', '■', '▲', '♦', '★'];
      break;
    default:
      throw new Error('Unsupported difficulty level');
  }

  // Create a pattern grid
  const totalCells = gridSize * gridSize;
  const grid = Array(totalCells).fill('');
  
  // Fill grid with pattern
  for (let i = 0; i < totalCells - 1; i++) {
    grid[i] = shapes[i % shapes.length];
  }
  
  // Last cell is the question
  const correctAnswer = shapes[(totalCells - 1) % shapes.length];
  
  // Create wrong options
  const wrongOptions = shapes.filter(shape => shape !== correctAnswer);
  const options = [correctAnswer, ...shuffleArray(wrongOptions).slice(0, 2)];

  return {
    grid,
    gridSize,
    correctAnswer,
    options: shuffleArray(options),
    difficulty,
    type: 'spatial-reasoning',
    instruction: 'Complete the pattern by selecting the missing shape'
  };
};

// Generate logic puzzle based on type
export const generateLogicPuzzle = (type = 'pattern', difficulty = 'medium') => {
  switch (type) {
    case 'pattern':
      return generatePatternSequence(difficulty);
    case 'number':
      return generateNumberPattern(difficulty);
    case 'word':
      return generateWordAssociation(difficulty);
    case 'spatial':
      return generateSpatialReasoning(difficulty);
    default:
      return generatePatternSequence(difficulty);
  }
};

export default generateLogicPuzzle;

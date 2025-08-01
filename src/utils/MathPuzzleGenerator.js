// MathPuzzleGenerator.js

// Function to generate random integers
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate based on operator
function calculate(num1, operator, num2) {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return Math.floor(num1 / num2);
    default:
      throw new Error('Invalid operator');
  }
}

// Math Puzzle Generator with difficulty levels
export const generateMathPuzzle = (difficulty = 'medium') => {
  let num1, num2, operator, solution;
  
  switch(difficulty) {
    case 'easy':
      num1 = getRandomInt(1, 10);
      num2 = getRandomInt(1, 10);
      operator = ['+', '-'][getRandomInt(0, 1)];
      // Ensure no negative results for easy mode
      if (operator === '-' && num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      solution = calculate(num1, operator, num2);
      break;
      
    case 'medium':
      num1 = getRandomInt(5, 25);
      num2 = getRandomInt(2, 15);
      operator = ['+', '-', '*'][getRandomInt(0, 2)];
      // Ensure reasonable results
      if (operator === '-' && num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      solution = calculate(num1, operator, num2);
      break;
      
    case 'hard':
      num1 = getRandomInt(10, 50);
      num2 = getRandomInt(2, 12);
      operator = ['+', '-', '*', '/'][getRandomInt(0, 3)];
      
      // Special handling for division to ensure clean results
      if (operator === '/') {
        num1 = num2 * getRandomInt(2, 8); // Ensure clean division
      } else if (operator === '-' && num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      
      solution = calculate(num1, operator, num2);
      break;
      
    default:
      throw new Error('Unsupported difficulty level');
  }

  return {
    problem: `${num1} ${operator} ${num2}`,
    solution,
    difficulty,
    type: 'math'
  };
};

export default generateMathPuzzle;


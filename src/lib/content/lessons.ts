import type { Lesson, Exercise, Quiz } from '$lib/types.ts'

export const LESSONS: Record<string, Lesson> = {
  'print-statement': {
    id: 'print-statement',
    chapterId: 'chapter-1',
    title: 'The print() Statement',
    description: 'Learn how to display text and output information',
    sections: [
      {
        id: 'print-section-1',
        type: 'text',
        content: 'The `print()` function is how we make Python show information on the screen. It\'s like writing a note that everyone can see!'
      },
      {
        id: 'print-section-2',
        type: 'code',
        content: 'You can print text by putting it inside quotes:',
        codeExample: 'print("Hello, Python City!")'
      },
      {
        id: 'print-section-3',
        type: 'code',
        content: 'You can also print numbers without quotes:',
        codeExample: 'print(42)'
      },
      {
        id: 'print-section-4',
        type: 'code',
        content: 'You can print multiple things by separating them with commas:',
        codeExample: 'print("The answer is", 42)'
      }
    ],
    concepts: ['print'],
    difficulty: 'beginner'
  },
  'variables': {
    id: 'variables',
    chapterId: 'chapter-1',
    title: 'Variables - Storing Information',
    description: 'Learn how to store data in variables for later use',
    sections: [
      {
        id: 'var-section-1',
        type: 'text',
        content: 'Variables are like labeled boxes where you can store information. You give the box a name, and put something inside it.'
      },
      {
        id: 'var-section-2',
        type: 'code',
        content: 'Create a variable using the equals sign (=):',
        codeExample: 'name = "Zara"\nage = 10'
      },
      {
        id: 'var-section-3',
        type: 'code',
        content: 'You can use variables to retrieve the stored value:',
        codeExample: 'name = "Zara"\nprint(name)  # Prints: Zara'
      },
      {
        id: 'var-section-4',
        type: 'text',
        content: 'Variable names should be descriptive and can only contain letters, numbers, and underscores. They cannot start with a number.'
      }
    ],
    concepts: ['variables'],
    difficulty: 'beginner'
  },
  'for-loops': {
    id: 'for-loops',
    chapterId: 'chapter-2',
    title: 'For Loops - Repeating Actions',
    description: 'Learn how to repeat code multiple times using loops',
    sections: [
      {
        id: 'loop-section-1',
        type: 'text',
        content: 'A for loop lets you repeat code multiple times. It\'s perfect when you need to do the same thing over and over!'
      },
      {
        id: 'loop-section-2',
        type: 'code',
        content: 'Use range() to repeat a specific number of times:',
        codeExample: 'for i in range(3):\n    print("Hello!")\n\n# Output:\n# Hello!\n# Hello!\n# Hello!'
      },
      {
        id: 'loop-section-3',
        type: 'code',
        content: 'You can loop through items in a list:',
        codeExample: 'colors = ["red", "green", "blue"]\nfor color in colors:\n    print(color)'
      },
      {
        id: 'loop-section-4',
        type: 'text',
        content: 'Important: The code inside a loop must be indented (have spaces at the beginning). Python uses indentation to know which code is inside the loop.'
      }
    ],
    concepts: ['loops'],
    difficulty: 'beginner'
  },
  'conditionals': {
    id: 'conditionals',
    chapterId: 'chapter-3',
    title: 'Conditionals - Making Decisions',
    description: 'Learn how to make your code make decisions',
    sections: [
      {
        id: 'cond-section-1',
        type: 'text',
        content: 'Conditionals let your code make decisions. You can check if something is true and run different code based on the result.'
      },
      {
        id: 'cond-section-2',
        type: 'code',
        content: 'Use if to run code only when a condition is true:',
        codeExample: 'age = 10\nif age < 18:\n    print("You are a child")'
      },
      {
        id: 'cond-section-3',
        type: 'code',
        content: 'Use else to run code when the condition is false:',
        codeExample: 'age = 20\nif age < 18:\n    print("Child")\nelse:\n    print("Adult")'
      },
      {
        id: 'cond-section-4',
        type: 'code',
        content: 'Use elif to check multiple conditions:',
        codeExample: 'age = 25\nif age < 18:\n    print("Child")\nelif age < 65:\n    print("Adult")\nelse:\n    print("Senior")'
      }
    ],
    concepts: ['conditionals'],
    difficulty: 'beginner'
  }
}

export const EXERCISES: Record<string, Exercise> = {
  'exercise-1': {
    id: 'exercise-1',
    problem: 'Print your name on the screen',
    starterCode: '# Print your name here\n',
    expectedOutput: '',
    hints: ['Use the print() function', 'Put your name in quotes'],
    solution: 'print("Your Name")'
  }
}

export const QUIZZES: Record<string, Quiz> = {
  'quiz-print': {
    id: 'quiz-print',
    question: 'Which function displays text on the screen?',
    options: ['display()', 'print()', 'show()', 'output()'],
    correctAnswer: 1,
    explanation: 'The print() function is used to display text in Python.'
  },
  'quiz-var': {
    id: 'quiz-var',
    question: 'How do you create a variable named "score" with value 100?',
    options: ['score = 100', 'var score = 100', '100 = score', 'score: 100'],
    correctAnswer: 0,
    explanation: 'In Python, you create variables using the equals sign (=), like: score = 100'
  },
  'quiz-loop': {
    id: 'quiz-loop',
    question: 'How many times will "Hello" be printed?',
    options: ['3 times', '4 times', '5 times', 'Error'],
    correctAnswer: 0,
    explanation: 'range(3) gives us 0, 1, 2, so the loop runs 3 times.'
  },
  'quiz-cond': {
    id: 'quiz-cond',
    question: 'What keyword do you use for "otherwise" in Python?',
    options: ['otherwise', 'else', 'elif', 'except'],
    correctAnswer: 1,
    explanation: 'The else keyword is used for the "otherwise" case in conditionals.'
  }
}

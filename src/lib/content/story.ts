import type { Story, Chapter, Scene } from '$lib/types.ts'

const STORY_DATA: Story = {
  id: 'python-city',
  title: 'The Python City Adventure',
  description: 'Help the citizens of Python City solve their problems using code!',
  chapters: [
    {
      id: 'chapter-1',
      title: 'Welcome to Python City',
      description: 'Learn the basics of Python while helping new friends',
      order: 1,
      requirements: [],
      scenes: [
        {
          id: 'scene-1-1',
          chapterId: 'chapter-1',
          text: 'You arrive in Python City, a futuristic place where everything runs on code. The sun shines through buildings made of glowing numbers and symbols.',
          character: {
            id: 'zara',
            name: 'Zara',
            avatar: '👧',
            personality: 'Curious and friendly'
          },
          requirements: []
        },
        {
          id: 'scene-1-2',
          chapterId: 'chapter-1',
          text: '"Hi there! I\'m Zara! I\'ve been trying to create a sign for our city festival, but I don\'t know how to show messages on the big screen."',
          character: {
            id: 'zara',
            name: 'Zara',
            avatar: '👧',
            personality: 'Curious and friendly'
          },
          challenge: {
            type: 'exercise',
            problem: 'Help Zara display "Welcome to Python City!" on the screen',
            lesson: 'print-statement',
            starterCode: '# Write your code here\n',
            expectedOutput: 'Welcome to Python City!',
            solution: 'print("Welcome to Python City!")',
            hints: [
              'Use the print() function to display text',
              'Put your message inside quotes',
              'Don\'t forget the parentheses!'
            ]
          },
          requirements: ['print']
        },
        {
          id: 'scene-1-3',
          chapterId: 'chapter-1',
          text: '"Wow! The message appeared on the big screen! You\'re amazing at this! Let me introduce you to my friend Byte."',
          character: {
            id: 'zara',
            name: 'Zara',
            avatar: '👧',
            personality: 'Curious and friendly'
          },
          choices: [
            {
              id: 'choice-1-1',
              text: 'I\'d love to meet Byte!',
              targetSceneId: 'scene-1-4'
            }
          ],
          requirements: []
        },
        {
          id: 'scene-1-4',
          chapterId: 'chapter-1',
          text: 'You follow Zara to the town square. There, you meet a small robot character.',
          character: {
            id: 'byte',
            name: 'Byte',
            avatar: '🤖',
            personality: 'Logical and helpful'
          },
          requirements: []
        },
        {
          id: 'scene-1-5',
          chapterId: 'chapter-1',
          text: '"Beep boop! I\'m Byte. I help organize data in Python City. Right now, I have some numbers that need to be stored for our city\'s population count."',
          character: {
            id: 'byte',
            name: 'Byte',
            avatar: '🤖',
            personality: 'Logical and helpful'
          },
          challenge: {
            type: 'exercise',
            problem: 'Help Byte store the number 5000 in a variable called population',
            lesson: 'variables',
            starterCode: '# Store 5000 in a variable named population\n',
            expectedOutput: '5000',
            requiredPatterns: ['population = 5000', 'print(population)'],
            solution: 'population = 5000\nprint(population)',
            hints: [
              'Use the = sign to assign a value to a variable',
              'The variable name goes on the left, value on the right',
              'You can print the variable to see its value'
            ]
          },
          requirements: ['variables']
        },
        {
          id: 'scene-1-6',
          chapterId: 'chapter-1',
          text: '"Perfect! Now I need to store the city name too. Can you help me create a variable called city_name with the value "Python City"?"',
          character: {
            id: 'byte',
            name: 'Byte',
            avatar: '🤖',
            personality: 'Logical and helpful'
          },
          challenge: {
            type: 'exercise',
            problem: 'Create a variable called city_name with the value "Python City" and print it',
            lesson: 'variables',
            starterCode: '# Create city_name variable\n',
            expectedOutput: 'Python City',
            requiredPatterns: ['city_name = ', 'print(city_name)'],
            solution: 'city_name = "Python City"\nprint(city_name)',
            hints: [
              'Remember to use quotes for text values',
              'The variable name can use underscores',
              'Print the variable to confirm it works'
            ]
          },
          requirements: ['variables']
        },
        {
          id: 'scene-1-7',
          chapterId: 'chapter-1',
          text: '"Excellent! You\'ve learned the basics of variables! Now Zara, Byte, and I want to thank you for helping us today. Come back tomorrow to learn about loops!"',
          character: {
            id: 'zara',
            name: 'Zara',
            avatar: '👧',
            personality: 'Curious and friendly'
          },
          choices: [
            {
              id: 'choice-1-2',
              text: 'I can\'t wait! See you tomorrow!',
              targetSceneId: 'scene-2-1'
            }
          ],
          requirements: []
        }
      ]
    },
    {
      id: 'chapter-2',
      title: 'Looping Around Town',
      description: 'Learn about loops while helping with city maintenance',
      order: 2,
      requirements: ['print', 'variables'],
      scenes: [
        {
          id: 'scene-2-1',
          chapterId: 'chapter-2',
          text: '"Hello again! I\'m Max, the city\'s maintenance worker. I need to check all 5 street lamps around the park, but doing it one by one takes too long."',
          character: {
            id: 'max',
            name: 'Max',
            avatar: '👨‍🔧',
            personality: 'Hardworking and practical'
          },
          challenge: {
            type: 'exercise',
            problem: 'Help Max print "Checking lamp" 5 times using a loop',
            lesson: 'for-loops',
            starterCode: '# Print "Checking lamp" 5 times\n',
            expectedOutput: 'Checking lamp\nChecking lamp\nChecking lamp\nChecking lamp\nChecking lamp',
            solution: 'for i in range(5):\n    print("Checking lamp")',
            hints: [
              'Use a for loop with range()',
              'range(5) will give you numbers from 0 to 4',
              'Remember to indent the code inside the loop!'
            ]
          },
          requirements: ['loops']
        },
        {
          id: 'scene-2-2',
          chapterId: 'chapter-2',
          text: '"Perfect! That saved me so much time! Now I need to check these lamps: lamp A, lamp B, lamp C, lamp D, and lamp E."',
          character: {
            id: 'max',
            name: 'Max',
            avatar: '👨‍🔧',
            personality: 'Hardworking and practical'
          },
          challenge: {
            type: 'exercise',
            problem: 'Help Max check each lamp by printing "Checking lamp X" where X is A, B, C, D, E',
            lesson: 'for-loops',
            starterCode: 'lamps = ["A", "B", "C", "D", "E"]\n# Print "Checking lamp X" for each lamp\n',
            expectedOutput: 'Checking lamp A\nChecking lamp B\nChecking lamp C\nChecking lamp D\nChecking lamp E',
            solution: 'lamps = ["A", "B", "C", "D", "E"]\nfor lamp in lamps:\n    print("Checking lamp " + lamp)',
            hints: [
              'Use a for loop to go through each item in the list',
              'The loop variable will be each lamp one at a time',
              'Combine the string and the lamp variable using +'
            ]
          },
          requirements: ['loops']
        }
      ]
    },
    {
      id: 'chapter-3',
      title: 'Making Decisions',
      description: 'Learn conditionals to help city officials',
      order: 3,
      requirements: ['print', 'variables', 'loops'],
      scenes: [
        {
          id: 'scene-3-1',
          chapterId: 'chapter-3',
          text: '"I\'m Luna, the city planner. I need to decide which buildings to construct based on how many people will use them. If a building will serve more than 100 people, we make it big. Otherwise, we make it small."',
          character: {
            id: 'luna',
            name: 'Luna',
            avatar: '👩‍🏫',
            personality: 'Wise and organized'
          },
          challenge: {
            type: 'exercise',
            problem: 'Write code that prints "Big building" if visitors > 100, else prints "Small building"',
            lesson: 'conditionals',
            starterCode: 'visitors = 150\n# Write your if/else statement here\n',
            expectedOutput: 'Big building',
            solution: 'visitors = 150\nif visitors > 100:\n    print("Big building")\nelse:\n    print("Small building")',
            hints: [
              'Use the if statement with the condition visitors > 100',
              'Use else for when the condition is false',
              'Remember to indent the code blocks!'
            ]
          },
          requirements: ['conditionals']
        },
        {
          id: 'scene-3-2',
          chapterId: 'chapter-3',
          text: '"Great! Now I need to categorize citizens by age: children are under 18, adults are 18-64, and seniors are 65+. Can you write code that handles all three cases?"',
          character: {
            id: 'luna',
            name: 'Luna',
            avatar: '👩‍🏫',
            personality: 'Wise and organized'
          },
          challenge: {
            type: 'exercise',
            problem: 'Write code that prints "Child", "Adult", or "Senior" based on age using if, elif, and else',
            lesson: 'conditionals',
            starterCode: 'age = 25\n# Write your if/elif/else statement\n',
            expectedOutput: 'Adult',
            solution: 'age = 25\nif age < 18:\n    print("Child")\nelif age < 65:\n    print("Adult")\nelse:\n    print("Senior")',
            hints: [
              'Start with if for the first condition',
              'Use elif for additional conditions',
              'Use else for the final case'
            ]
          },
          requirements: ['conditionals']
        }
      ]
    }
  ]
}

export function getStory(): Story {
  return STORY_DATA
}

export function getChapter(chapterId: string): Chapter | undefined {
  return STORY_DATA.chapters.find((ch) => ch.id === chapterId)
}

export function getScene(sceneId: string): Scene | undefined {
  for (const chapter of STORY_DATA.chapters) {
    const scene = chapter.scenes.find((sc) => sc.id === sceneId)
    if (scene) return scene
  }
  return undefined
}

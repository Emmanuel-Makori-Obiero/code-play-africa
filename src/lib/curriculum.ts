export type Exercise = {
  prompt: string;
  starter: string;
  expected: string; // what console output should contain
  hint: string;
};

export type Game =
  | { kind: "predict"; code: string; choices: string[]; answer: number; explain: string }
  | { kind: "bug"; buggy: string; choices: string[]; answer: number; explain: string }
  | { kind: "match"; pairs: { left: string; right: string }[] }
  | { kind: "fill"; code: string; blanks: string[]; answers: string[]; explain: string };

export type Module = {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  story: string; // African/Kenyan-friendly intro
  lesson: { heading: string; body: string; code?: string }[];
  game: Game;
  exercise: Exercise;
};

export const MODULES: Module[] = [
  {
    id: "variables",
    emoji: "🥭",
    title: "Module 1 — Boxes called Variables",
    tagline: "Store mangoes, names and scores",
    story:
      "Imagine you go to the market in Nairobi with a basket. A variable is just a basket with a name on it where you keep ONE thing — a number, a word, or even true/false.",
    lesson: [
      {
        heading: "Making a basket",
        body: "We use let to make a basket. Give it a name, then put something inside with =.",
        code: `let mangoes = 5;\nlet name = "Amani";\nconsole.log(name, "has", mangoes, "mangoes");`,
      },
      {
        heading: "Changing what's inside",
        body: "You can swap what is inside the basket any time.",
        code: `let score = 0;\nscore = score + 10; // now 10\nconsole.log(score);`,
      },
    ],
    game: {
      kind: "predict",
      code: `let goats = 3;\ngoats = goats + 2;\nconsole.log(goats);`,
      choices: ["3", "5", "23", "Error"],
      answer: 1,
      explain: "3 + 2 = 5. The basket called goats now holds 5.",
    },
    exercise: {
      prompt: "Create a variable called bananas with value 7 and print it.",
      starter: `// Write your code below\n`,
      expected: "7",
      hint: "Use: let bananas = 7; then console.log(bananas);",
    },
  },
  {
    id: "types",
    emoji: "🎨",
    title: "Module 2 — Types of stuff",
    tagline: "Numbers, words and yes/no",
    story:
      "At the duka (shop) you have prices (numbers), names of items (words) and questions like 'is it open?' (true/false). JavaScript has the same three families: number, string, boolean.",
    lesson: [
      {
        heading: "The three friends",
        body: "Numbers have no quotes. Strings live inside \"quotes\". Booleans are only true or false.",
        code: `let price = 50;          // number\nlet item = "sukuma";    // string\nlet open = true;         // boolean`,
      },
      {
        heading: "Joining words",
        body: "Use + to glue strings together.",
        code: `let greet = "Jambo, " + "rafiki!";\nconsole.log(greet);`,
      },
    ],
    game: {
      kind: "match",
      pairs: [
        { left: '"Nairobi"', right: "string" },
        { left: "42", right: "number" },
        { left: "false", right: "boolean" },
        { left: '"true"', right: "string" },
      ],
    },
    exercise: {
      prompt: "Make a string variable city = \"Mombasa\" and print it.",
      starter: `// Your turn\n`,
      expected: "Mombasa",
      hint: 'let city = "Mombasa"; console.log(city);',
    },
  },
  {
    id: "ifs",
    emoji: "🚦",
    title: "Module 3 — Making choices",
    tagline: "if this... then that",
    story:
      "When you cross the road in Kisumu, you look at the traffic light. Green = go, red = stop. Code makes the same choices using if and else.",
    lesson: [
      {
        heading: "if / else",
        body: "If the question is true, do the first block. Otherwise do the else block.",
        code: `let age = 10;\nif (age >= 13) {\n  console.log("teenager");\n} else {\n  console.log("kid");\n}`,
      },
    ],
    game: {
      kind: "bug",
      buggy: `let rain = true;\nif (rain = false) {\n  console.log("go play");\n} else {\n  console.log("stay home");\n}`,
      choices: [
        "Use == or === instead of = inside if",
        "Remove the else block",
        "Change true to 1",
        "Nothing is wrong",
      ],
      answer: 0,
      explain:
        "= means 'put inside'. To COMPARE we need === (or ==). The bug made rain become false!",
    },
    exercise: {
      prompt:
        "Make a variable score = 80. If score >= 50 print \"pass\" else print \"try again\".",
      starter: `let score = 80;\n// add your if/else\n`,
      expected: "pass",
      hint: "if (score >= 50) { console.log('pass'); } else { console.log('try again'); }",
    },
  },
  {
    id: "loops",
    emoji: "🔁",
    title: "Module 4 — Loops (do it again!)",
    tagline: "Count cows without getting tired",
    story:
      "Counting 100 cows one by one is boring. A loop tells the computer: 'do this 100 times for me'. We rest under the acacia tree while it works.",
    lesson: [
      {
        heading: "for loop",
        body: "Start, condition, step. Read it as: start at 1, while i <= 5, add 1 each time.",
        code: `for (let i = 1; i <= 5; i++) {\n  console.log("cow", i);\n}`,
      },
    ],
    game: {
      kind: "predict",
      code: `let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total = total + i;\n}\nconsole.log(total);`,
      choices: ["3", "5", "6", "9"],
      answer: 2,
      explain: "1 + 2 + 3 = 6.",
    },
    exercise: {
      prompt: "Print the numbers 1 to 4 using a for loop.",
      starter: `// for loop here\n`,
      expected: "4",
      hint: "for (let i = 1; i <= 4; i++) { console.log(i); }",
    },
  },
  {
    id: "functions",
    emoji: "🧰",
    title: "Module 5 — Functions (your own tools)",
    tagline: "A recipe you can use again and again",
    story:
      "Mama makes chapati using a recipe. You can use the same recipe many times with different flour. A function is your own recipe in code.",
    lesson: [
      {
        heading: "Make a recipe",
        body: "function name(ingredients) { steps; return result; }",
        code: `function greet(name) {\n  return "Habari, " + name + "!";\n}\nconsole.log(greet("Zuri"));`,
      },
    ],
    game: {
      kind: "fill",
      code: `function double(n) {\n  return n ___ 2;\n}\nconsole.log(double(4)); // 8`,
      blanks: ["operator"],
      answers: ["*"],
      explain: "To double a number we multiply by 2 using *.",
    },
    exercise: {
      prompt: "Write a function add(a, b) that returns a + b. Print add(3, 4).",
      starter: `// function add ...\n`,
      expected: "7",
      hint: "function add(a,b){ return a+b; } console.log(add(3,4));",
    },
  },
];

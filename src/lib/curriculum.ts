export type Exercise = {
  prompt: string;
  starter: string;
  expected: string;
  hint: string;
};

export type QuizQuestion = {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
};

export type Game =
  | { kind: "predict"; code: string; choices: string[]; answer: number; explain: string }
  | { kind: "bug"; buggy: string; choices: string[]; answer: number; explain: string }
  | { kind: "match"; pairs: { left: string; right: string }[] }
  | { kind: "fill"; code: string; blanks: string[]; answers: string[]; explain: string }
  | { kind: "quiz"; questions: QuizQuestion[] };

export type Module = {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  story: string;
  lesson: { heading: string; body: string; code?: string }[];
  game: Game;
  exercises: Exercise[];
  quiz: QuizQuestion[];
};

export const MODULES: Module[] = [
  {
    id: "variables",
    emoji: "🥭",
    title: "M1 — Variables",
    tagline: "Boxes that store mangoes, names, scores",
    level: "Beginner",
    story:
      "At the Nairobi market you carry baskets. A variable is a basket with a name where you keep ONE thing — a number, a word, or true/false.",
    lesson: [
      {
        heading: "let, const, var",
        body: "Use let when the value will change. Use const when it never changes. Avoid var.",
        code: `let mangoes = 5;\nconst name = "Amani";\nmangoes = mangoes + 1;\nconsole.log(name, mangoes);`,
      },
      {
        heading: "Naming rules",
        body: "Names start with a letter, $, or _. No spaces. Use camelCase: myScore, not my score.",
        code: `let myScore = 0;\nlet _hidden = true;`,
      },
    ],
    game: {
      kind: "predict",
      code: `let goats = 3;\ngoats = goats + 2;\nconsole.log(goats);`,
      choices: ["3", "5", "23", "Error"],
      answer: 1,
      explain: "3 + 2 = 5.",
    },
    exercises: [
      {
        prompt: "Make a variable bananas = 7 and print it.",
        starter: `// your code\n`,
        expected: "7",
        hint: "let bananas = 7; console.log(bananas);",
      },
      {
        prompt: "Make const pi = 3.14 and print pi * 2.",
        starter: `// your code\n`,
        expected: "6.28",
        hint: "console.log(pi * 2)",
      },
    ],
    quiz: [
      {
        q: "Which keyword is best when the value WILL change?",
        choices: ["const", "let", "var", "final"],
        answer: 1,
        explain: "let allows reassignment; const does not.",
      },
      {
        q: "Which name is valid?",
        choices: ["2cows", "my score", "myScore", "let"],
        answer: 2,
        explain: "Names cannot start with a digit, contain spaces, or be reserved words.",
      },
    ],
  },
  {
    id: "types",
    emoji: "🎨",
    title: "M2 — Data Types",
    tagline: "Numbers, strings, booleans, null, undefined",
    level: "Beginner",
    story:
      "At the duka you see prices (numbers), names (strings), and yes/no answers (booleans). JS has those plus null (empty on purpose) and undefined (not set yet).",
    lesson: [
      {
        heading: "The main types",
        body: "number, string, boolean, null, undefined. Use typeof to check.",
        code: `console.log(typeof 50);        // number\nconsole.log(typeof "sukuma"); // string\nconsole.log(typeof true);     // boolean`,
      },
      {
        heading: "Template strings",
        body: "Use backticks ` ` and ${ } to mix values into text.",
        code: `let name = "Zuri";\nconsole.log(\`Habari, \${name}!\`);`,
      },
    ],
    game: {
      kind: "match",
      pairs: [
        { left: '"Nairobi"', right: "string" },
        { left: "42", right: "number" },
        { left: "false", right: "boolean" },
        { left: "null", right: "object" },
      ],
    },
    exercises: [
      {
        prompt: 'Print "Mombasa".',
        starter: `// your code\n`,
        expected: "Mombasa",
        hint: 'console.log("Mombasa")',
      },
      {
        prompt: "Use a template string to print: Price is 50",
        starter: `let p = 50;\n// use \`...\`\n`,
        expected: "Price is 50",
        hint: "console.log(`Price is ${p}`)",
      },
    ],
    quiz: [
      {
        q: "typeof null returns?",
        choices: ['"null"', '"object"', '"undefined"', '"empty"'],
        answer: 1,
        explain: "A famous JS quirk: typeof null === 'object'.",
      },
      {
        q: "Which is a string?",
        choices: ["true", "42", '"42"', "null"],
        answer: 2,
        explain: "Quotes make it a string.",
      },
    ],
  },
  {
    id: "operators",
    emoji: "➕",
    title: "M3 — Operators",
    tagline: "Math, compare, and logic",
    level: "Beginner",
    story:
      "Selling chapati: add prices (+), compare ages (>), combine conditions (&&). Operators are tools to compute and compare.",
    lesson: [
      {
        heading: "Arithmetic",
        body: "+ - * / % (remainder) **",
        code: `console.log(10 % 3); // 1\nconsole.log(2 ** 3); // 8`,
      },
      {
        heading: "Comparison & logic",
        body: "=== checks equal (and same type). && is AND, || is OR, ! is NOT.",
        code: `console.log(5 === "5"); // false\nconsole.log(true && false); // false`,
      },
    ],
    game: {
      kind: "predict",
      code: `console.log(7 % 2, 2 ** 4, 10 / 4);`,
      choices: ["1 16 2.5", "1 8 2.5", "3 16 2", "0 8 2.5"],
      answer: 0,
      explain: "7%2=1, 2**4=16, 10/4=2.5.",
    },
    exercises: [
      {
        prompt: "Print whether 12 is even (true/false). Use %.",
        starter: `// your code\n`,
        expected: "true",
        hint: "console.log(12 % 2 === 0)",
      },
      {
        prompt: "Given a=8,b=3 print a*b - a/b (round to 1 decimal okay).",
        starter: `let a = 8, b = 3;\n`,
        expected: "21.333",
        hint: "console.log(a*b - a/b)",
      },
    ],
    quiz: [
      {
        q: "5 === '5' is?",
        choices: ["true", "false", "error", "1"],
        answer: 1,
        explain: "=== checks type too.",
      },
      {
        q: "true || false is?",
        choices: ["true", "false", "null", "error"],
        answer: 0,
        explain: "OR is true if any side is true.",
      },
    ],
  },
  {
    id: "ifs",
    emoji: "🚦",
    title: "M4 — If / Else",
    tagline: "Make choices in code",
    level: "Beginner",
    story:
      "Traffic lights in Kisumu: green = go, red = stop, yellow = slow. if/else lets code choose.",
    lesson: [
      {
        heading: "if / else if / else",
        body: "Check from top to bottom; the first true branch runs.",
        code: `let mark = 72;\nif (mark >= 80) console.log("A");\nelse if (mark >= 60) console.log("B");\nelse console.log("Try again");`,
      },
    ],
    game: {
      kind: "bug",
      buggy: `let rain = true;\nif (rain = false) { console.log("play"); } else { console.log("stay"); }`,
      choices: ["Use === instead of =", "Remove else", "Change true to 1", "Nothing"],
      answer: 0,
      explain: "= assigns; === compares.",
    },
    exercises: [
      {
        prompt: "score=80: print pass if >=50 else try again.",
        starter: `let score = 80;\n`,
        expected: "pass",
        hint: "if (score>=50) console.log('pass')",
      },
      {
        prompt: "Grade ladder: 90+ A, 75+ B, 50+ C, else F. Use n=78.",
        starter: `let n = 78;\n`,
        expected: "B",
        hint: "if/else if chain",
      },
    ],
    quiz: [
      {
        q: "What does else if do?",
        choices: ["Repeats", "Checks another condition", "Stops the program", "Comment"],
        answer: 1,
        explain: "It's a chained check.",
      },
    ],
  },
  {
    id: "switch",
    emoji: "🔀",
    title: "M5 — Switch",
    tagline: "Many branches, one value",
    level: "Beginner",
    story: "Choosing a matatu route by number — switch is neater than many if/else.",
    lesson: [
      {
        heading: "switch / case / break",
        body: "Compare one value to many. Don't forget break or cases fall through.",
        code: `let day = 3;\nswitch(day){\n  case 1: console.log("Mon"); break;\n  case 3: console.log("Wed"); break;\n  default: console.log("Other");\n}`,
      },
    ],
    game: {
      kind: "predict",
      code: `let x = 2;\nswitch(x){ case 1: console.log("a"); case 2: console.log("b"); case 3: console.log("c"); break; default: console.log("d"); }`,
      choices: ["b", "b c", "a b c", "d"],
      answer: 1,
      explain: "No break after case 2, so it falls into case 3 then stops.",
    },
    exercises: [
      {
        prompt: "Given fruit='mango', print 'tamu' for mango, 'chungu' for lemon, else 'ok'.",
        starter: `let fruit = "mango";\n`,
        expected: "tamu",
        hint: "switch(fruit){ case 'mango': ...}",
      },
    ],
    quiz: [
      {
        q: "What keyword prevents fall-through?",
        choices: ["stop", "end", "break", "exit"],
        answer: 2,
        explain: "break exits the switch.",
      },
    ],
  },
  {
    id: "loops",
    emoji: "🔁",
    title: "M6 — Loops",
    tagline: "for, while, do-while",
    level: "Intermediate",
    story: "Counting 100 cows is boring. A loop makes the computer count while you rest.",
    lesson: [
      {
        heading: "for loop",
        body: "for (start; condition; step) { body }",
        code: `for (let i = 1; i <= 3; i++) console.log(i);`,
      },
      {
        heading: "while loop",
        body: "Repeats while a condition is true.",
        code: `let n = 3;\nwhile (n > 0) { console.log(n); n--; }`,
      },
    ],
    game: {
      kind: "predict",
      code: `let total = 0;\nfor (let i = 1; i <= 4; i++) total += i;\nconsole.log(total);`,
      choices: ["6", "10", "8", "4"],
      answer: 1,
      explain: "1+2+3+4 = 10.",
    },
    exercises: [
      {
        prompt: "Print numbers 1 to 4.",
        starter: `// for loop\n`,
        expected: "4",
        hint: "for (let i=1;i<=4;i++) console.log(i)",
      },
      {
        prompt: "Sum 1 to 10 and print the result.",
        starter: `// loop and sum\n`,
        expected: "55",
        hint: "let s=0; for(...) s+=i; console.log(s)",
      },
      {
        prompt: "Print only the EVEN numbers from 1 to 10.",
        starter: `\n`,
        expected: "10",
        hint: "if (i % 2 === 0) console.log(i)",
      },
    ],
    quiz: [
      {
        q: "Which loop is best when you know the count?",
        choices: ["while", "do-while", "for", "switch"],
        answer: 2,
        explain: "for loops are great for counted iteration.",
      },
    ],
  },
  {
    id: "strings",
    emoji: "🔤",
    title: "M7 — Strings",
    tagline: "Working with text",
    level: "Intermediate",
    story: "Names, messages, songs — all are strings. JS gives many tools to work with them.",
    lesson: [
      {
        heading: "Useful methods",
        body: ".length, .toUpperCase(), .toLowerCase(), .includes(), .slice(), .split()",
        code: `let s = "Habari Dunia";\nconsole.log(s.length);            // 12\nconsole.log(s.toUpperCase());     // HABARI DUNIA\nconsole.log(s.includes("Dunia")); // true\nconsole.log(s.split(" "));        // ["Habari","Dunia"]`,
      },
    ],
    game: {
      kind: "fill",
      code: `let name = "amani";\nconsole.log(name.___()); // AMANI`,
      blanks: ["method"],
      answers: ["toUpperCase"],
      explain: "toUpperCase() returns the uppercase version.",
    },
    exercises: [
      {
        prompt: "Print the length of 'Kenya'.",
        starter: ``,
        expected: "5",
        hint: "'Kenya'.length",
      },
      {
        prompt: "Given s='Jambo rafiki' print it in UPPERCASE.",
        starter: `let s = "Jambo rafiki";\n`,
        expected: "JAMBO RAFIKI",
        hint: "s.toUpperCase()",
      },
    ],
    quiz: [
      {
        q: "'hello'.length is?",
        choices: ["4", "5", "6", "error"],
        answer: 1,
        explain: "5 letters.",
      },
    ],
  },
  {
    id: "arrays",
    emoji: "📚",
    title: "M8 — Arrays",
    tagline: "A list of things",
    level: "Intermediate",
    story: "A list of pupils in your class — that's an array. Order matters; counting starts at 0.",
    lesson: [
      {
        heading: "Make and read",
        body: "Index starts at 0. Use .length to know the size.",
        code: `let pupils = ["Amani","Zuri","Juma"];\nconsole.log(pupils[0]);    // Amani\nconsole.log(pupils.length); // 3`,
      },
      {
        heading: "Add and remove",
        body: ".push() adds to end, .pop() removes from end.",
        code: `let a = [1,2];\na.push(3);   // [1,2,3]\na.pop();     // [1,2]`,
      },
    ],
    game: {
      kind: "predict",
      code: `let a = [10,20,30];\na.push(40);\nconsole.log(a[1], a.length);`,
      choices: ["20 4", "10 3", "20 3", "30 4"],
      answer: 0,
      explain: "Index 1 is 20; length after push is 4.",
    },
    exercises: [
      {
        prompt: "Print the 3rd item of [7,8,9,10].",
        starter: ``,
        expected: "9",
        hint: "arr[2]",
      },
      {
        prompt: "Build [1,2,3,4,5] using a loop and push, then print the array length.",
        starter: `let a = [];\n`,
        expected: "5",
        hint: "for(let i=1;i<=5;i++) a.push(i); console.log(a.length)",
      },
    ],
    quiz: [
      {
        q: "First index of an array is?",
        choices: ["1", "0", "-1", "depends"],
        answer: 1,
        explain: "Arrays are zero-indexed.",
      },
    ],
  },
  {
    id: "array-methods",
    emoji: "🛠️",
    title: "M9 — Array power tools",
    tagline: "map, filter, reduce",
    level: "Advanced",
    story:
      "You have a list of mango prices. You can DOUBLE each (map), KEEP cheap ones (filter), or ADD them all (reduce).",
    lesson: [
      {
        heading: "map / filter / reduce",
        body: "map → new list. filter → smaller list. reduce → one value.",
        code: `let n = [1,2,3,4];\nconsole.log(n.map(x => x*2));      // [2,4,6,8]\nconsole.log(n.filter(x => x>2));   // [3,4]\nconsole.log(n.reduce((s,x)=>s+x,0)); // 10`,
      },
    ],
    game: {
      kind: "predict",
      code: `let r = [1,2,3,4].filter(x=>x%2===0).map(x=>x*10);\nconsole.log(r.join(","));`,
      choices: ["10,20,30,40", "20,40", "2,4", "10,30"],
      answer: 1,
      explain: "Keep evens [2,4], then multiply by 10 → [20,40].",
    },
    exercises: [
      {
        prompt: "Given [1,2,3,4,5], print the sum using reduce.",
        starter: `let n = [1,2,3,4,5];\n`,
        expected: "15",
        hint: "n.reduce((s,x)=>s+x,0)",
      },
      {
        prompt: "Given prices=[10,40,50,100], print only those <=50 (use filter).",
        starter: `let prices = [10,40,50,100];\n`,
        expected: "50",
        hint: "prices.filter(p=>p<=50)",
      },
    ],
    quiz: [
      {
        q: "Which gives ONE final value?",
        choices: ["map", "filter", "reduce", "push"],
        answer: 2,
        explain: "reduce collapses an array to a single result.",
      },
    ],
  },
  {
    id: "objects",
    emoji: "📦",
    title: "M10 — Objects",
    tagline: "Group related info together",
    level: "Intermediate",
    story:
      "A pupil has a name, age, and class. Instead of three variables, group them in one object.",
    lesson: [
      {
        heading: "Make and read",
        body: "Use { key: value }. Read with obj.key or obj['key'].",
        code: `let pupil = { name: "Zuri", age: 10, klass: 5 };\nconsole.log(pupil.name, pupil.age);`,
      },
      {
        heading: "Change and add",
        body: "Assign to any key — even a new one.",
        code: `pupil.age = 11;\npupil.school = "Karibu Primary";`,
      },
    ],
    game: {
      kind: "fill",
      code: `let p = { score: 80 };\nconsole.log(p.___); // 80`,
      blanks: ["key"],
      answers: ["score"],
      explain: "Access with dot notation: p.score.",
    },
    exercises: [
      {
        prompt: "Make object cow = {name:'Mara', milk: 12}. Print cow.milk.",
        starter: ``,
        expected: "12",
        hint: "console.log(cow.milk)",
      },
      {
        prompt: "Given pupils = [{n:'A',m:70},{n:'B',m:90}], print the highest m.",
        starter: `let pupils = [{n:"A",m:70},{n:"B",m:90}];\n`,
        expected: "90",
        hint: "Math.max(...pupils.map(p=>p.m))",
      },
    ],
    quiz: [
      {
        q: "How do you read a key called 'name' from obj p?",
        choices: ["p->name", "p.name", "p::name", "p#name"],
        answer: 1,
        explain: "Dot or bracket notation.",
      },
    ],
  },
  {
    id: "functions",
    emoji: "🧰",
    title: "M11 — Functions",
    tagline: "Your reusable recipes",
    level: "Intermediate",
    story:
      "Mama's chapati recipe works every time, with different flour. A function is your reusable recipe.",
    lesson: [
      {
        heading: "Declare and call",
        body: "Take inputs (parameters), do work, return a result.",
        code: `function add(a,b){ return a+b; }\nconsole.log(add(3,4));`,
      },
      {
        heading: "Arrow functions",
        body: "Shorter syntax for small functions.",
        code: `const square = n => n * n;\nconsole.log(square(5));`,
      },
    ],
    game: {
      kind: "fill",
      code: `function double(n){ return n ___ 2; }\nconsole.log(double(4)); // 8`,
      blanks: ["op"],
      answers: ["*"],
      explain: "Multiply by 2 to double.",
    },
    exercises: [
      {
        prompt: "Write add(a,b) and print add(3,4).",
        starter: ``,
        expected: "7",
        hint: "function add(a,b){return a+b}",
      },
      {
        prompt: "Write isEven(n) returning boolean. Print isEven(8).",
        starter: ``,
        expected: "true",
        hint: "n % 2 === 0",
      },
      {
        prompt: "Write greet(name) returning 'Habari, NAME!'. Print greet('Juma').",
        starter: ``,
        expected: "Habari, Juma!",
        hint: "return `Habari, ${name}!`",
      },
    ],
    quiz: [
      {
        q: "What does return do?",
        choices: ["Prints", "Sends a value back", "Stops the app", "Restarts"],
        answer: 1,
        explain: "It hands a value back to the caller.",
      },
    ],
  },
  {
    id: "scope",
    emoji: "🔭",
    title: "M12 — Scope & Closures",
    tagline: "Where variables live",
    level: "Advanced",
    story:
      "A secret recipe inside a kitchen can't be seen from the road. Variables also have a 'room' (scope) they live in.",
    lesson: [
      {
        heading: "Block scope",
        body: "let and const only live inside their { } block.",
        code: `if (true) { let x = 5; }\n// console.log(x) // error: x is not defined`,
      },
      {
        heading: "Closure",
        body: "A function remembers variables from where it was made.",
        code: `function counter(){\n  let n = 0;\n  return () => ++n;\n}\nconst c = counter();\nconsole.log(c(), c()); // 1 2`,
      },
    ],
    game: {
      kind: "predict",
      code: `function make(){ let n=0; return ()=>++n; }\nconst f = make();\nconsole.log(f(), f(), f());`,
      choices: ["1 1 1", "0 1 2", "1 2 3", "Error"],
      answer: 2,
      explain: "Closure keeps n alive between calls.",
    },
    exercises: [
      {
        prompt: "Write a counter that returns next number each call. Print the 2nd call.",
        starter: `function make(){ /* ... */ }\nconst c = make();\nc();\n`,
        expected: "2",
        hint: "let n=0; return ()=>++n",
      },
    ],
    quiz: [
      {
        q: "let inside { } is visible OUTSIDE?",
        choices: ["Yes", "No", "Sometimes", "Only in functions"],
        answer: 1,
        explain: "let is block-scoped.",
      },
    ],
  },
  {
    id: "errors",
    emoji: "🛟",
    title: "M13 — Errors & try/catch",
    tagline: "Catch problems safely",
    level: "Advanced",
    story:
      "A driver carries a spare tyre in case of a puncture. try/catch is a spare tyre for your code.",
    lesson: [
      {
        heading: "try / catch",
        body: "Run risky code in try. If it throws, catch handles it.",
        code: `try {\n  JSON.parse("not json");\n} catch (e) {\n  console.log("Saved!", e.message);\n}`,
      },
    ],
    game: {
      kind: "bug",
      buggy: `try { JSON.parse("oops"); }\n// no catch`,
      choices: ["Add catch (e) { ... }", "Remove try", "Add semicolon", "Nothing"],
      answer: 0,
      explain: "try must be followed by catch or finally.",
    },
    exercises: [
      {
        prompt: "Wrap JSON.parse('bad') in try/catch and print 'caught'.",
        starter: ``,
        expected: "caught",
        hint: "try { JSON.parse('bad') } catch(e){ console.log('caught') }",
      },
    ],
    quiz: [
      {
        q: "What runs when an error happens inside try?",
        choices: ["finally only", "catch", "the next line", "nothing"],
        answer: 1,
        explain: "catch handles thrown errors.",
      },
    ],
  },
  {
    id: "classes",
    emoji: "🏛️",
    title: "M14 — Classes",
    tagline: "Blueprints for objects",
    level: "Advanced",
    story:
      "A blueprint for a matatu lets you build many matatus with different names and routes. Classes are blueprints.",
    lesson: [
      {
        heading: "class & new",
        body: "constructor sets up each new object. Methods are shared.",
        code: `class Cow {\n  constructor(name){ this.name = name; this.milk = 0; }\n  feed(){ this.milk += 1; }\n}\nconst m = new Cow("Mara");\nm.feed(); m.feed();\nconsole.log(m.name, m.milk); // Mara 2`,
      },
    ],
    game: {
      kind: "fill",
      code: `class Dog { constructor(n){ this.n = n; } }\nconst d = ___ Dog("Simba");\nconsole.log(d.n);`,
      blanks: ["keyword"],
      answers: ["new"],
      explain: "Use 'new' to create an instance.",
    },
    exercises: [
      {
        prompt:
          "Make class Pupil(name) with method hello() returning 'Hi, NAME'. Print new Pupil('Zuri').hello().",
        starter: ``,
        expected: "Hi, Zuri",
        hint: "class Pupil{ constructor(n){this.n=n} hello(){return 'Hi, '+this.n} }",
      },
    ],
    quiz: [
      {
        q: "What does 'new' do?",
        choices: ["Renames a class", "Creates a new instance", "Deletes one", "Imports"],
        answer: 1,
        explain: "It builds a fresh object from the class blueprint.",
      },
    ],
  },
  {
    id: "async",
    emoji: "⏳",
    title: "M15 — Async & Promises",
    tagline: "Things that take time",
    level: "Advanced",
    story:
      "Boiling tea takes time — you don't stand frozen, you do other chores. JavaScript also does work without freezing using Promises.",
    lesson: [
      {
        heading: "Promise",
        body: "A promise is a future value: 'I will give you tea... soon'.",
        code: `const p = new Promise(r => setTimeout(()=>r("tea"), 50));\np.then(v => console.log(v));`,
      },
      {
        heading: "async / await",
        body: "Cleaner way to wait for promises.",
        code: `async function brew(){\n  const t = await new Promise(r=>r("chai"));\n  console.log(t);\n}\nbrew();`,
      },
    ],
    game: {
      kind: "predict",
      code: `console.log("A");\nPromise.resolve().then(()=>console.log("B"));\nconsole.log("C");`,
      choices: ["A B C", "A C B", "B A C", "C B A"],
      answer: 1,
      explain: "Promise callbacks run AFTER the current code finishes.",
    },
    exercises: [
      {
        prompt: "Resolve a promise with 'done' and print it via .then.",
        starter: ``,
        expected: "done",
        hint: "Promise.resolve('done').then(v=>console.log(v))",
      },
    ],
    quiz: [
      {
        q: "What does await do?",
        choices: [
          "Stops the program forever",
          "Pauses inside async until promise resolves",
          "Creates a class",
          "Throws an error",
        ],
        answer: 1,
        explain: "await pauses the async function until the value is ready.",
      },
    ],
  },
  {
    id: "dom",
    emoji: "🌍",
    title: "M16 — World of the DOM",
    tagline: "Make web pages come alive with JavaScript",
    level: "Advanced",
    story:
      "Your browser sees the page as a tree of boxes called the DOM (Document Object Model). With JavaScript you can grab any box, change it, add new ones, listen for clicks, and animate the page — like turning the Nairobi market on screen into something you can poke at.",
    lesson: [
      {
        heading: "What is the DOM?",
        body: "Every HTML tag becomes a node in a tree. `document` is the root. From there you can reach every element, change its text, attributes, classes and styles.",
        code: `console.log(document.title);\nconsole.log(document.body.tagName);`,
      },
      {
        heading: "Selecting elements",
        body: "Use querySelector for the first match and querySelectorAll for all matches. CSS selectors work: '#id', '.class', 'tag', 'ul li.active'.",
        code: `const btn = document.querySelector('#start');\nconst items = document.querySelectorAll('.item');\nitems.forEach(el => console.log(el.textContent));`,
      },
      {
        heading: "Reading & changing content",
        body: "textContent reads/sets safe text. innerHTML sets HTML (be careful — never inject untrusted strings). Use setAttribute for attributes.",
        code: `const h1 = document.querySelector('h1');\nh1.textContent = 'Karibu!';\nh1.setAttribute('data-ready', 'yes');`,
      },
      {
        heading: "Classes and styles",
        body: "Use classList.add/remove/toggle to flip CSS classes. style.* for inline styles. Prefer classes over inline styles for design tokens.",
        code: `const card = document.querySelector('.card');\ncard.classList.toggle('open');\ncard.style.transform = 'rotate(2deg)';`,
      },
      {
        heading: "Creating & inserting nodes",
        body: "createElement makes a new node. append/prepend/before/after place it. remove() takes one out.",
        code: `const li = document.createElement('li');\nli.textContent = 'Mango';\ndocument.querySelector('ul').append(li);`,
      },
      {
        heading: "Events: listen & react",
        body: "addEventListener('click', handler) makes the page respond. Event objects carry info: event.target, event.key, event.preventDefault().",
        code: `document.querySelector('#go').addEventListener('click', (e) => {\n  console.log('clicked', e.target.textContent);\n});`,
      },
      {
        heading: "Forms & input",
        body: "Read input.value, listen to 'input' or 'submit'. Call preventDefault on submit to handle it with JavaScript.",
        code: `const f = document.querySelector('form');\nf.addEventListener('submit', (e) => {\n  e.preventDefault();\n  const name = f.querySelector('input').value;\n  console.log('Hi', name);\n});`,
      },
      {
        heading: "Traversal",
        body: "Every node knows its family: parentElement, children, nextElementSibling, previousElementSibling, closest('selector').",
        code: `const item = document.querySelector('.item');\nconsole.log(item.parentElement.tagName);\nconsole.log(item.closest('ul'));`,
      },
      {
        heading: "Event delegation",
        body: "Attach ONE listener on a parent and use event.target to handle many children — fast, and it works for items added later.",
        code: `document.querySelector('ul').addEventListener('click', (e) => {\n  if (e.target.matches('li')) console.log('picked', e.target.textContent);\n});`,
      },
    ],
    game: {
      kind: "predict",
      code: `const d = document.createElement('div');\nd.textContent = 'hi';\nd.classList.add('a','b');\nconsole.log(d.tagName, d.className);`,
      choices: ["DIV a b", "div a,b", "DIV a,b", "div a b"],
      answer: 0,
      explain: "tagName is uppercase. className is the classes joined with spaces.",
    },
    exercises: [
      {
        prompt: "Create a <p> with text 'Habari' and log its textContent.",
        starter: `const p = document.createElement('p');\n// fill in...\nconsole.log(p.textContent);`,
        expected: "Habari",
        hint: "p.textContent = 'Habari';",
      },
      {
        prompt: "Make a <ul> with three <li> mangoes, then log how many <li> it has.",
        starter: `const ul = document.createElement('ul');\n// add three li elements\nconsole.log(ul.children.length);`,
        expected: "3",
        hint: "Loop 3 times: const li = document.createElement('li'); ul.append(li);",
      },
      {
        prompt: "Toggle the class 'on' on a div twice and log classList.contains('on').",
        starter: `const d = document.createElement('div');\n// toggle 'on' twice\nconsole.log(d.classList.contains('on'));`,
        expected: "false",
        hint: "Toggle twice → off again → false.",
      },
      {
        prompt: "Attach a click listener to a button that logs 'clicked', then call button.click().",
        starter: `const b = document.createElement('button');\n// add listener and click it\n`,
        expected: "clicked",
        hint: "b.addEventListener('click', () => console.log('clicked')); b.click();",
      },
      {
        prompt: "Use event delegation: on a ul, log textContent of any clicked li. Append one li with text 'pick-me' and click it.",
        starter: `const ul = document.createElement('ul');\n// delegate, append li, click li\n`,
        expected: "pick-me",
        hint: "li.click() triggers the listener on ul; check e.target.matches('li').",
      },
    ],
    quiz: [
      {
        q: "Which method returns the FIRST element matching a CSS selector?",
        choices: ["getElementsByTagName", "querySelector", "querySelectorAll", "selectFirst"],
        answer: 1,
        explain: "querySelector returns the first match (or null).",
      },
      {
        q: "Which property safely sets plain text inside an element?",
        choices: ["innerHTML", "outerHTML", "textContent", "value"],
        answer: 2,
        explain: "textContent sets text without parsing HTML — safer than innerHTML.",
      },
      {
        q: "How do you stop a form from reloading the page on submit?",
        choices: ["return false in HTML only", "event.stopPropagation()", "event.preventDefault()", "window.stop()"],
        answer: 2,
        explain: "preventDefault cancels the browser's default behavior.",
      },
      {
        q: "What does element.classList.toggle('open') do?",
        choices: [
          "Always adds 'open'",
          "Always removes 'open'",
          "Adds it if missing, removes it if present",
          "Renames the class to 'open'",
        ],
        answer: 2,
        explain: "toggle flips the class on/off.",
      },
      {
        q: "Why use event delegation?",
        choices: [
          "It's the only way to handle clicks",
          "One listener handles many children, including future ones",
          "It makes CSS faster",
          "It avoids JavaScript entirely",
        ],
        answer: 1,
        explain: "One parent listener handles many — including elements added later.",
      },
      {
        q: "Which gives you the closest ancestor matching a selector?",
        choices: ["parentElement", "closest()", "ancestor()", "querySelectorAll()"],
        answer: 1,
        explain: "element.closest('selector') walks up the tree.",
      },
    ],
  },
];

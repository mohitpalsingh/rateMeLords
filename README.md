# rateMeLords: A system to get rating for a skill from LLM models.

## stack:
    Node.Js, PostgreSQL, Gemini

## how to run:
    1. clone the repo
    2. generate your .env file in the root with two key:value,
        i) DATABASE_URL: `your postgres connection string`
        ii) GEMINI_API_KEY: `your google gemini api key`
    3. run `node index.js`

## project structure:
    rateMeLords/
    ├── index.js
    ├── .env
    ├── models/
    │   ├── index.js
    │   ├── Question.js
    │   ├── Answer.js
    │   └── Evaluation.js
    └── routes/
        └── assessment.js


## curls:
1. generateQuestions:
    curl --location 'http://localhost:3000/assessment/generate-questions' \
--header 'Content-Type: application/json' \
--data '{
           "skill": "JavaScript",
           "rubrics": {
             "Basic": "Basic syntax and concepts",
             "Above-Basic": "Basic syntax and concepts",
             "Competent": "Ability to solve typical problems",
             "Proficient": "Efficiency and best practices"
           }
         }'

2. submit-answers:
    curl --location 'http://localhost:3000/assessment/submit-answers' \
--header 'Content-Type: application/json' \
--data '{
    "userId": "48c282a1-8333-4c95-8a0f-3f6d119ae1a4",
    "answers": [
        {
            "questionId": 33,
            "content": "// JavaScript function to add two numbers\nfunction sum(a, b) {\n  return a + b;\n}\n"
        },
        {
            "questionId": 34,
            "content": "// JavaScript code to create an array and iterate over it\nconst myArray = [\"item1\", \"item2\", \"item3\", \"item4\", \"item5\"];\nfor (const item of myArray) {\n  console.log(item);\n}\n"
        },
        {
            "questionId": 35,
            "content": "// JavaScript function to calculate average of an array\nfunction average(numbers) {\n  const sum = numbers.reduce((acc, num) => acc + num, 0);\n  return sum / numbers.length;\n}\n"
        },
        {
            "questionId": 36,
            "content": "// JavaScript function to filter objects based on a property value\nfunction filterByProperty(objects, propertyName, value) {\n  return objects.filter(obj => obj[propertyName] === value);\n}\n"
        },
        {
            "questionId": 37,
            "content": "// JavaScript function to remove vowels from a string\nfunction removeVowels(str) {\n  const vowels = ['\''a'\'', '\''e'\'', '\''i'\'', '\''o'\'', '\''u'\''];\n  return str.replace(/[aeiou]/gi, '\'''\'');\n}\n"
        },
        {
            "questionId": 39,
            "content": "// JavaScript function to get unique elements from an array\nfunction getUnique(arr) {\n  return [...new Set(arr)];\n}\n"
        },
        {
            "questionId": 38,
            "content": "// JavaScript function to check if a string is a palindrome\nfunction isPalindrome(str) {\n  str = str.toLowerCase().replace(/[^a-z]/gi, '\'''\'');\n  return str === str.split('\'''\'').reverse().join('\'''\'');\n}\n"
        },
        {
            "questionId": 40,
            "content": "// JavaScript function to sort objects in an array by property\nfunction sortByProperty(arr, property) {\n  return arr.sort((a, b) => a[property] - b[property]);\n}\n"
        },
        {
            "questionId": 41,
            "content": "// Example using fetch API for asynchronous data fetching\nasync function fetchData() {\n  const response = await fetch('\''https://api.example.com/data'\'');\n  const data = await response.json();\n  // Process and display data\n}\n"
        },
        {
            "questionId": 42,
            "content": "// JavaScript function using closure for counter\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\nconst myCounter = createCounter();\nconsole.log(myCounter()); // Output: 1\nconsole.log(myCounter()); // Output: 2\n"
        }
    ]
}'

3. evaluate-answers:
    curl --location 'http://localhost:3000/assessment/evaluate-answers' \
--header 'Content-Type: application/json' \
--data '{
    "userId": "48c282a1-8333-4c95-8a0f-3f6d119ae1a4",
    "answers": [
        {
            "questionId": 33,
            "answerId": 21
        },
        {
            "questionId": 34,
            "answerId": 22
        },
        {
            "questionId": 35,
            "answerId": 23
        },
        {
            "questionId": 36,
            "answerId": 24
        },
        {
            "questionId": 37,
            "answerId": 25
        },
        {
            "questionId": 38,
            "answerId": 26
        },
        {
            "questionId": 39,
            "answerId": 27
        },
        {
            "questionId": 40,
            "answerId": 28
        },
        {
            "questionId": 41,
            "answerId": 29
        },
        {
            "questionId": 42,
            "answerId": 30
        }
    ],
    "rubrics": {
        "Basic": "Basic syntax and concepts",
        "Above-Basic": "Basic syntax and concepts",
        "Competent": "Ability to solve typical problems",
        "Proficient": "Efficiency and best practices"
    }
}'


## Functioning:
1. generate-questions: returns a set of 10 questions based on the mentioned skill against a unique userId.
2. submit-answers: saves the textual answers against previously returned questions' ids againt the mentioned userId.
3. evaluate-answers: takes in userId, questionId mapped to answerId and rubrics and returns a final rubric as verdict of the evaluation of that user. 

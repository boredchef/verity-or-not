// export const questions = {
//     sports: [
//         {
//             question: "Golf is the only sport that has been played on which celestial body?",
//             answers: [
//                 { text: "The Moon", correct: true },
//                 { text: "Mars", correct: false },
//                 { text: "Venus", correct: false },
//                 { text: "Titan", correct: false }
//             ],
//             duration: 5
//         },
//         {
//             question: "When basketball was first invented in 1891, what objects were used instead of modern hoops?",
//             answers: [
//                 { text: "Peach baskets", correct: true },
//                 { text: "Bucket bins", correct: false },
//                 { text: "Wooden crates", correct: false },
//                 { text: "Laundry hampers", correct: false }
//             ],
//             duration: 5
//         },
//         {
//             question: "How is the Olympic flame traditionally lit before the start of the Games?",
//             answers: [
//                 { text: "Using the sun's rays and a parabolic mirror", correct: true },
//                 { text: "Using a giant ceremonial torch", correct: false },
//                 { text: "With a custom flint striker", correct: false },
//                 { text: "Using a match lit in Olympia", correct: false }
//             ],
//             duration: 5
//         }
//     ],
//     math: [
//         {
//             question: "What is the slope of f(x) = 2x + 3?",
//             answers: [
//                 { text: "2", correct: true },
//                 { text: "3", correct: false },
//                 { text: "1", correct: false },
//                 { text: "2x", correct: false },
//             ]
//         }
//     ],
//     science: [
//         {
//             question: "What is the chemical symbol for gold?",
//             answers: [
//                 { text: "Au", correct: true },
//                 { text: "Ag", correct: false },
//                 { text: "Go", correct: false },
//                 { text: "Gd", correct: false }
//             ]
//         }
//     ]
// }

export const questions = [];

export async function getData(amount, category) {
  let string;
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}`;
  try {
    console.log(`trying this url! ${url}`)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    string = JSON.stringify(result.results);
    // return string;
  } catch (error) {
    console.error(error.message);
  }
  
  return sortToQuestionList(string);
}

function sortToQuestionList(data) {
  const json = JSON.parse(data);
  json.forEach(({ question, correct_answer, incorrect_answers }) => {
    const answers = [ {text: correct_answer, correct: true} ]
    incorrect_answers.forEach(a => {
      answers.push({ text: a, correct: false });
    });
    const addQuestion = {
      question: question.toString(),
      answers: answers,
      duration: 5
    }
    questions.push(addQuestion)
    
  });
  console.log(questions)
  console.log("success!")
}
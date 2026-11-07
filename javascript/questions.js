import { fallbackQuestions } from "../fallback/fallback.js";

export const questions = [];

const userResponseDiv = document.getElementById("user-response-form")
const submitButton = document.getElementById("submit");
const loader = document.getElementById("loader");

export async function getData(amount, category) {
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}`;
  let results;
  let reason = null;

  spinner(true);
  try {
    console.log(`trying this url! ${url}`)
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if(response.status === 429) {
      throw new Error("opentriviadb: too many requests, try again in a bit")
    }
    if (!response.ok) {
      throw new Error(`response status: ${response.status}`);
    }

    const result = await response.json();
    
    if(result.response_code === 1) throw new Error("opentriviadb: not enough questions for this category");
    if(result.response_code === 5) throw new Error("opentriviadb: ratelimited, try again in a bit");


    if(result.response_code !== 0) {
      throw new Error(`opentriviadb error, response_code: ${result.response_code}`);
    }
    
    results = result.results;
  } catch (error) {
    if (error.name === "TimeoutError") {
      reason = "took more than 5 seconds to get a result!";
    } else if (error.name === "TypeError") {
      reason = `couldn't connect to server`;
    } else {
      reason = error.message;
    }

    console.warn("something failed, using fallback: ", error.message);
    results = fallbackQuestions.slice(0, Number(amount))
  } finally {
    spinner(false);
  }

  sortToQuestionList(results);
  return reason;
}

function sortToQuestionList(data) {
  questions.length = 0;
  
  data.forEach(({ question, correct_answer, incorrect_answers }) => {
    const answers = [ {text: correct_answer, correct: true} ]
    const word_count = question.trim().split(/\s+/).length;
    const duration = 8 + ( word_count / 150 ) * 60;

    incorrect_answers.forEach(a => {
      answers.push({ text: a, correct: false });
    });
    const addQuestion = {
      question: question,
      answers: answers,
      duration: duration
    }
    questions.push(addQuestion)
    
  });
  console.log(questions)
  console.log("success!")
}

function spinner(doSpin) {
  if(doSpin == false) {
    userResponseDiv.classList.remove('hide');
    submitButton.classList.remove('hide');
    loader.classList.add('hide');
  }

  if(doSpin == true) {
    userResponseDiv.classList.add('hide');
    submitButton.classList.add('hide');
    loader.classList.remove('hide');
  }
}

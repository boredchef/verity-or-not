export const questions = [];

export async function getData(amount, category) {
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}`;
  try {
    console.log(`trying this url! ${url}`)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`response status: ${response.status}`);
    }

    const result = await response.json();
    
    // from opentriviadb api docs
    if(result.response_code === 1) throw new Error("opentriviadb: not enough questions for this category");
    if(result.response_code === 5) throw new Error("opentriviadb: ratelimited, try again in a bit");


    if(result.response_code !== 0) {
      throw new Error(`opentriviadb error, response_code: ${result.response_code}`);
    }

    sortToQuestionList(result.results);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

function sortToQuestionList(data) {
  questions.length = 0;
  
  data.forEach(({ question, correct_answer, incorrect_answers }) => {
    const answers = [ {text: correct_answer, correct: true} ]
    const word_count = question.trim().split(/\s+/).length;
    const duration = ( word_count / 150 ) * 60;

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

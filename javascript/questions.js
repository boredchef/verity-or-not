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
    console.log(string)
    // return string;
  } catch (error) {
    console.error(error.message);
  }
  
  return sortToQuestionList(string);
}

function sortToQuestionList(data) {
  if(!data) return;
  const json = JSON.parse(data);
  json.forEach(({ question, correct_answer, incorrect_answers }) => {
    const answers = [ {text: correct_answer, correct: true} ]
    console.log(question)
    const word_count = question.trim().split(/\s+/).length;
    console.log(word_count)

    const duration = ( word_count / 150 ) * 60;
    console.log(duration)

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

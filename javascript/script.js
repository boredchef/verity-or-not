import { questions } from './questions.js'

const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')
const reviewButton = document.getElementById('review-btn')

const startScreenElement = document.getElementById('start-screen')
const questionContainerElement = document.getElementById('question-container')
const reviewQuestionContainerElement = document.getElementById('review-container') 
const containerElement = document.getElementById('container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons');

const scoreContainerElement = document.getElementById('score-container')
const highScoreElement = document.getElementById('highscore')
const scoreElement = document.getElementById('score')

let shuffledQuestions, currentQuestionIndex

let timerInterval = null;

class ReviewQuestion {
    constructor(questionNumber, elapsedMs, questionGiven, response, correct) {
        this.questionNumber = questionNumber
        this.elapsedMs = elapsedMs
        this.questionGiven = questionGiven
        this.response = response
        this.correct = correct
    }
}
const askedQuestionsArray = [];


let score = 0, highscore = 0

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})
restartButton.addEventListener('click', startGame)
reviewButton.addEventListener('click', reviewQuestions)

function startGame() {
    console.log('Started')
    askedQuestionsArray.length = 0
    startScreenElement.classList.add('hide')
    scoreContainerElement.classList.add('hide')

    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerElement.classList.remove('hide')
    setNextQuestion()

}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

let startTime;

function showQuestion(question) {
    startTime = Date.now();
    if(question.duration == undefined) {
        startTimer(3 - (score*.25))
    } else {
        startTimer(question.duration - (score*.25))
    }

    questionElement.innerText = question.question
    // shuffling around the answers using same shuffle logic
    const shuffledQuestionAnswers = [...question.answers].sort(() => Math.random() - .5)
    shuffledQuestionAnswers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if(answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })
    
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const questionNumber = shuffledQuestions[currentQuestionIndex]
    const elapsedTime = Date.now() - startTime
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct ?? 'false'

    if(correct) {
        score++  
    } 
    
    const review = (new ReviewQuestion(
            currentQuestionIndex, 
            elapsedTime, 
            questionNumber.question, 
            selectedButton.innerText, 
            correct))
    askedQuestionsArray.push(review)

    setStatusClass(document.body,correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
        button.disabled = true
        button.style.cursor = 'not-allowed'
    })
    if(shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        questionContainerElement.classList.add('hide')
        console.log(askedQuestionsArray)
        updateScore()
    }
    clearInterval(timerInterval);
    timerInterval = null;

}

function showAnswers() {
    const questionNumber = shuffledQuestions[currentQuestionIndex]
    const elapsedTime = Date.now() - startTime

    const review = (new ReviewQuestion(
            currentQuestionIndex, 
            elapsedTime, 
            questionNumber.question, 
            'ommited', 
            'false'))
    askedQuestionsArray.push(review)
    
    setStatusClass(document.body,false)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
        button.disabled = true
        button.style.cursor = 'not-allowed'
    })
    if(shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        questionContainerElement.classList.add('hide')
        updateScore()
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong');
}


function clearScore() {
    if(score > highscore) { 
        highscore = score
    }
    score = 0
}

function updateScore() {
    scoreElement.innerText = score
    clearScore()
    highScoreElement.innerText = highscore
    scoreContainerElement.classList.remove('hide')
}

function startTimer(duration) {
    if(timerInterval !== null) {
        clearInterval(timerInterval);
    }

    const progressBar = document.getElementById('timer-bar');
    const totalTime = duration * 1000;

    let timeRemaining = totalTime;
    timerInterval = setInterval(() => {
        timeRemaining -= 100;

        const percentage = (timeRemaining / totalTime) * 100;

        progressBar.style.width = `${Math.max(0, percentage)}%`

        if(timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            showAnswers()
        }
    }, 100);   
}

function reviewQuestions() {
    
    containerElement.classList.add("hide")
    reviewQuestionContainerElement.classList.remove("hide")

    for(const q of askedQuestionsArray) {
        const question = document.createElement('ul')
        question.innerText = `Question #${q.questionNumber +1}: ${q.questionGiven}`

        const responseGiven = document.createElement('li')
        responseGiven.innerText = `your answer: ${q.response}` 

        const seconds = document.createElement('li')
        seconds.innerText = `you took ${(q.elapsedMs / 1000)} seconds `

        const correct = document.createElement('li')
        const isCorrect = q.correct == 'true'
        correct.innerText = `you got this question ${isCorrect ? "correct!" : "incorrect."}`

        question.append(responseGiven,seconds,correct)
        reviewQuestionContainerElement.append(question)
    }
}
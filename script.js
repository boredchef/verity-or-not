import { questions } from './questions.js'

const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')

const startScreenElement = document.getElementById('start-screen')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons');

const scoreContainerElement = document.getElementById('score-container')
const highScoreElement = document.getElementById('highscore')
const scoreElement = document.getElementById('score')

let shuffledQuestions, currentQuestionIndex

let score = 0, highscore = 0

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})
restartButton.addEventListener('click', startGame)

function startGame() {
    console.log('Started')
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

function showQuestion(question) {
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
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct

    if(correct) {
        score++  
    } 

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
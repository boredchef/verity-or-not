import { questions } from './questions.js'

const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')
const reviewButton = document.getElementById('review-btn')
const backButton = document.getElementById('back-btn')

const startScreenElement = document.getElementById('start-screen')
const questionContainerElement = document.getElementById('question-container')
const reviewQuestionContainerElement = document.getElementById('review-container')
const reviewListElement = document.getElementById('review-list') 
const containerElement = document.getElementById('container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons');
const verdictElement = document.getElementById('verdict');

const scoreContainerElement = document.getElementById('score-container')
const highScoreElement = document.getElementById('highscore')
const scoreElement = document.getElementById('score')

let shuffledQuestions, currentShuffledAnswers = [], currentQuestionIndex;

let timerInterval = null;
let startTime, timerExpire;

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

let score, highscore = 0;

let isAnswered;
let isGameOver;

loadSave()

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})
restartButton.addEventListener('click', startGame)
reviewButton.addEventListener('click', reviewQuestions)
backButton.addEventListener('click', goBack)

document.addEventListener('keypress', (e) => {
    const keyPressed = e.key
    if (keyPressed == "r") {
        const a = confirm("u sure u wanna clear save") 
        if(a) {
            localStorage.removeItem('gameSave')
            window.location.reload();
        } else {
            return;
        }
    }
})

function saveGame() {
    const gameState = {
        score: score,
        highscore: highscore,
        currentIndex: currentQuestionIndex,
        questionHistory: askedQuestionsArray,
        shuffledQuestions: shuffledQuestions,
        currentShuffledAnswers: currentShuffledAnswers,
        isAnswered: isAnswered,
        isGameOver: isGameOver,
        timerExpire: timerExpire,
        startTime: startTime
    };
    localStorage.setItem('gameSave', JSON.stringify(gameState));
}

function loadSave() {
    const savedGame = localStorage.getItem('gameSave');
    if(savedGame) {
        const gameState = JSON.parse(savedGame);
        
        score = gameState.score;
        highscore = gameState.highscore;
        currentQuestionIndex = gameState.currentIndex;
        shuffledQuestions = gameState.shuffledQuestions;
        currentShuffledAnswers = gameState.currentShuffledAnswers || [];
        isAnswered = gameState.isAnswered;
        isGameOver = gameState.isGameOver;
        timerExpire = gameState.timerExpire;
        startTime = gameState.startTime

        askedQuestionsArray.length = 0;
        askedQuestionsArray.push(...gameState.questionHistory)
    }

    if(savedGame && isGameOver == true) {
        startScreenElement.classList.add("hide")
        scoreContainerElement.classList.remove("hide")
    }
    else if(savedGame && currentQuestionIndex >= 0 && isAnswered) {
        startScreenElement.classList.add("hide");
        showQuestion(shuffledQuestions[currentQuestionIndex], true)

        const historyItem = askedQuestionsArray[currentQuestionIndex]
        showAnswers(historyItem ? historyItem.correct : false );
        
        questionContainerElement.classList.remove("hide")
    } 
    else if(savedGame && currentQuestionIndex >= 0 && !isAnswered) {
        startScreenElement.classList.add("hide");
        showQuestion(shuffledQuestions[currentQuestionIndex], true, timerExpire)
        questionContainerElement.classList.remove("hide")
    } 
    else {
        console.log(savedGame)
    }

    if(savedGame && isGameOver === true) {
        startScreenElement.classList.add("hide");
        questionContainerElement.classList.add("hide");

        scoreElement.innerText = score;
        highScoreElement.innerText = highscore;

        verdict();

        scoreContainerElement.classList.remove("hide");
    }
}

function startGame() {
    console.log('Started')
    isGameOver = false;
    clearScore();
    askedQuestionsArray.length = 0
    startScreenElement.classList.add('hide')
    scoreContainerElement.classList.add('hide')

    shuffledQuestions = questions.sort(() => Math.random() - .5)

    currentQuestionIndex = 0
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
    saveGame()

}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question, isRestoring = false, expireTimestamp = null) {
    questionElement.innerText = question.question
    
    let answerButtons;
    if (isRestoring && currentShuffledAnswers.length > 0) {
        answerButtons = currentShuffledAnswers;
    } else { 
        answerButtons = [...question.answers].sort(() => Math.random() - .5);
        currentShuffledAnswers = answerButtons
    }

    answerButtons.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if(answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })

    if(isRestoring && expireTimestamp ) {
        const timeRemaining = expireTimestamp - Date.now();
        if (timeRemaining <= 0) {
            ranOutOfTime();
            return;
        } else {
            startTimer(timeRemaining / 1000);
            return;
        }
    }
    if(isRestoring) { 
        return;
    }
    let durationInSeconds, expirationTime; 
    if(question.duration == undefined) {
        question.duration = 5;
    }
    durationInSeconds = question.duration - (score*.25)

    expirationTime = Date.now() + (durationInSeconds * 1000);
    timerExpire = expirationTime;

    startTimer(durationInSeconds)
    isAnswered = false;
    startTime = Date.now()
    saveGame();
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
    const correct = selectedButton.dataset.correct ?? false

    if(correct) {
        score++  
    } 
    
    const review = new ReviewQuestion(
            currentQuestionIndex, 
            elapsedTime, 
            questionNumber.question, 
            selectedButton.innerText, 
            correct)
    askedQuestionsArray.push(review)
    showAnswers(correct)
    saveGame()
}

function ranOutOfTime() {
    const questionNumber = shuffledQuestions[currentQuestionIndex]
    const elapsedTime = Date.now() - startTime

    const review = (new ReviewQuestion(
            currentQuestionIndex, 
            elapsedTime, 
            questionNumber.question, 
            'ommited', 
            'false'))
    askedQuestionsArray.push(review)
    
    showAnswers(false)
    saveGame()
}

function showAnswers(correct) {
    isAnswered = true;
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
    score = 0
}

function updateScore() {
    isGameOver = true;
    saveGame()
    verdict()
    scoreElement.innerText = score
    if(score > highscore) { 
        highscore = score
    }
    highScoreElement.innerText = highscore
    scoreContainerElement.classList.remove('hide')
}

function verdict() {
    const numQuestions = askedQuestionsArray.length;
    const grade = Math.trunc((score / numQuestions) * 100);
    console.log(grade);
    let gradeMsg = "..."
    if (grade > 70) {
        gradeMsg = `noice.`
    } else if (grade > 60) {
        gradeMsg = `nah.`
    } else if (grade > 50) {
        gradeMsg = `poop`
    } else if (grade > 40) {
        gradeMsg = `brah`
    } else if (grade <= 40) {
        gradeMsg = `restart bro.`
    }
    verdictElement.innerText = `${grade}% correct: ${gradeMsg}`;
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
            ranOutOfTime()
        }
    }, 100);   
}

function reviewQuestions() {
    
    clearStatusClass(document.body)
    containerElement.classList.add("hide")
    reviewListElement.replaceChildren()
    reviewQuestionContainerElement.classList.remove("hide")

    for(const q of askedQuestionsArray) {
        const question = document.createElement('details')
        const sum = document.createElement('summary')

        sum.innerText = `Question #${q.questionNumber +1}: ${q.questionGiven}`
        question.appendChild(sum)

        const responseGiven = document.createElement('p')
        responseGiven.innerText = `your answer: ${q.response}` 

        const seconds = document.createElement('p')
        seconds.innerText = `you took ${(q.elapsedMs / 1000)} seconds `

        const correct = document.createElement('p')
        const isCorrect = q.correct == 'true'
        question.classList.add(isCorrect ? "correct" : "wrong");
        correct.innerText = `you got this question ${isCorrect ? "correct!" : "incorrect."}`

        question.append(responseGiven,seconds,correct)
        reviewListElement.append(question)
    }
}

function goBack() {
    containerElement.classList.remove("hide")
    reviewQuestionContainerElement.classList.add("hide")
}
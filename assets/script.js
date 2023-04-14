// Quiz Questions
const questions = [
    {
        question: "Commonly used data types DO NOT include:",
        options: [
            "strings",
            "booleans",
            "alerts",
            "numbers",
        ],
        answer: "alerts"
    },
    {
        question: "The condition in an if/else statement is enclosed within ____.",
        options: [
            "quotes",
            "curly brackets",
            "parentheses",
            "square brackets",
        ],
        answer: "curly brackets"
    },
    {
        question: "Arrays in JavaScript can be used to store ____.",
        options: [
            "numbers and strings",
            "other arrays",
            "booleans",
            "all of the above",
        ],
        answer: "all of the above"
    },
    {
        question: "String values must be enclosed within ____ when being assigned to variables.",
        options: [
            "commas",
            "curly brackets",
            "quotes",
            "parentheses",
        ],
        answer: "quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        options: [
            "JavaScript",
            "terminal/bash",
            "for loops",
            "console.log",
        ],
        answer: "console.log"
    }
];

// Quiz Settings
const quizSettings = {
    timer: 60,
    penalty: 10,
    nextQuestionDelay: 2 * 1000 // 4 seconds
};

// Quiz Result Classes
const quizResultResponses = {
    correct: {
        class: "results--correct",
        questionResponse: "Correct!",
        resultResponse: "You won!"
    },
    wrong: {
        class: "results--wrong",
        questionResponse: "Wrong! The correct answer is ",
        resultResponse: "You lost! Try again for the high score!"
    }
}

// Quiz State
let currentQuestionIndex = 0;
let timeRemaining = quizSettings.timer;
let score = 0;
let timerId;

// DOM Elements
const startButton = document.getElementById("start");
const startScreen = document.getElementById("quiz-start");
const questionArea = document.getElementById("quiz-question");
const questionText = document.getElementById("question");
const optionsArea = document.getElementById("answers");
const timeText = document.getElementById("time");
const resultText = document.getElementById("question-results")
const finalResultsArea = document.getElementById("quiz-results");
const finalResultsText = document.getElementById("result-message");
const scoreText = document.getElementById("score");
const saveScoreForm = document.getElementById("save-score");
const initialsInput = document.getElementById("initials");
const saveScoreButton = document.getElementById("save");

// Event Listeners
startButton.addEventListener("click", startQuiz);
saveScoreButton.addEventListener("click", saveScore);

// Helper Functions
function startQuiz() {
    startButton.classList.add("hide");
    startScreen.classList.add("hide");

    startTimer();
    renderQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderResponse(result, answer) {
    const response = quizResultResponses[result];
    resultText.classList.add(response.class)
    resultText.textContent = (result == 'correct' ? response.questionResponse : response.questionResponse + answer);

    result != 'correct' ? timeRemaining -= quizSettings.penalty : score++;

    resultText.classList.remove("hide");
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];

    questionText.textContent = question.question;
    optionsArea.innerHTML = "";

    shuffleArray(question.options);

    for (let i = 0; i < question.options.length; i++) {
        const option = question.options[i];
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = option;
        li.appendChild(button);
        button.addEventListener("click", handleAnswer);
        optionsArea.appendChild(li);
    }
}

function removeQuizResultsClasses() {
    resultText.classList.remove(quizResultResponses.correct.class);
    resultText.classList.remove(quizResultResponses.wrong.class);
}

function startTimer() {
    timeText.textContent = timeRemaining;
    timerId = setInterval(() => {
        timeRemaining--;
        timeText.textContent = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timerId);
            endQuiz();
        }
    }, 1000);
}

function handleAnswer(event) {
    const selectedOption = event.target.textContent;
    const question = questions[currentQuestionIndex];

    let result = selectedOption.localeCompare(question.answer);

    result = result == 0 ? 'correct' : 'wrong';

    renderResponse(result, question.answer);

    setTimeout(() => {
        resultText.classList.add("hide");
        removeQuizResultsClasses();

        currentQuestionIndex++;

        if (currentQuestionIndex === questions.length || timeRemaining <= 0) {
            clearInterval(timerId);
            endQuiz();
            return;
        }

        renderQuestion();
    }
        , quizSettings.nextQuestionDelay);

}

function renderResults() {
    finalResultsText.textContent = (score >= questions.length / 2) ? quizResultResponses.correct.resultResponse : quizResultResponses.wrong.resultResponse;
    scoreText.classList.add((score >= questions.length / 2) ? quizResultResponses.correct.class : quizResultResponses.wrong.class);
    scoreText.textContent = score;
    finalResultsArea.classList.remove("hide");
    initialsInput.focus();
}

function saveScore(event) {
    event.preventDefault();
    const initials = initialsInput.value.trim();

    if (initials === "") {
        return;
    }

    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    const newScore = { initials, score };
    highScores.push(newScore);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.href = "highscores.html";
}

function endQuiz() {
    questionArea.classList.add("hide");
    renderResults();
}


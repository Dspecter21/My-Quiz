// Quiz Questions
const questions = [
	{
		question: "Commonly used data types DO NOT include:",
		options: [
			"1. strings",
			"2. booleans",
			"3. alerts",
			"4. numbers",
		],
		answer: "3. alerts"
	},
	{
		question: "The condition in an if/else statement is enclosed within ____.",
		options: [
			"1. quotes",
			"2. curly brackets",
			"3. parentheses",
			"4. square brackets",
		],
		answer: "2. curly brackets"
	},
	{
		question: "Arrays in JavaScript can be used to store ____.",
		options: [
			"1. numbers and strings",
			"2. other arrays",
			"3. booleans",
			"4. all of the above",
		],
		answer: "4. all of the above"
	},
	{
		question: "String values must be enclosed within ____ when being assigned to variables.",
		options: [
			"1. commas",
			"2. curly brackets",
			"3. quotes",
			"4. parentheses",
		],
		answer: "3. quotes"
	},
	{
		question: "A very useful tool used during development and debugging for printing content to the debugger is:",
		options: [
			"1. JavaScript",
			"2. terminal/bash",
			"3. for loops",
			"4. console.log",
		],
		answer: "4. console.log"
	}
];

// Quiz Settings
const quizSettings = {
    timer: 60,
    penalty: 10
};

// Quiz State
let currentQuestionIndex = 0;
let timeRemaining = quizSettings.timer;
let score = 0;
let timerId;

// DOM Elements
const startButton = document.getElementById("start");
const questionArea = document.getElementById("quiz-box");
const questionText = document.getElementById("question");
const optionsArea = document.getElementById("answers");
const timeText = document.getElementById("time");
const resultText = document.getElementById("result");
const scoreText = document.getElementById("score");
const saveScoreForm = document.getElementById("save-score");
const initialsInput = document.getElementById("initials");
const saveScoreButton = document.getElementById("save");

function startQuiz() {
	startButton.classList.add("hide");
	questionArea.classList.remove("hide");
	startTimer();
	renderQuestion();
}

// Helper Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
	questionArea.innerHTML = "";
    optionsArea.innerHTML = "";

    shuffleArray(question.options);
	
    for (let i = 0; i < question.options.length; i++) {
        const option = question.options[i];
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", handleAnswer);
        optionsArea.appendChild(button);
    }
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

	// Guard clause
    if (selectedOption !== question.answer) {
		timeRemaining -= quizSettings.penalty;
        if (timeRemaining < 0) {
			clearInterval(timerId);
			endQuiz();
		}
	}

	score++;
	resultText.textContent = "Correct!";
	resultText.classList.remove("hide");

	setTimeout(() => {
		resultText.classList.add("hide");
	}
	, 1000);

	currentQuestionIndex++;

	if (currentQuestionIndex === questions.length) {
		clearInterval(timerId);
		endQuiz();
	}
}

function renderResults() {
	const score = Math.max(0, timeRemaining);
	scoreText.textContent = score;
	saveScoreForm.classList.remove("hide");
	initialsInput.focus();
}

function saveScore(event) {
	event.preventDefault();
	const initials = initialsInput.value.trim();
	if (initials === "") {
		return;
	}
	const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
	const newScore = {
		initials,
		score
	};
	highScores.push(newScore);
	localStorage.setItem("highScores", JSON.stringify(highScores));
	window.location.href = "highscores.html";
}

function endQuiz() {
	renderResults();
}

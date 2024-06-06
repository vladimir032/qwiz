const questions = [
    {
        question: "How many planets are in the solar system?",
        answers: [
            { text: "8", correct: true },
            { text: "9", correct: false },
            { text: "6", correct: false },
            { text: "10", correct: false }
        ]
    },
    {
        question: "What is the freezing point of water?",
        answers: [
            { text: "0", correct: true },
            { text: "-5", correct: false },
            { text: "-1", correct: false },
            { text: "-6", correct: false }
        ]
    },
    {
        question: "What is the capital of Belarus?",
        answers: [
            { text: "Minsk", correct: true },
            { text: "Moscow", correct: false },
            { text: "Grodno", correct: false },
            { text: "Kiyv", correct: false }
        ]

    },
    {
        question: "Which of these countries are in the northern hemisphere of the Earth?",
        answers: [
            { text: "Finland", correct: true },
            { text: "Australia", correct: false },
            { text: "Somali", correct: false },
            { text: "France", correct: true }
        ],
        multiple: true
    },
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswers = [];

const questionCounterElement = document.getElementById('question-counter');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const resultContainer = document.getElementById('result-container');
const resultElement = document.getElementById('result');
const restartButton = document.getElementById('restart-btn');

nextButton.addEventListener('click', () => {
    evaluateAnswer();
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setNextQuestion();
    } else {
        showResult();
    }
});

prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        setNextQuestion();
    }
});

restartButton.addEventListener('click', startQuiz);

function startQuiz() {
    clearQuizState();
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers = [];
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    nextButton.classList.remove('hidden');
    prevButton.classList.remove('hidden');
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
    updateQuestionCounter();
    toggleNavigationButtons();
    saveQuizState();  // Сохраняем состояние квиза
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
    if (question.multiple) {
        const info = document.createElement('div');
        info.innerText = "This question has multiple correct answers.";
        info.classList.add('info');
        questionContainer.appendChild(info);
    }
}

function resetState() {
    nextButton.classList.add('hidden');
    selectedAnswers = [];
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    const info = document.querySelector('.info');
    if (info) {
        info.remove();
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    selectedButton.classList.add(correct ? 'correct' : 'wrong');
    selectedButton.disabled = true;
    selectedAnswers.push(correct);
    if (questions[currentQuestionIndex].multiple || selectedAnswers.length === 1) {
        nextButton.classList.remove('hidden');
    }
    saveQuizState();  // Сохраняем состояние
}

function evaluateAnswer() {
    const question = questions[currentQuestionIndex];
    const correctAnswers = question.answers.filter(a => a.correct).length;
    const selectedCorrectAnswers = selectedAnswers.filter(a => a).length;
    const selectedIncorrectAnswers = selectedAnswers.length - selectedCorrectAnswers;

    if (selectedCorrectAnswers === correctAnswers && selectedIncorrectAnswers === 0) {
        score++;
    } else if (question.multiple && selectedCorrectAnswers > 0) {
        score += 0.5;
    }
    saveQuizState();  // Сохраняем состояние
}

function updateQuestionCounter() {
    questionCounterElement.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

function showResult() {
    questionContainer.classList.add('hidden');
    nextButton.classList.add('hidden');
    prevButton.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultElement.innerText = `You scored ${score} out of ${questions.length}!`;
    clearQuizState();  // Очищаем состояние
}

function toggleNavigationButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.innerText = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next';
}

//работа с localstorage
function saveQuizState() {
    const state = {
        currentQuestionIndex,
        score,
        selectedAnswers
    };
    localStorage.setItem('quizState', JSON.stringify(state));
}

function loadQuizState() {
    const state = JSON.parse(localStorage.getItem('quizState'));
    if (state) {
        currentQuestionIndex = state.currentQuestionIndex;
        score = state.score;
        selectedAnswers = state.selectedAnswers;
    }
}

function clearQuizState() {
    localStorage.removeItem('quizState');
}

// Загрузка состояния квиза при загрузке страницы
loadQuizState();

// Начало викторины и проверка состояния
if (currentQuestionIndex < questions.length) {
    setNextQuestion();
} else {
    showResult();
}

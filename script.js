const questions = [
  {
    question: "What was the name of the Black family’s house elf?",
    answers: [
      { text: "Dobby", correct: false},
      { text: "Kreacher", correct: true},
      { text: "Winky", correct: false},
      { text: "Hokey", correct: false},
    ]
  },
  {
    question: "What is the capital of Ukraine?",
    answers: [
      { text: "London", correct: false},
      { text: "Lviv", correct: false},
      { text: "Copenhagen", correct: false},
      { text: "Kyiv", correct: true},
    ]
  },
  {
    question: "In what year did the First World War end?",
    answers: [
      { text: "1865", correct: false},
      { text: "1945", correct: false},
      { text: "1918", correct: true},
      { text: "1907", correct: false},
    ]
  },
  {
    question: "The tears of which animal are the only known antidote to basilisk venom?",
    answers: [
      { text: "Phoenix", correct: true},
      { text: "Billywig", correct: false},
      { text: "Hippogriff", correct: false},
      { text: "Demiguise", correct: false},
    ]
  },
  {
    question: "In which city might you find the Petronas Twin Towers?",
    answers: [
      { text: "Singapore", correct: false},
      { text: "Tokyo", correct: false},
      { text: "Bangkok", correct: false},
      { text: "Kuala Lumpur", correct: true},
    ]
  }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const startQuizBtn = document.getElementById("start-quiz-btn");
const player1Info = document.getElementById("player1-info");
const player2Info = document.getElementById("player2-info");

let player1 = "";
let player2 = "";

startQuizBtn.addEventListener("click", () => {
  player1 = player1Input.value.trim();
  player2 = player2Input.value.trim();

  if (player1 !== "" && player2 !== "") {
    startQuiz();
    updatePlayerInfo();
  } else {
    alert("Please enter names for both players.");
  }
});

function updatePlayerInfo() {
  player1Info.innerHTML = `${player1}: ${score} points`;
  player2Info.innerHTML = `${player2}: ${score} points`;
}


function startQuiz(){
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion(){
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if(answer.correct){
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState(){
  nextButton.style.display = "none";
  while(answerButtons.firstChild){
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

// Audio elements for correct, incorrect, and quiz completion sounds

const correctSound = new Audio('./sounds/correct.mp3');
const incorrectSound = new Audio('./sounds/incorrect.mp3');
const quizCompletionSound = new Audio('./sounds/completion.mp3');

function selectAnswer(e){
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  
  if(isCorrect){
    selectedBtn.classList.add("correct");
    score++;
    playSound(correctSound);
  }else{
    selectedBtn.classList.add("incorrect");
    playSound(incorrectSound);
  }
  
  Array.from(answerButtons.children).forEach(button => {
    if(button.dataset.correct === "true"){
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore(){
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
  playSound(quizCompletionSound);
}

function playSound(audioElement) {
  if (audioElement) {
    audioElement.play();
  }
}

function handleNextButton(){
  currentQuestionIndex++;
  if(currentQuestionIndex < questions.length){
    showQuestion();
  }else{
    showScore();
  }
}

nextButton.addEventListener("click", ()=>{
  if(currentQuestionIndex < questions.length){
    handleNextButton();
  }else{
    startQuiz();
  }
});

startQuiz();

//Show Question List

const questionListContainer = document.createElement("div");
questionListContainer.id = "question-list-container";
questionListContainer.style.display = "none";
document.body.appendChild(questionListContainer);

function showQuestionList() {
  questionListContainer.innerHTML = "";

  questions.forEach((question, index) => {
    const questionItem = document.createElement("div");
    questionItem.classList.add("question-item");

    const questionTitle = document.createElement("p");
    questionTitle.innerHTML = `${index + 1}. ${question.question}`;
    questionItem.appendChild(questionTitle);

    const optionsList = document.createElement("ul");

    question.answers.forEach(answer => {
      const optionItem = document.createElement("li");
      optionItem.innerHTML = answer.text;
      optionsList.appendChild(optionItem);
    });

    questionItem.appendChild(optionsList);

    questionListContainer.appendChild(questionItem);
  });

  const revealAnswersButton = document.createElement("button");
  revealAnswersButton.innerHTML = "Show Answers";
  revealAnswersButton.addEventListener("click", revealAnswers);
  questionListContainer.appendChild(revealAnswersButton);

  questionListContainer.style.display = "block"; 
}

function revealAnswers() {
  const questionItems = document.querySelectorAll(".question-item");

  questionItems.forEach((questionItem, index) => {
    const correctAnswerIndex = questions[index].answers.findIndex(answer => answer.correct);

    const optionsList = questionItem.querySelector("ul");
    const optionItems = optionsList.querySelectorAll("li");

    optionItems[correctAnswerIndex].classList.add("correct");
  });
}


document.getElementById("show-all-questions-btn").addEventListener("click", showQuestionList);

function searchQuestions(searchTerm) {
  const filteredQuestions = questions.filter(question => {
    return question.question.toLowerCase().includes(searchTerm.toLowerCase());
  });

  resetState();

  if (filteredQuestions.length > 0) {
    currentQuestionIndex = 0;
    questions.length = 0;
    questions.push(...filteredQuestions);
    showQuestion();
  } else {
    questionElement.innerHTML = "No matching questions found.";
  }
}

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    searchQuestions(searchTerm);
  }
});

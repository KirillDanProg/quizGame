const box = document.querySelector(".quiz__box");
const start = document.querySelector(".start");
const scale = document.querySelector(".scale");
const urlQuiz = "https://the-trivia-api.com/api/questions?categories=film_and_tv,geography&limit=1&region=US&difficulty=easy";
let arr = [];
let count = 100;
let score = 0;
let timer = true;
let limit = null;
let correctAnswer = "";
let arrNum = [];
let i = 0;
let intervalID = null

start.addEventListener("click", getQuiz);
// box.addEventListener("click", checkAnswer);

function getQuiz() {
  limit++;
  
  if (limit <= 10) {
    fetch(urlQuiz)
      .then((resp) => resp.json())
      .then((qns) =>
        qns.forEach((qn) => {
          box.innerHTML = nextQn(qn);
        })
      )
      .then(() => {
        scale.style.display = "block";
  console.log(correctAnswer)

        scaleStart();
        box.addEventListener("click", checkAnswer);
      });
    scale.style.backgroundColor = "green";
  } else {
    showResult();
  }
}

function showResult() {
  scale.style.display = "none";
  box.innerHTML = `Your score: ${score}`;
  let tryAgain = document.createElement("div");
  tryAgain.innerHTML = "try again";
  tryAgain.classList.add("try-again");
  box.appendChild(tryAgain);
  tryAgain.addEventListener("click", getQuiz);
  limit = 0;
  score = 0;
}

function getNum() {
  while (arrNum.length < 4) {
    let num = Math.floor(Math.random() * 4);
    if (!arrNum.includes(num)) {
      arrNum.push(num);
    }
    i++;
  }
  return arrNum;
}

function nextQn(data) {
  box.innerHTML = "";


  correctAnswer = data.correctAnswer;
  let incorrectAnswers = data.incorrectAnswers;
  let optionList = incorrectAnswers;
  optionList.splice(
    Math.floor(Math.random() * incorrectAnswers.length + 1),
    0,
    correctAnswer
  );

  return `
  <div class="question">${data.question}</div>
   ${optionList.map((option) => `<div class="answer">${option}</div>`).join("")}
    `;
}

function checkAnswer(e) {

  let target = e.target;
  if (
    target.innerHTML !== correctAnswer &&
    target.classList.contains("answer")
  ) {
    target.style.backgroundColor = "red";
    showCorrectAnswer()
  } else if (
    target.innerHTML === correctAnswer &&
    target.classList.contains("answer")
  ) {
    target.style.backgroundColor = "green";
    score++;
    clearInterval(intervalID)
    getQuiz();
  }
}

function showCorrectAnswer() {
  clearInterval(intervalID);
  box.removeEventListener("click", checkAnswer);

  box.innerHTML += `
  <div class="correct-answer">The answer is: ${correctAnswer}</div>
  `
  setTimeout(() => getQuiz(), 2500)
}

function scaleStart() {
  count = 100;
  intervalID = setInterval(() => {
    count -= 0.1;
    if (count < 50) {
      scale.style.backgroundColor = "yellow";
    }
    if (count < 20) {
      scale.style.backgroundColor = "red";
    }
    if (count < 1) {
      clearInterval(intervalID);
      timer = true;
      getQuiz();
    }
    scale.style.width = `${count}%`;
  }, 20);
  if (!timer) {
    clearInterval(intervalID);
  }
  scale.style.backgroundColor = "green";
  scale.classList.add("scale-active");
}



const box = document.querySelector(".quiz__box");
const start = document.querySelector(".start");
const scale = document.querySelector(".scale");
const urlQuiz = "https://the-trivia-api.com/api/questions?limit=1";
let arr = [];
let count = 100;
let score = 0;
let timer = true;
let limit = null;
let correctAnswer = ""

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
        scaleStart();
      });
    scale.style.backgroundColor = "green";
  } else {
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
}

let arrNum = [];
let i = 0;
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
   correctAnswer = data.correctAnswer;
  let incorrectAnswers = data.incorrectAnswers;
  let optionList = incorrectAnswers;
  optionList.splice(
    Math.floor(Math.random() * incorrectAnswers.length + 1),
    0,
    correctAnswer
  );

  box.innerHTML = "";
  
 
  return `
  <div class="question">${data.question}</div>
   ${optionList.map((option) => `<div class="answer">${option}</div>`).join("")}
    `;
}

function checkAnswer(e) {
  let target = e.target;
  if (target.innerHTML !== correctAnswer && target.classList.contains("answer")) {
    target.style.backgroundColor = "red";
    timer = false;
    getQuiz();
  } else if (target.innerHTML === correctAnswer && target.classList.contains("answer")) {
    target.style.backgroundColor = "green";
    score++;
    timer = false;
    getQuiz();
  }
}

function scaleStart() {
  count = 100;
  let intervalID = setInterval(() => {
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
start.addEventListener("click", getQuiz);
box.addEventListener("click", checkAnswer);

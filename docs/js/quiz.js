import { getCurrentQuestion, passCurrentQuestion } from "./Model/QuestionHandler.js";

// Constantes do HTML
const divIntro = document.querySelector(".qst-intro");
const divMain = document.querySelector(".qst-main");
const divDica = document.querySelector(".qst-dica");
const divEnd = document.querySelector(".qst-end");

const questionCounter = document.querySelector("#spanQst");
const pPergunta = document.querySelector("#pPergunta");
const spanDica = document.querySelector("#spanDica");
const spanAcertos = document.querySelector("#spanAcertos");
const spanTotal = document.querySelector("#spanTotal");

const btnIntro = document.querySelector("#btnStart");
const btnsOpcoes = document.querySelectorAll(".btnOpcao");


let QuestionHandler;
let question;





function setupQuestion(currentQuestion) {

    for (let i = 0; i < btnsOpcoes.length; i++) {
        btnsOpcoes[i].innerHTML = currentQuestion.opcoes[i + 1];
        btnsOpcoes[i].id = i + 1;
    }

    pPergunta.innerHTML = currentQuestion.pergunta;

}

function introButton() { divIntro.style.display = "none"; divMain.style.display = "flex"; }

async function initializeQuiz() {
    QuestionHandler = await getCurrentQuestion();
    question = QuestionHandler.currentQuestion;
    setupQuestion(question);
    btnIntro.addEventListener("click", introButton);
}


initializeQuiz();

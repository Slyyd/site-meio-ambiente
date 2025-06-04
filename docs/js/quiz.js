import { getCurrentQuestion, passCurrentQuestion } from "./Model/QuestionHandler.js";

// Divs
const divIntro = document.querySelector(".qst-intro");
const divMain = document.querySelector(".qst-main");
const divDica = document.querySelector(".qst-dica");
const divEnd = document.querySelector(".qst-end");

// Elementos que mostram dados
const questionCounter = document.querySelector("#spanQst");
const pPergunta = document.querySelector("#pPergunta");
const pDica = document.querySelector("#pDica");
const pRespostaCorreta = document.querySelector("#pRespostaCorreta");
const pRespostaUsuario = document.querySelector("#pRespostaUsuario")
const spanAcertos = document.querySelector("#spanAcertos");
const spanTotal = document.querySelector("#spanTotal");

// Botoes da página
const btnIntro = document.querySelector("#btnStart");
const btnsOpcoes = document.querySelectorAll(".btnOpcao");
const btnAdvice = document.querySelector("#btnProximaDica");
const btnEnd = document.querySelector("#btnEnd");

let quantidadeDeQuestoes = 14; // Número total de questões - 1

let QuestionHandler; // Modulo com funções das questões
let question; // Objeto da classe Question

// Funções principais

async function setupQuestion() {

    QuestionHandler = getCurrentQuestion(quantidadeDeQuestoes);
    question = (await QuestionHandler).currentQuestion;

    for (let i = 0; i < btnsOpcoes.length; i++) {
        btnsOpcoes[i].innerHTML = await question.opcoes[i + 1];
        btnsOpcoes[i].id = i + 1;
        btnsOpcoes[i].removeEventListener("click", selectButton);
        btnsOpcoes[i].addEventListener("click", selectButton);
    }

    pPergunta.innerHTML = question.pergunta;
    questionCounter.textContent = (await QuestionHandler).questionCounter + 1;

}

// Funções de troca de página

async function endQuiz() {

    divDica.classList.remove("divActive-InFlex");
    divEnd.classList.add("divActive-Flex");
    spanAcertos.textContent = (await QuestionHandler).pointsCounter;
    spanTotal.textContent = quantidadeDeQuestoes + 1;

}

async function showAdvice(respostaEscolhida) {

    if ((await QuestionHandler).hasEnded == true) { btnAdvice.removeEventListener("click", adviceButton); btnAdvice.addEventListener("click", endQuiz); btnAdvice.textContent = "Terminar"; }
    divMain.classList.remove("divActive-Flex")
    pRespostaUsuario.textContent = question.opcoes[respostaEscolhida];
    pRespostaCorreta.textContent = question.opcoes[question.resposta];
    pRespostaCorreta
    pDica.textContent = question.dica;
    divDica.classList.add("divActive-InFlex")
}

// Funções dos botões

async function selectButton() {

    showAdvice(this.id);
    passCurrentQuestion(this.id);
    setupQuestion();
}

function introButton() { divIntro.classList.remove("divActive-Block"); divMain.classList.add("divActive-Flex"); }
function adviceButton() { divDica.classList.remove("divActive-InFlex"); divMain.classList.add("divActive-Flex"); }

async function initializeQuiz() {

    setupQuestion();
    btnIntro.addEventListener("click", introButton);
    btnAdvice.addEventListener("click", adviceButton);
    btnEnd.addEventListener("click", () => {location.reload();});

}

initializeQuiz();

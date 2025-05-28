/*
-- QuestionHandler.js --

Como funciona:

getCurrentQuestion() :
    retorna um [] organizado por:
        currentQuestion: questão atual, feito sobre a classe Question,
        questionCounter: contagem das questões,
        pointsCounter: acertos do usuário,
        hasEnded: booleano que indica se as questões acabaram
    tem que ser acompanhado por um await quando for chamado em outro arquivo.

passCurrentQuestion(hasScored) :
    recebe um valor booleano que indica se o usuário acertou ou não
    não retorna nada
    é chamado quando o usuário responde uma questão.

*/



import Question from "./Question.js";

const QuestionFile = "questions.json"; // Caminho do .json
let questionCounter = 0; // Contador das questões
let pointsCounter = 0; // Contador de pontos
let hasEnded = false;

let currentQuestionList = await fetchJson();

export async function getCurrentQuestion() {
    if (currentQuestionList == null) { currentQuestionList = await fetchJson(); }
    if (currentQuestionList.length - 1 < questionCounter) {
        hasEnded = true;
    }
    let currentQuestion = currentQuestionList[questionCounter]

    return {
        "currentQuestion": currentQuestion,   // Questão da classe Question
        "questionCounter": questionCounter,   // Número atual da questão
        "pointsCounter": pointsCounter,       // Pontuação atual
        "hasEnded": hasEnded                  // Indica se as perguntas acabaram
    };
}

export function passCurrentQuestion(hasScored) {

    if (hasScored) {
        pointsCounter++;
    }

    questionCounter++

}

async function fetchJson() {

    try {

        const dados = await fetch(QuestionFile); // Lê o .json que contêm as perguntas
        if (!dados.ok) { throw new Error("Falha no Fetch"); }
        let questionList = createClasses(await dados.json());
        return questionList;

    } catch (err) {
        console.error(err);
    }

}

function createClasses(questions) {
    // Pega as questões, cria várias instâncias da mesma classe e armazena elas em uma lista

    let questionsClasses = questions.map(q =>
        new Question(q.questao, q.opcoes, q.resposta, q.dica, q.nivel)
    );

    return shuffleQuestions(questionsClasses);

    /* Sistema antigo
    for (const question in questions) {
        newQuestionArray[question] = new Question(
            questions[question].questao,
            questions[question].opcoes,
            questions[question].resposta,
            questions[question].nivel
        )
    }

    return shuffleQuestions(newQuestionArray);
    */
}

function shuffleQuestions(questionList) {
    /*
    Usa o método de Fisher Yates
    Explicação:
    https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    */

    let newList = [...questionList];

    for (let i = newList.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));
        let k = newList[i];

        newList[i] = newList[j];
        newList[j] = k;

    }
    return newList; // Retorna a lista aleatória

}